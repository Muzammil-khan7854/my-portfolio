import React, { useEffect } from 'react';
import { mailtoHref, githubHref, xHref, linkedinHref, externalAttrs } from '../socialLinks';

const Home = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const skipLoader = urlParams.get('skip') === 'true';

  useEffect(() => {
    // Disable context menu
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu, false);

    // GSAP global is available from CDN
    const gsap = window.gsap;

    // Two-step loader animation
    const loader = document.getElementById('loader');
    if (skipLoader) {
      if (loader) loader.style.display = 'none';
      if (gsap) gsap.set(".gsap-reveal", { y: 0, opacity: 1 });
    } else {
      if (gsap && loader) {
        loader.style.display = 'flex';
        const tl = gsap.timeline();
        tl.to("#welcome-text", { opacity: 1, duration: 0.8, ease: "power2.out" })
          .to("#welcome-text", { opacity: 0, duration: 0.5, delay: 0.6, ease: "power2.in" })
          .to("#name-text", { opacity: 1, duration: 0.9, ease: "back.out(1.2)" }, "-=0.2")
          .to("#loader-text", { opacity: 0, duration: 0.7, delay: 0.9, ease: "power2.in" })
          .to("#loader", { yPercent: -100, duration: 1.1, ease: "power4.inOut" })
          .to(".gsap-reveal", { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }, "-=0.5");
      }
    }
    // Removed scroll-based navbar hide/show logic to keep navbar fixed at top

    // Active link highlight
    const sections = ['home', 'about', 'projects', 'reachme'];
    const navLinks = document.querySelectorAll('.nav-link');
    const updateActive = () => {
      let current = '';
      for (let sec of sections) {
        let el = document.getElementById(sec);
        if (el) {
          let rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2.5 && rect.bottom >= 100) {
            current = sec;
          }
        }
      }

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = sections[sections.length - 1];
      }

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href') === `#${current}`) link.classList.add('active');
      });
    };
    window.addEventListener('scroll', updateActive);
    updateActive();

    // Click handlers for nav & footer links
    // Click handlers for nav & footer links
    const handleSmoothScroll = (e) => {
      const link = e.currentTarget;
      let targetAttr = link.getAttribute('href');

      // If it's the Reach page link, let normal navigation handle it
      if (targetAttr === '/reach' || targetAttr === 'Reach.html') return;

      // For hash links: prevent default and handle manually
      if (targetAttr && targetAttr.startsWith('#')) {
        e.preventDefault();

        const targetId = targetAttr.substring(1); // Remove the #
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const navbar = document.querySelector('#main-navbar');
          const navbarHeight = navbar ? navbar.offsetHeight : 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }

        // Close mobile menu if open
        const panel = document.getElementById('mobile-menu-panel');
        if (panel && panel.classList.contains('open')) {
          panel.classList.remove('open');
        }
      }
    };
    document.querySelectorAll('.nav-link, .footer-nav-link').forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Mobile menu
    const menuToggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-menu');
    const mobilePanel = document.getElementById('mobile-menu-panel');
    const openMenu = () => mobilePanel?.classList.add('open');
    const closeMenu = () => mobilePanel?.classList.remove('open');
    menuToggle?.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);

    // Custom cursor
    let mouseMoveHandler;
    if (window.matchMedia("(pointer: fine)").matches) {
      const dot = document.querySelector(".cursor-dot");
      const outline = document.querySelector(".cursor-outline");
      if (dot && outline && gsap) {
        gsap.set(dot, { xPercent: -50, yPercent: -50 });
        gsap.set(outline, { xPercent: -50, yPercent: -50 });
        mouseMoveHandler = (e) => {
          gsap.set(dot, { x: e.clientX, y: e.clientY });
          gsap.to(outline, { x: e.clientX, y: e.clientY, duration: 0.12, ease: "power2.out" });
        };
        window.addEventListener("mousemove", mouseMoveHandler);

        document.querySelectorAll("a, button, .social-circle").forEach(el => {
          el.addEventListener("mouseenter", () => outline.classList.add("hovering"));
          el.addEventListener("mouseleave", () => outline.classList.remove("hovering"));
        });
      }
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      // Removed obsolete navbar scroll handler cleanup
      window.removeEventListener('scroll', updateActive);
      document.querySelectorAll('.nav-link, .footer-nav-link').forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
      menuToggle?.removeEventListener('click', openMenu);
      closeBtn?.removeEventListener('click', closeMenu);
      if (mouseMoveHandler) {
        window.removeEventListener("mousemove", mouseMoveHandler);
      }
    };
  }, []);

  const navigateToReach = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', '/reach');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <>
      <div className="cursor-dot"></div>
      <div className="cursor-outline"></div>

      {/* Loader Overlay */}
      <div id="loader" className="fixed inset-0 bg-black z-[9999] flex justify-center items-center">
        <div id="loader-text" className="text-center">
          <div id="welcome-text" className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-white opacity-0">Welcome to my portfolio</div>
          <div id="name-text" className="text-5xl sm:text-6xl md:text-7xl mt-4 opacity-0">
            <span className="premium-font shimmer-text" style={{ fontSize: 'inherit' }}>I'm Muzammil</span>
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center filter blur-[4px] opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')" }}></div>
      <div className="fixed inset-0 -z-9 bg-black/80"></div>

      {/* Glass Navbar */}
      <header id="main-navbar" className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 transition-transform duration-300 navbar-visible">
        <div className="max-w-6xl mx-auto glass-nav px-5 md:px-7 py-2.5 flex items-center justify-between relative">
          <div className="flex items-baseline gap-2 z-10">
            <span className="text-2xl sm:text-3xl font-bold premium-font shimmer-text">Muzammil</span>
            <span className="text-2xl sm:text-3xl font-bold premium-font wine-text">Khan</span>
          </div>

          <nav className="hidden md:flex gap-1 items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <a href="#home" className="nav-link text-white">Home</a>
            <a href="#about" className="nav-link text-white">About</a>
            <a href="#projects" className="nav-link text-white">Projects</a>
            <a href="#reachme" className="nav-link text-white">Reach Me</a>
          </nav>

          <div className="hidden md:flex items-center gap-5 z-10">
            <a href={linkedinHref || undefined} {...externalAttrs(linkedinHref)} className="text-white hover:text-[#9B2C2C] transition text-xl"><i className="fab fa-linkedin-in"></i></a>
            <a href={xHref || undefined} {...externalAttrs(xHref)} className="text-white hover:text-[#9B2C2C] transition text-xl"><i className="fab fa-x-twitter"></i></a>
            <a href={githubHref || undefined} {...externalAttrs(githubHref)} className="text-white hover:text-[#9B2C2C] transition text-xl"><i className="fab fa-github"></i></a>
          </div>

          <button id="menu-toggle" className="md:hidden text-white text-2xl focus:outline-none hover:text-[#9B2C2C] transition z-10">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <div id="mobile-menu-panel" className="mobile-menu flex flex-col gap-3">
        <button id="close-menu" className="absolute top-6 right-6 text-3xl text-white"><i className="fas fa-times"></i></button>
        <a href="#home" className="nav-link text-white text-lg">Home</a>
        <a href="#about" className="nav-link text-white text-lg">About</a>
        <a href="#projects" className="nav-link text-white text-lg">Projects</a>
        <a href="#reachme" className="nav-link text-white text-lg">Reach Me</a>
        <div className="flex gap-5 justify-center mt-6 pt-4 border-t border-white/20">
          <a href={linkedinHref || undefined} {...externalAttrs(linkedinHref)} className="text-white text-xl"><i className="fab fa-linkedin-in"></i></a>
          <a href={xHref || undefined} {...externalAttrs(xHref)} className="text-white text-xl"><i className="fab fa-x-twitter"></i></a>
          <a href={githubHref || undefined} {...externalAttrs(githubHref)} className="text-white text-xl"><i className="fab fa-github"></i></a>
        </div>
      </div>

      <main className="relative z-10 pt-32 pb-16 px-4 sm:px-6">
        {/* Hero Section */}
        <section id="home" className="min-h-[70vh] flex flex-col justify-center items-center text-center max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold mb-6 leading-tight text-white gsap-reveal">
            I am Full Stack <span className="wine-text">Developer</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-gray-300 leading-relaxed gsap-reveal">
            Bridging the gap between beautiful design and seamless functionality. I build digital experiences from the ground up.
          </p>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 max-w-5xl mx-auto">
          <div className="glass-card p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 gsap-reveal">
            <div className="w-full md:w-1/3 flex justify-center image-3d-container">
              <div className="image-3d-inner w-40 h-52 sm:w-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#9B2C2C] shadow-[0_0_20px_rgba(155,44,44,0.3)] bg-gray-900">
                <img src="/Muzammil.jpeg" alt="Muzammil Khan - Full Stack Developer" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-5 text-white">About Me</h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 font-light">
                I'm a passionate Full Stack Developer dedicated to crafting robust, scalable web applications. With a deep fascination for modern tech, I turn complex ideas into intuitive digital solutions. My approach blends clean architecture with human-centered design.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 font-light">
                Proficient in MERN, PHP, and modern frameworks, I constantly refine my craft to deliver high-quality, future-ready applications.
              </p>
              <div className="mb-8 flex justify-center md:justify-start">
                <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold bg-[#9B2C2C] text-white rounded-full hover:bg-[#7A1F1F] transition-all duration-300 hover:shadow-[0_0_15px_rgba(155,44,44,0.6)] hover:-translate-y-1">
                  <i className="fas fa-file-alt"></i> Resume
                </a>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-5 text-4xl sm:text-5xl">
                <div className="tooltip-icon"><i className="devicon-mongodb-plain colored hover:scale-110 transition"></i><span className="tooltip-text">MongoDB</span></div>
                <div className="tooltip-icon"><i className="devicon-express-original text-white hover:scale-110 transition"></i><span className="tooltip-text">Express.js</span></div>
                <div className="tooltip-icon"><i className="devicon-react-original colored hover:scale-110 transition"></i><span className="tooltip-text">React</span></div>
                <div className="tooltip-icon"><i className="devicon-nodejs-plain colored hover:scale-110 transition"></i><span className="tooltip-text">Node.js</span></div>
                <div className="tooltip-icon"><i className="devicon-php-plain colored hover:scale-110 transition"></i><span className="tooltip-text">PHP</span></div>
                <div className="tooltip-icon"><i className="devicon-mysql-plain colored hover:scale-110 transition"></i><span className="tooltip-text">MySQL</span></div>
                <div className="tooltip-icon"><i className="devicon-javascript-plain colored hover:scale-110 transition"></i><span className="tooltip-text">JavaScript</span></div>
                <div className="tooltip-icon"><i className="devicon-html5-plain colored hover:scale-110 transition"></i><span className="tooltip-text">HTML5</span></div>
                <div className="tooltip-icon"><i className="devicon-css3-plain colored hover:scale-110 transition"></i><span className="tooltip-text">CSS3</span></div>
                <div className="tooltip-icon"><i className="devicon-wordpress-plain text-[#21759b] hover:scale-110 transition"></i><span className="tooltip-text">WordPress</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section id="projects" className="py-24 max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 text-white gsap-reveal flex items-center justify-center gap-3">
            <i className="fas fa-laptop-code text-[#9B2C2C] text-3xl"></i>
            <span>Featured Projects</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="glass-card p-6 gsap-reveal group flex flex-col">
              <div className="h-44 bg-gray-800/60 rounded-xl mb-5 flex items-center justify-center transition-colors group-hover:bg-[#9B2C2C]/20 border border-transparent group-hover:border-[#9B2C2C]/50">
                <i className="fas fa-code text-5xl text-gray-400 group-hover:text-[#9B2C2C] transition-colors"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Portfolio Website</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-1">Modern responsive portfolio with glassmorphism, GSAP animations, and full customization.</p>
              <div className="flex gap-3 mt-2">
                <a href="#" className="btn-demo text-center" target="_blank" rel="noreferrer"><i className="fas fa-external-link-alt mr-1 text-xs"></i> Demo</a>
                <a href="#" className="btn-github text-center" target="_blank" rel="noreferrer"><i className="fab fa-github mr-1"></i> GitHub</a>
              </div>
            </div>

            <div className="glass-card p-6 gsap-reveal group flex flex-col">
              <div className="h-44 bg-gray-800/60 rounded-xl mb-5 flex items-center justify-center transition-colors group-hover:bg-[#9B2C2C]/20 border border-transparent group-hover:border-[#9B2C2C]/50">
                <i className="fas fa-shopping-cart text-5xl text-gray-400 group-hover:text-[#9B2C2C] transition-colors"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Shoe Business Catalog</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-1">Clean and responsive WordPress footwear showcase with organized product browsing.
                Designed multi-page layout with professional, brand-consistent styling.</p>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Coming soon'); }} className="btn-demo self-start mt-2"><i className="fas fa-external-link-alt mr-1 text-xs"></i> Live Demo</a>
            </div>

            <div className="glass-card p-6 gsap-reveal group flex flex-col">
              <div className="h-44 bg-gray-800/60 rounded-xl mb-5 flex items-center justify-center transition-colors group-hover:bg-[#9B2C2C]/20 border border-transparent group-hover:border-[#9B2C2C]/50">
                <i className="fas fa-comments text-5xl text-gray-400 group-hover:text-[#9B2C2C] transition-colors"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white"> Chat App</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-1">instant communication features based on MERN.</p>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Coming soon'); }} className="btn-demo self-start mt-2"><i className="fas fa-external-link-alt mr-1 text-xs"></i> Live Demo</a>
            </div>
          </div>
        </section>

        {/* Reach Me Section */}
        <section id="reachme" className="py-20 max-w-4xl mx-auto text-center">
          <div className="glass-card p-10 md:p-14 gsap-reveal">
            <div className="flex items-center justify-center gap-3 mb-6">
              <i className="fas fa-paper-plane text-3xl wine-text"></i>
              <h2 className="text-3xl sm:text-5xl font-bold text-white">Reach Me</h2>
            </div>
            <p className="text-gray-300 mb-8 text-lg max-w-xl mx-auto">Let's collaborate on exciting projects or just have a chat. I'm just a message away.</p>
            <a href="/reach" onClick={navigateToReach} className="inline-flex items-center gap-2 px-8 py-4 mb-10 text-lg font-semibold bg-[#9B2C2C] text-white rounded-full hover:bg-[#7A1F1F] transition-all duration-300 hover:shadow-[0_0_20px_rgba(155,44,44,0.6)] hover:-translate-y-1">
              <i className="fas fa-paper-plane"></i> Reach Me
            </a>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="tooltip-icon"><a href={mailtoHref} className="social-circle"><i className="fas fa-envelope"></i></a><span className="tooltip-text">Email</span></div>
              <div className="tooltip-icon"><a href={githubHref || undefined} {...externalAttrs(githubHref)} className="social-circle"><i className="fab fa-github"></i></a><span className="tooltip-text">GitHub</span></div>
              <div className="tooltip-icon"><a href={linkedinHref || undefined} {...externalAttrs(linkedinHref)} className="social-circle"><i className="fab fa-linkedin-in"></i></a><span className="tooltip-text">LinkedIn</span></div>
              <div className="tooltip-icon"><a href={xHref || undefined} {...externalAttrs(xHref)} className="social-circle"><i className="fab fa-x-twitter"></i></a><span className="tooltip-text">Twitter/X</span></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md py-10 px-6 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-white mb-2 premium-font shimmer-text">Muzammil</h3>
            <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">Building digital experiences that matter, one line of code at a time. Crafting interfaces that feel alive, solving problems that make a difference.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-b border-white/10 py-5 my-5">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <a href="#home" className="footer-nav-link text-gray-400 hover:text-[#9B2C2C] transition">Home</a>
              <a href="#about" className="footer-nav-link text-gray-400 hover:text-[#9B2C2C] transition">About Me</a>
              <a href="#projects" className="footer-nav-link text-gray-400 hover:text-[#9B2C2C] transition">Projects</a>
              <a href="#reachme" className="footer-nav-link text-gray-400 hover:text-[#9B2C2C] transition">Contact</a>
            </div>
            <div className="flex gap-4 ml-0 md:ml-4 border-l-0 md:border-l border-white/20 md:pl-5">
              <a href={mailtoHref} className="text-gray-400 hover:text-[#9B2C2C] text-xl transition"><i className="fas fa-envelope"></i></a>
              <a href={githubHref || undefined} {...externalAttrs(githubHref)} className="text-gray-400 hover:text-[#9B2C2C] text-xl transition"><i className="fab fa-github"></i></a>
              <a href={linkedinHref || undefined} {...externalAttrs(linkedinHref)} className="text-gray-400 hover:text-[#9B2C2C] text-xl transition"><i className="fab fa-linkedin-in"></i></a>
              <a href={xHref || undefined} {...externalAttrs(xHref)} className="text-gray-400 hover:text-[#9B2C2C] text-xl transition"><i className="fab fa-x-twitter"></i></a>
            </div>
          </div>

          <div className="text-center text-gray-500 text-xs">
            © 2026 Muzammil Khan. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
