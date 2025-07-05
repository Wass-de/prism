// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Animation des sections au scroll + hero-content ---
  // On ajoute aussi .hero-content.content-hidden dans la liste des éléments à révéler
  const revealElements = document.querySelectorAll('section.content-hidden, .hero-content.content-hidden');

  function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add('content-visible');
        el.classList.remove('content-hidden');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // --- Scroll spy ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  function scrollSpy() {
    let currentId = '';

    // On regarde la position scroll + offset nav pour chaque section
    sections.forEach(section => {
      const top = section.offsetTop - 130; // Ajuster la marge selon hauteur nav
      if (window.pageYOffset >= top) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentId}`) {
        link.parentElement.setAttribute('aria-current', 'page');
      } else {
        link.parentElement.removeAttribute('aria-current');
      }
    });

    // Cas spécial : quand on est tout en haut, forcer activation Accueil
    if (window.pageYOffset < 150) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#home') {
          link.parentElement.setAttribute('aria-current', 'page');
        } else {
          link.parentElement.removeAttribute('aria-current');
        }
      });
    }
  }

  window.addEventListener('scroll', scrollSpy);
  scrollSpy();

  // --- Bouton retour en haut ---
  const backToTopBtn = document.getElementById('back-to-top');
  backToTopBtn.style.opacity = '0';
  backToTopBtn.style.pointerEvents = 'none';

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.opacity = '0.8';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Menu mobile toggle ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  mobileMenuToggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileMenuClose.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeMobileMenu();
    }
  });

  // Fermer le menu mobile au clic sur un lien
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- Canvas particules néon ---
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = 1 + Math.random() * 1.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = 0.6 + Math.random() * 0.4;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // rebondir aux bords
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(0, 255, 255, ${this.opacity})`;
      ctx.shadowColor = 'rgba(0, 255, 255, 0.7)';
      ctx.shadowBlur = 6;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }

  const particlesCount = Math.floor((width * height) / 8000);
  const particles = [];

  for (let i = 0; i < particlesCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
});
