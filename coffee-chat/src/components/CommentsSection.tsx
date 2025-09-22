'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Comment {
  id: string;
  text: string;
  author: {
    name: string;
    email: string;
    uid: string;
  };
  likes: string[];
  createdAt: any;
}

interface CommentsSectionProps {
  onOpenAuth?: () => void;
}

export default function CommentsSection({ onOpenAuth }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData: Comment[] = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(commentsData);
    });

    return unsubscribe;
  }, []);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'comments'), {
        text: newComment.trim(),
        author: {
          name: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          email: user.email,
          uid: user.uid
        },
        likes: [],
        createdAt: serverTimestamp()
      });

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string, currentLikes: string[]) => {
    if (!user) return;

    const commentRef = doc(db, 'comments', commentId);
    const userHasLiked = currentLikes.includes(user.uid);

    try {
      if (userHasLiked) {
        await updateDoc(commentRef, {
          likes: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(commentRef, {
          likes: arrayUnion(user.uid)
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openAuthModal = () => {
    if (onOpenAuth) {
      onOpenAuth();
    }
  };

  return (
    <section className="comments-section">
      <div className="comments-container">
        <h2 className="comments-title">Community Coffee Discussions</h2>

        {user ? (
          <div className="comment-input-container">
            <form onSubmit={handleSubmitComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about coffee, ask questions, or tell us about your favorite coffee experiences..."
                className="comment-input"
                rows={4}
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="comment-submit"
              >
                {loading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>
        ) : (
          <div className="sign-in-prompt">
            <p>Join our coffee community! Sign in to share your thoughts and connect with fellow coffee enthusiasts.</p>
            <button onClick={openAuthModal}>Sign In to Comment</button>
          </div>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No comments yet. Be the first to share your coffee thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.author.name}</span>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-actions">
                  <button
                    onClick={() => handleLike(comment.id, comment.likes || [])}
                    className={`like-button ${
                      user && comment.likes?.includes(user.uid) ? 'liked' : ''
                    }`}
                    disabled={!user}
                  >
                    <span>♥</span>
                    <span>{comment.likes?.length || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}