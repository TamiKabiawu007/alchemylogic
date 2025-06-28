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
  const backToTop = document.querySelector('.back-to-top');
  const modal = document.getElementById('consultation-modal');
  const openModalButtons = document.querySelectorAll('[data-modal="consultation"]');
  const closeModalButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
  const form = document.getElementById('consultation-form');

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

  // Modal Functions
  const openModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.add('open');
    body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
  };

  const closeModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    body.style.overflow = '';
    document.removeEventListener('keydown', handleEscape);
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal(modal);
    }
  };

  // Open modal buttons
  openModalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modal);
    });
  });

  // Close modal buttons
  closeModalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(modal);
    });
  });

  // Close modal when clicking outside content
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  // Form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Thank You!</h3>
          <p>Your consultation request has been received. We'll contact you within 24 hours.</p>
          <button class="btn btn-primary" id="close-success">Close</button>
        `;
        
        form.style.display = 'none';
        form.parentNode.insertBefore(successMessage, form);
        
        // Close modal after delay
        setTimeout(() => {
          closeModal(modal);
          // Reset form after modal closes
          setTimeout(() => {
            form.reset();
            form.style.display = '';
            successMessage.remove();
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }, 300);
        }, 2000);
        
      } catch (error) {
        console.error('Form submission error:', error);
        submitBtn.textContent = 'Error - Try Again';
        setTimeout(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }, 2000);
      }
    });
  }

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
});
