/**
 * AlchemyLogic Consulting - Main JavaScript
 * Modern, clean JavaScript for the AlchemyLogic website
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const backToTop = document.getElementById('back-to-top') || document.querySelector('.back-to-top');
  // Theme toggle removed (dark mode only)
  // Removed consulting modal and form logic (no longer used)
  const modal = null;
  const openModalButtons = [];
  const closeModalButtons = [];
  const form = null;

  // Mobile Navigation Toggle
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('open');
      body.classList.toggle('nav-open', !isExpanded);
    });
  }

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      }
    });
  });

  // Sticky Header
  let lastScroll = 0;
  const headerHeight = header.offsetHeight;
  
  const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScroll <= 0) {
      header.classList.remove('scroll-up');
      return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
      // Scroll Down
      header.classList.remove('scroll-up');
      header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
      // Scroll Up
      header.classList.remove('scroll-down');
      header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Force dark mode root attributes for consistency
  document.documentElement.removeAttribute('data-theme');

  // Back to Top Button
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };
    
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Modal and consulting form code removed

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !document.querySelector(targetId)) return;
      
      e.preventDefault();
      
      const targetElement = document.querySelector(targetId);
      const headerOffset = header.offsetHeight;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without jumping
      if (history.pushState) {
        history.pushState(null, null, targetId);
      } else {
        location.hash = targetId;
      }
    });
  });

  // Intersection Observer for scroll animations
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.scrollDelay || 0;
          
          setTimeout(() => {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }, parseInt(delay));
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  };
  
  // Initialize animations
  animateOnScroll();

  // Accordion logic (home services)
  document.querySelectorAll('#home-services-accordion .accordion-item').forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    if (!trigger || !content) return;
    trigger.addEventListener('click', () => {
      const expanded = item.getAttribute('aria-expanded') === 'true';
      // collapse all others (accordion behavior)
      document.querySelectorAll('#home-services-accordion .accordion-item').forEach((el) => {
        el.setAttribute('aria-expanded', 'false');
        const t = el.querySelector('.accordion-trigger');
        t?.setAttribute('aria-expanded', 'false');
      });
      if (!expanded) {
        item.setAttribute('aria-expanded', 'true');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
