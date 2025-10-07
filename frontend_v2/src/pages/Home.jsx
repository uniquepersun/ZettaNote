import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Feature from "../components/home/Feature";
import ExampleNote from "../components/home/ExampleNote";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef();

  useGSAP(() => {
    // Initial page load animation
    const masterTl = gsap.timeline();

    // Hero section animation with stagger
    masterTl
      .from(".hero-avatars > div", {
        scale: 0,
        rotation: 180,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1
      })
      .from(".hero-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
      }, "-=0.3")
      .from(".hero-description", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
      .from(".hero-buttons > *", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1
      }, "-=0.4")
      .from(".hero-info-card", {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3")
      .from(".hero-right", {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8");

    // Features section with scroll trigger
    gsap.from(".feature-item", {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      y: 60,
      scale: 0.9,
      duration: 0.8,
      ease: "power3.out",
      stagger: {
        amount: 0.6,
        grid: [3, 3],
        from: "start"
      }
    });

    // Community section with scroll trigger
    gsap.from(".community-section", {
      scrollTrigger: {
        trigger: ".community-section",
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      y: 80,
      duration: 1.2,
      ease: "power3.out"
    });

    // Animate community cards
    gsap.from(".community-card", {
      scrollTrigger: {
        trigger: ".community-cards",
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.2
    });

    // Floating animation for elements
    gsap.to(".float", {
      y: -10,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3
    });

    // Pulse animation for interactive elements
    gsap.to(".pulse", {
      scale: 1.05,
      duration: 1.5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.5
    });

  }, { scope: containerRef });
  
  return (
    <main ref={containerRef} className="min-h-screen mt-20 p-6 lg:p-12" style={{ background: "color:var(--color-base-100)" }}>
      {/* HERO */}
      <section className="first max-w-6xl mx-auto grid gap-8 lg:grid-cols-2 items-center">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="hero-avatars flex -space-x-2">
              <div className="pulse w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
              <div className="pulse w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                B
              </div>
              <div className="pulse w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                C
              </div>
              <div className="pulse w-8 h-8 rounded-full bg-base-300 border-2 border-white flex items-center justify-center text-base-content text-sm font-semibold">
                +
              </div>
            </div>
            <span className="text-sm text-[color:var(--color-neutral-content)]">Join 1,000+ users taking notes</span>
          </div>
          
          <h1 className="hero-title text-3xl lg:text-4xl font-extrabold text-[color:var(--color-base-content)]">
            ZettaNote — Minimal ✦ Private ✦ Shareable
          </h1>
          <p className="hero-description mt-4 text-base text-[color:var(--color-neutral-content)] max-w-xl leading-relaxed">
            The open-source note-taking app that puts privacy first. Create rich notes with markdown support, organize your thoughts, and share selectively with secure public links. Built for writers, developers, and thinkers who value simplicity and control.
          </p>

          <div className="hero-buttons mt-6 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-[color:var(--color-primary)] text-[color:var(--color-primary-content)] font-medium shadow-sm"
            >
              Create account
            </Link>

            <a
              href="https://github.com/braydenidzenga/ZettaNote"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-[color:var(--color-base-300)] text-[color:var(--color-base-content)]"
            >
              View on GitHub
            </a>
          </div>

          <div className="hero-info-card mt-6 flex items-start gap-3 p-4 bg-[color:var(--color-base-200)] rounded-lg border border-[color:var(--color-base-300)]">
            <div className="float w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-[color:var(--color-base-content)]">Open-source & community-driven</div>
              <div className="text-sm text-[color:var(--color-neutral-content)] mt-1">
                Built by developers, for developers. Contribute features, fix bugs, or help with documentation on GitHub.
              </div>
            </div>
          </div>
        </div>

        <div className="hero-right space-y-6">
          <div className="rounded-xl p-6 bg-[color:var(--color-base-200)] border border-[color:var(--color-base-300)]">
            <h4 className="text-sm font-medium text-[color:var(--color-neutral-content)]">Quick demo note</h4>
            <div className="mt-4">
              <ExampleNote />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 bg-[color:var(--color-base-200)] border border-[color:var(--color-base-300)]">
              <div className="text-sm text-[color:var(--color-neutral-content)]">Notes</div>
              <div className="mt-2 text-base font-semibold text-[color:var(--color-base-content)]">Private by default</div>
            </div>
            <div className="rounded-xl p-4 bg-[color:var(--color-base-200)] border border-[color:var(--color-base-300)]">
              <div className="text-sm text-[color:var(--color-neutral-content)]">Sharing</div>
              <div className="mt-2 text-base font-semibold text-[color:var(--color-base-content)]">Public links</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section second max-w-6xl mx-auto mt-12">
        <h2 className="text-xl font-semibold text-[color:var(--color-base-content)]">Core features</h2>
        <p className="mt-2 text-sm text-[color:var(--color-neutral-content)] max-w-2xl">
          Designed for writers, students and developers — minimal UI, fast editor and safe sharing.
        </p>

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="feature-item">
            <Feature
              icon={"🗒️"}
              title="Private notes"
              desc="Create, edit, rename, and organize your notes with full privacy. Your thoughts stay yours until you decide to share."
            />
          </div>
          <div className="feature-item">
            <Feature
              icon={"🔗"}
              title="Secure sharing"
              desc="Generate read-only public links to share specific notes. No account required for readers, full control for you."
            />
          </div>
          <div className="feature-item">
            <Feature
              icon={"✍️"}
              title="Rich markdown editor"
              desc="Write with a clean, distraction-free editor. Markdown support, autosave, and real-time preview for seamless note-taking."
            />
          </div>
          <div className="feature-item">
            <Feature
              icon={"🔐"}
              title="Secure authentication"
              desc="Email/password authentication with secure session management. Change passwords, manage accounts, and delete data anytime."
            />
          </div>
          <div className="feature-item">
            <Feature
              icon={"👥"}
              title="Admin dashboard"
              desc="Comprehensive admin tools for user management, analytics, moderation, and system insights. Built for scalability."
            />
          </div>
          <div className="feature-item">
            <Feature
              icon={"🚀"}
              title="Modern architecture"
              desc="Vite + React frontend, Node.js + MongoDB backend. Fast loading, responsive design, and developer-friendly codebase."
            />
          </div>
          <div className="feature-item">
            <Feature
              icon={"🌐"}
              title="Open source"
              desc="MIT licensed and community-driven. Fork, contribute, customize, or learn from the complete source code on GitHub."
            />
          </div>
          <div className="feature-item">
            <Feature
              icon={"📱"}
              title="Responsive design"
              desc="Works beautifully on desktop, tablet, and mobile. Dark/light themes with smooth transitions and accessible UI."
            />
          </div>
          <div className="feature-item">
            <Feature
              icon={"🔄"}
              title="Version control"
              desc="Track changes, save drafts, and maintain edit history. Never lose your work with automatic backups and versioning."
            />
          </div>
        </div>
      </section>

      {/* COMMUNITY & CONTRIBUTION */}
      <section className="community-section third max-w-4xl mx-auto mt-12 bg-[color:var(--color-base-200)] border border-[color:var(--color-base-300)] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-3">
            <div className="float w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-white flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="float w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 border-2 border-white flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="float w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 border-2 border-white flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-[color:var(--color-base-content)]">Built by the community</h3>
        </div>

        <div className="mt-3 text-sm text-[color:var(--color-neutral-content)] space-y-4">
          <p>
            <strong>ZettaNote</strong> is an <strong>open-source</strong> notes application that combines the simplicity of markdown with the power of modern web technologies. 
            Our mission is to create the most intuitive and secure note-taking experience while keeping everything transparent and community-driven.
          </p>

          <div className="community-cards grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="community-card bg-[color:var(--color-base-100)] rounded-lg p-4 border border-[color:var(--color-base-300)]">
              <h4 className="font-semibold text-[color:var(--color-base-content)] mb-2">Core Capabilities</h4>
              <ul className="space-y-1 text-sm">
                <li>• Create, edit, rename, and delete notes</li>
                <li>• Markdown support with live preview</li>
                <li>• Automatic saving and version history</li>
                <li>• Secure user authentication & sessions</li>
                <li>• Generate shareable public links</li>
                <li>• Admin dashboard for user management</li>
              </ul>
            </div>
            <div className="community-card bg-[color:var(--color-base-100)] rounded-lg p-4 border border-[color:var(--color-base-300)]">
              <h4 className="font-semibold text-[color:var(--color-base-content)] mb-2">Technical Stack</h4>
              <ul className="space-y-1 text-sm">
                <li>• React 18 + Vite for lightning-fast dev</li>
                <li>• Node.js + Express.js backend API</li>
                <li>• MongoDB for data persistence</li>
                <li>• Tailwind CSS + DaisyUI components</li>
                <li>• JWT authentication & bcrypt security</li>
                <li>• Docker support for easy deployment</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Want to contribute?</div>
                <div className="text-blue-800 dark:text-blue-200 text-sm mt-1">
                  We welcome all types of contributions: code, documentation, design, testing, and ideas. 
                  Check out our GitHub repository for open issues and contribution guidelines.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="https://github.com/ikeshav26/ZettaNote"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[color:var(--color-base-300)] hover:bg-[color:var(--color-base-100)] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Repository
            </a>
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--color-primary)] text-[color:var(--color-primary-content)] hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Start Taking Notes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
