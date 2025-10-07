import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Feature from '../components/Feature';
import ExampleNote from '../components/home/ExampleNote';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CommunityAndContribution from '../components/home/CommunityAndContribution';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef();

  useGSAP(
    () => {
      const masterTl = gsap.timeline();

      masterTl
        .from('.hero-avatars > div', {
          scale: 0,
          rotation: 180,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: 0.1,
        })
        .from(
          '.hero-title',
          {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .from(
          '.hero-description',
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.5'
        )
        .from(
          '.hero-buttons > *',
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1,
          },
          '-=0.4'
        )
        .from(
          '.hero-info-card',
          {
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .from(
          '.hero-right',
          {
            opacity: 0,
            x: 50,
            duration: 1,
            ease: 'power2.out',
          },
          '-=0.8'
        );

      // Features section with scroll trigger
      gsap.from('.feature-item', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 0.8,
        ease: 'power3.out',
        stagger: {
          amount: 0.6,
          grid: [3, 3],
          from: 'start',
        },
      });

      // Community section with scroll trigger
      gsap.from('.community-section', {
        scrollTrigger: {
          trigger: '.community-section',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: 'power3.out',
      });

      // Animate community cards
      gsap.from('.community-card', {
        scrollTrigger: {
          trigger: '.community-cards',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2,
      });

      // Floating animation for elements
      gsap.to('.float', {
        y: -10,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });

      // Pulse animation for interactive elements
      gsap.to('.pulse', {
        scale: 1.05,
        duration: 1.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      });
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      className="min-h-screen mt-20 p-6 lg:p-12"
      style={{ background: 'color:var(--color-base-100)' }}
    >
      <Hero />
      <Features />
      <CommunityAndContribution />
    </main>
  );
};

export default Home;
