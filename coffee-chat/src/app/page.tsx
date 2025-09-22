'use client';

import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import CommentsSection from '@/components/CommentsSection';
import { useAuthModal } from '@/hooks/useAuthModal';

export default function Home() {
  const mouseTrailRef = useRef<HTMLDivElement>(null);
  const coffeeBeansLayerRef = useRef<HTMLDivElement>(null);
  const { isOpen, openModal, closeModal } = useAuthModal();

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let animationId: number;

    const mouseTrail = mouseTrailRef.current;
    const floatingElements = document.querySelectorAll('.floating-element');

    function createCoffeeBeans() {
      const numBeans = 20;
      for (let i = 0; i < numBeans; i++) {
        const bean = document.createElement('div');
        bean.className = 'coffee-bean';
        bean.style.left = Math.random() * (window.innerWidth - 20) + 10 + 'px';
        bean.style.top = Math.random() * (window.innerHeight - 20) + 10 + 'px';
        bean.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(bean);
      }
    }

    function updateMouseTrail() {
      trailX += (mouseX - trailX) * 0.1;
      trailY += (mouseY - trailY) * 0.1;
      if (mouseTrail) {
        mouseTrail.style.left = trailX + 'px';
        mouseTrail.style.top = trailY + 'px';
      }
      animationId = requestAnimationFrame(updateMouseTrail);
    }

    function createSteamParticle(x: number, y: number) {
      const particle = document.createElement('div');
      particle.className = 'steam-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      document.body.appendChild(particle);

      let particleY = y;
      let opacity = 0.8;

      const animateParticle = () => {
        particleY -= 2;
        opacity -= 0.02;
        particle.style.top = particleY + 'px';
        particle.style.opacity = opacity.toString();

        if (opacity > 0 && particleY > -10) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
        }
      };

      particle.style.opacity = opacity.toString();
      requestAnimationFrame(animateParticle);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const deltaX = (mouseX - centerX) / centerX;
      const deltaY = (mouseY - centerY) / centerY;

      floatingElements.forEach((element, index) => {
        const multiplier = (index % 2 === 0) ? 1 : -1;
        const intensity = 15;

        const translateX = deltaX * intensity * multiplier;
        const translateY = deltaY * intensity * multiplier;

        (element as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px)`;
      });

      const coffeeBeans = document.querySelectorAll('.coffee-bean');
      coffeeBeans.forEach((bean) => {
        const rect = bean.getBoundingClientRect();
        const beanCenterX = rect.left + rect.width / 2;
        const beanCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(mouseX - beanCenterX, 2) + Math.pow(mouseY - beanCenterY, 2)
        );

        if (distance < 150) {
          const force = (150 - distance) / 150;
          const angle = Math.atan2(beanCenterY - mouseY, beanCenterX - mouseX);

          const pushX = Math.cos(angle) * force * 30;
          const pushY = Math.sin(angle) * force * 30;
          const rotation = force * 360 + Math.random() * 180;

          (bean as HTMLElement).style.transform = `translate(${pushX}px, ${pushY}px) rotate(${rotation}deg) scale(${1 + force * 0.5})`;
          (bean as HTMLElement).style.opacity = (0.7 + force * 0.3).toString();
          (bean as HTMLElement).style.filter = `brightness(${1 + force * 0.3})`;
        } else {
          (bean as HTMLElement).style.transform = `translate(0px, 0px) rotate(${Math.random() * 360}deg) scale(1)`;
          (bean as HTMLElement).style.opacity = '0.7';
          (bean as HTMLElement).style.filter = 'brightness(1)';
        }
      });

      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const itemCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(mouseX - itemCenterX, 2) + Math.pow(mouseY - itemCenterY, 2)
        );

        if (distance < 200) {
          const force = (200 - distance) / 200;
          (item as HTMLElement).style.transform = `scale(${1 + force * 0.05}) translateY(${-force * 5}px)`;
          (item as HTMLElement).style.boxShadow = `0 ${4 + force * 20}px ${6 + force * 20}px rgba(0,0,0,${0.1 + force * 0.2})`;
        } else {
          (item as HTMLElement).style.transform = 'scale(1) translateY(0px)';
          (item as HTMLElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }
      });

      if (Math.random() > 0.95) {
        createSteamParticle(mouseX + Math.random() * 20 - 10, mouseY + Math.random() * 20 - 10);
      }
    };

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const coffeeBeans = document.querySelectorAll('.coffee-bean');
      coffeeBeans.forEach((bean, index) => {
        const speed = 0.3 + (index % 3) * 0.1;
        const currentTransform = (bean as HTMLElement).style.transform || '';
        const hasTranslate = currentTransform.includes('translate(');

        if (!hasTranslate) {
          (bean as HTMLElement).style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1 + Math.random() * 30}deg)`;
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    createCoffeeBeans();
    updateMouseTrail();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div>
      <Navigation onOpenAuth={openModal} />
      <AuthModal isOpen={isOpen} onClose={closeModal} />

        <header className="header">
          <div ref={coffeeBeansLayerRef} className="parallax-layer" id="coffeeBeansLayer"></div>
          <div className="container">
            <div className="hero-content">
              <h1 className="floating-element">Not a Tourist Coffee - Specialty Coffee Shop in Budva</h1>
              <p>Specialty Coffee in the Heart of Budva</p>
              <a href="#about" className="cta-button">Discover Our Story</a>
            </div>
          </div>
        </header>

        <div ref={mouseTrailRef} className="mouse-trail" id="mouseTrail"></div>

        <section id="about" className="section about">
          <div className="container">
            <h2>About Us</h2>
            <div className="about-content">
              <div className="about-text">
                <p>Welcome to Not a Tourist, where authentic coffee culture meets the stunning coastal beauty of Budva. We&apos;re not just another coffee shop – we&apos;re a local sanctuary for coffee enthusiasts who appreciate the art of specialty brewing.</p>
                <p>Our carefully curated beans are sourced from sustainable farms around the world, roasted to perfection, and crafted by passionate baristas who understand that great coffee is more than just a beverage – it&apos;s an experience.</p>
                <p>Step away from the tourist trail and discover what locals have known all along: the best coffee in Budva is found where authenticity meets excellence.</p>
              </div>
              <div className="coffee-image">
                [Coffee Shop Interior Image]
              </div>
            </div>
          </div>
        </section>

        <section className="section menu-preview">
          <div className="container">
            <h2>Our Specialties</h2>
            <div className="menu-grid">
              <div className="menu-item floating-element">
                <h3>Single Origin Pour-Over</h3>
                <p>Hand-selected beans from renowned coffee regions, brewed to highlight their unique flavor profiles. Experience coffee as it was meant to be tasted.</p>
              </div>
              <div className="menu-item floating-element">
                <h3>Signature Espresso Blends</h3>
                <p>Our master roaster&apos;s carefully crafted blends, perfect for espresso, cappuccino, and flat white. Rich, balanced, and unforgettable.</p>
              </div>
              <div className="menu-item floating-element">
                <h3>Cold Brew & Nitro</h3>
                <p>Smooth, refreshing cold brew and creamy nitro coffee – perfect for Budva&apos;s warm Mediterranean climate.</p>
              </div>
              <div className="menu-item floating-element">
                <h3>Local Pastries</h3>
                <p>Freshly baked pastries and light bites from local bakers, perfectly paired with your coffee of choice.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section location">
          <div className="container">
            <h2>Visit Us</h2>
            <div className="location-content">
              <div className="contact-info">
                <p><strong>Address:</strong><br/>Old Town Budva<br/>Montenegro</p>
                <p><strong>Hours:</strong><br/>Monday - Sunday: 7:00 AM - 9:00 PM</p>
                <p><strong>Contact:</strong><br/>Phone: +382 XX XXX XXX<br/>Email: hello@notatourist.me</p>
                <p><strong>Follow Us:</strong><br/>@notatouristbudva</p>
              </div>
              <div className="map-placeholder">
                [Interactive Map of Budva Location]
              </div>
            </div>
          </div>
        </section>

        <CommentsSection onOpenAuth={openModal} />

        <footer>
          <div className="container">
            <p>&copy; 2024 Not a Tourist. Brewing authentic experiences in Budva, Montenegro.</p>
          </div>
        </footer>
      </div>
  );
}