import React, { useEffect, useState } from 'react';
import { CONTACT_EMAIL, mailtoHref, githubHref, xHref, linkedinHref, externalAttrs } from '../socialLinks';

const Reach = () => {
  const [formStatus, setFormStatus] = useState({ state: 'idle', message: '' });
  useEffect(() => {
    // Scroll to top when page opens
    window.scrollTo(0, 0);

    // Disable right-click / context menu
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu, false);

    // GSAP reveal animation
    const gsap = window.gsap;
    let mouseMoveHandler;
    
    if (gsap) {
      gsap.to(".gsap-reveal", { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" });
      
      // Custom cursor
      if (window.matchMedia("(pointer: fine)").matches) {
        const dot = document.querySelector(".cursor-dot");
        const outline = document.querySelector(".cursor-outline");
        if (dot && outline) {
          gsap.set(dot, { xPercent: -50, yPercent: -50 });
          gsap.set(outline, { xPercent: -50, yPercent: -50 });
          mouseMoveHandler = (e) => {
            gsap.set(dot, { x: e.clientX, y: e.clientY });
            gsap.to(outline, { x: e.clientX, y: e.clientY, duration: 0.12, ease: "power2.out" });
          };
          window.addEventListener("mousemove", mouseMoveHandler);
          
          // Hover effects for links and buttons
          setTimeout(() => {
            document.querySelectorAll("a, button, .social-circle").forEach(el => {
              el.addEventListener("mouseenter", () => outline.classList.add("hovering"));
              el.addEventListener("mouseleave", () => outline.classList.remove("hovering"));
            });
          }, 100);
        }
      }
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      if (mouseMoveHandler) {
        window.removeEventListener("mousemove", mouseMoveHandler);
      }
    };
  }, []);

  // FIXED: Updated navigateToHome function without ?skip=true
  const navigateToHome = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', '/?skip=true');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setFormStatus({
        state: 'error',
        message: 'Form is not configured yet. Add VITE_WEB3FORMS_ACCESS_KEY to your .env file (get a free key at web3forms.com).',
      });
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name')?.toString().trim() ?? '';
    const email = formData.get('email')?.toString().trim() ?? '';
    const subject = formData.get('subject')?.toString().trim() ?? '';
    const message = formData.get('message')?.toString().trim() ?? '';

    setFormStatus({ state: 'sending', message: '' });

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[Portfolio] ${subject}`,
          name,
          email,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFormStatus({ state: 'success', message: 'Thanks — your message was sent. I will get back to you soon.' });
        form.reset();
      } else {
        setFormStatus({
          state: 'error',
          message: typeof data.message === 'string' ? data.message : 'Something went wrong. Please try again or email me directly.',
        });
      }
    } catch {
      setFormStatus({
        state: 'error',
        message: 'Network error. Check your connection or email me directly.',
      });
    }
  };

  return (
    <>
      <div className="cursor-dot"></div>
      <div className="cursor-outline"></div>

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center filter blur-[4px] opacity-40"
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')"}}>
      </div>
      <div className="fixed inset-0 -z-9 bg-black/80"></div>

      {/* Glass Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 pt-4 sm:pt-5 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto glass-nav px-4 md:px-7 py-2.5 flex items-center justify-between gap-2">
          <a href="/?skip=true" onClick={navigateToHome} className="flex items-baseline gap-2 shrink-0">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold premium-font shimmer-text">Muzammil</span>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold premium-font wine-text">Khan</span>
          </a>
          {/* FIXED: Changed href back to "/?skip=true" for no-reload navigation */}
          <a href="/?skip=true" onClick={navigateToHome}
            className="text-gray-300 hover:text-white hover:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium border border-transparent hover:border-white/20 whitespace-nowrap shrink-0">
            <i className="fas fa-arrow-left"></i>
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Back</span>
          </a>
        </div>
      </header>

      <main className="relative z-10 pt-36 pb-20 px-4 sm:px-6 min-h-screen flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 gsap-reveal" style={{opacity: 0, transform: 'translateY(40px)'}}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 sm:mb-5 text-white tracking-tight">Let's <span className="wine-text">Connect</span></h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Have a project in mind, a question, or just want to say hi? I'd love to hear from you. Fill out the form below or reach out via email.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-2 flex flex-col gap-6 gsap-reveal" style={{opacity: 0, transform: 'translateY(40px)'}}>
              <div className="glass-card p-6 sm:p-10 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-8 text-white">Contact Info</h2>
                  <div className="flex flex-col gap-5">
                    <a href={mailtoHref} className="contact-item group">
                      <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                      <div>
                        <h3 className="text-sm text-gray-400 mb-1 uppercase tracking-wider font-semibold">Email Me</h3>
                        <p className="font-medium text-white text-base sm:text-lg group-hover:text-[#9B2C2C] transition-colors break-all">
                          {CONTACT_EMAIL}
                        </p>
                      </div>
                    </a>
                    <div className="contact-item">
                      <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                      <div>
                        <h3 className="text-sm text-gray-400 mb-1 uppercase tracking-wider font-semibold">Location</h3>
                        <p className="font-medium text-white text-lg">Available India</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-14">
                  <h3 className="text-sm text-gray-400 mb-4 uppercase tracking-wider font-semibold">Social Profiles</h3>
                  <div className="flex gap-4 flex-wrap">
                    <a href={xHref} {...externalAttrs(xHref)} className="social-circle" aria-label="X"><i className="fab fa-x-twitter"></i></a>
                    <a href={mailtoHref} className="social-circle" aria-label="Email"><i className="fas fa-envelope"></i></a>
                    <a href={githubHref} {...externalAttrs(githubHref)} className="social-circle" aria-label="GitHub"><i className="fab fa-github"></i></a>
                    <a href={linkedinHref} {...externalAttrs(linkedinHref)} className="social-circle" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 gsap-reveal" style={{opacity: 0, transform: 'translateY(40px)'}}>
              <div className="glass-card p-6 sm:p-12 relative overflow-hidden">
                <h2 className="text-3xl font-bold mb-8 text-white">Send a Message</h2>
                <form id="contactForm" className="flex flex-col gap-6 relative z-10" onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 pl-1" htmlFor="name">Your Name</label>
                      <input type="text" id="name" name="name" required className="input-field" autoComplete="name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 pl-1" htmlFor="email">Your Email</label>
                      <input type="email" id="email" name="email" required className="input-field" autoComplete="email" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 pl-1" htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" required className="input-field" placeholder="How can I help you?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 pl-1" htmlFor="message">Message</label>
                    <textarea id="message" name="message" required rows="6" className="input-field resize-none" placeholder="Write your message here..."></textarea>
                  </div>
                  {formStatus.message && (
                    <p
                      role="status"
                      aria-live="polite"
                      className={`text-sm pl-1 ${formStatus.state === 'success' ? 'text-green-400' : 'text-amber-300'}`}
                    >
                      {formStatus.message}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={formStatus.state === 'sending'}
                    className="btn-submit mt-4 w-full sm:w-auto self-end disabled:opacity-60 disabled:pointer-events-none"
                  >
                    <span>{formStatus.state === 'sending' ? 'Sending…' : 'Send Message'}</span>
                    <i className="fas fa-paper-plane ml-1"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Reach;