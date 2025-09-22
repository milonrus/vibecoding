'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Message {
  id: string;
  text: string;
  role: 'user' | 'ai';
  timestamp: any;
}

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) return;

    // Only redirect if we're sure user is not authenticated
    if (!user) {
      console.log('No user found, redirecting to home');
      router.push('/');
      return;
    }

    console.log('User authenticated:', user.email);

    const q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messagesData);
    });

    return unsubscribe;
  }, [user, authLoading, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveMessageToFirestore = async (text: string, role: 'user' | 'ai') => {
    if (!user) return;

    try {
      console.log(`Saving ${role} message:`, text);
      await addDoc(collection(db, 'chatMessages'), {
        text,
        role,
        userId: user.uid,
        timestamp: serverTimestamp()
      });
      console.log(`${role} message saved successfully`);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setIsTyping(true);

    // Add user message to local state immediately (for instant display)
    const tempUserMessage: Message = {
      id: 'temp-user-' + Date.now(),
      text: userMessage,
      role: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    // Save user message to Firestore (in background)
    await saveMessageToFirestore(userMessage, 'user');

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' as const : 'user' as const,
        content: msg.text
      }));

      chatHistory.push({ role: 'user', content: userMessage });

      console.log('Sending request to OpenAI API...');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();
      console.log('OpenAI API response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Add AI response to local state immediately (for instant display)
      const tempAiMessage: Message = {
        id: 'temp-ai-' + Date.now(),
        text: data.message,
        role: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, tempAiMessage]);

      // Save AI response to Firestore (in background)
      console.log('Saving AI response...');
      await saveMessageToFirestore(data.message, 'ai');
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to local state immediately
      const errorMessage: Message = {
        id: 'temp-error-' + Date.now(),
        text: 'Sorry, I encountered an error. Please try again.',
        role: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);

      // Save error message to Firestore (in background)
      await saveMessageToFirestore(
        'Sorry, I encountered an error. Please try again.',
        'ai'
      );
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
        <div className="text-lg">Loading authentication...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="chat-container">
          <div className="chat-header">
            <h1 className="text-xl font-bold">☕ Coffee Consultant</h1>
            <p className="text-sm opacity-90">
              Get personalized coffee recommendations from our expert
            </p>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="message ai">
                <div>
                  Welcome to Not a Tourist's AI Coffee Consultant! ☕<br/><br/>
                  I'm here to help you discover the perfect coffee for your taste preferences.
                  Whether you're looking for something bold and rich, light and fruity, or
                  somewhere in between, I can guide you to your ideal cup.<br/><br/>
                  What kind of coffee experience are you looking for today?
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.role}`}
              >
                {message.text}
              </div>
            ))}

            {isTyping && (
              <div className="message ai">
                <div className="typing-indicator">
                  <span>Coffee consultant is typing</span>
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chat-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about coffee recommendations, brewing tips, or anything coffee-related..."
              className="chat-input"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="chat-send"
            >
              {loading ? '...' : '→'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}