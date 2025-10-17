/**
 * Sacramento Appliance Repair - Main JavaScript
 * Professional appliance repair website functionality
 */

(function() {
    'use strict';

    // ===== UTILITY FUNCTIONS =====
    
    /**
     * Debounce function to limit function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit function calls
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Smooth scroll to element
     */
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // ===== MOBILE MENU FUNCTIONALITY =====
    
    (function initMobileMenu() {
        const mobileMenuButton = document.querySelector('.header__mobile-menu');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
        
        if (!mobileMenuButton || !mobileMenu) return;

        // Toggle mobile menu
        function toggleMobileMenu() {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);
            
            // Toggle body scroll
            document.body.style.overflow = isExpanded ? '' : 'hidden';
            
            // Focus management
            if (!isExpanded) {
                const firstLink = mobileMenu.querySelector('.mobile-menu__link');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        }

        // Close mobile menu
        function closeMobileMenu() {
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        // Event listeners
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on links
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
                closeMobileMenu();
                mobileMenuButton.focus();
            }
        });

        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth >= 768) {
                closeMobileMenu();
            }
        }, 250));
    })();

    // ===== PHONE MASK FUNCTIONALITY =====
    
    (function initPhoneMask() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            // Format phone number as user types
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length >= 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                } else if (value.length >= 3) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
                }
                
                e.target.value = value;
            });

            // Handle backspace
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && e.target.value.length === 4) {
                    e.target.value = e.target.value.slice(0, 1);
                }
            });
        });
    })();

    // ===== FORM VALIDATION =====
    
    (function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            const submitButton = form.querySelector('button[type="submit"]');
            
            // Real-time validation
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', debounce(() => validateField(input), 300));
            });

            // Form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });

                if (isValid) {
                    submitForm(form);
                } else {
                    // Focus first invalid field
                    const firstInvalid = form.querySelector('[aria-invalid="true"]');
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                }
            });
        });

        function validateField(field) {
            const value = field.value.trim();
            const fieldType = field.type;
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = `${getFieldLabel(field)} is required.`;
            }

            // Email validation
            if (fieldType === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
            }

            // Phone validation
            if (fieldType === 'tel' && value) {
                const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number.';
                }
            }

            // Checkbox validation
            if (fieldType === 'checkbox' && field.hasAttribute('required') && !field.checked) {
                isValid = false;
                errorMessage = 'This field is required.';
            }

            // Update field state
            field.setAttribute('aria-invalid', !isValid);
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }

            return isValid;
        }

        function getFieldLabel(field) {
            const label = document.querySelector(`label[for="${field.id}"]`);
            return label ? label.textContent.replace('*', '').trim() : fieldName;
        }

        function submitForm(form) {
            const submitButton = form.querySelector('button[type="submit"]');
            const statusElement = form.querySelector('.form__status');
            
            // Disable submit button
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                statusElement.textContent = 'Thank you! Your service request has been submitted.';
                statusElement.setAttribute('data-status', 'success');
                form.reset();
                
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = '<span class="material-icons" aria-hidden="true">send</span>Send Service Request';
                
                // Clear status after 5 seconds
                setTimeout(() => {
                    statusElement.textContent = '';
                    statusElement.removeAttribute('data-status');
                }, 5000);
            }, 2000);
        }
    })();

    // ===== SCROLL ANIMATIONS =====
    
    (function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .feature-card, .testimonial-card, .team-member, .certification-card');
        
        if (!animatedElements.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Initialize elements
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    })();

    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    
    (function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                e.preventDefault();
                smoothScrollTo(href);
            });
        });
    })();

    // ===== HEADER SCROLL BEHAVIOR =====
    
    (function initHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        
        if (!header) return;

        const handleScroll = throttle(() => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
            
            lastScrollY = currentScrollY;
        }, 100);

        window.addEventListener('scroll', handleScroll);
    })();

    // ===== CTA BUTTON FUNCTIONALITY =====
    
    (function initCTAButtons() {
        const ctaButtons = document.querySelectorAll('.header__cta, .mobile-menu__cta, .hero__cta, .emergency-service__button, .emergency-contact__button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // If it's a phone number link, let it work normally
                if (this.href && this.href.startsWith('tel:')) {
                    return;
                }
                
                // Otherwise, scroll to contact form or show modal
                e.preventDefault();
                const contactForm = document.querySelector('.contact-form');
                if (contactForm) {
                    smoothScrollTo('.contact-form');
                } else {
                    // Fallback to contact page
                    window.location.href = 'contact.html';
                }
            });
        });
    })();

    // ===== KEYBOARD NAVIGATION =====
    
    (function initKeyboardNavigation() {
        // Handle Enter and Space key presses on buttons
        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.getAttribute('role') === 'button') {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.target.click();
                }
            }
        });

        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    })();

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    (function initAccessibility() {
        // Announce page changes for screen readers
        const main = document.querySelector('main');
        if (main) {
            main.setAttribute('aria-live', 'polite');
        }

        // Handle focus management for modals and dropdowns
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close any open modals or dropdowns
                const openMenus = document.querySelectorAll('[aria-expanded="true"]');
                openMenus.forEach(menu => {
                    if (menu.classList.contains('header__mobile-menu')) {
                        menu.setAttribute('aria-expanded', 'false');
                        menu.setAttribute('aria-hidden', 'true');
                    }
                });
            }
        });

        // Improve focus visibility
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });
    })();

    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    (function initPerformanceOptimizations() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        if (images.length && 'IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        // Preload critical resources
        const criticalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"]');
        criticalLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                const href = this.getAttribute('href');
                if (href && !document.querySelector(`link[href="${href}"]`)) {
                    const preloadLink = document.createElement('link');
                    preloadLink.rel = 'prefetch';
                    preloadLink.href = href;
                    document.head.appendChild(preloadLink);
                }
            });
        });
    })();

    // ===== ANALYTICS AND TRACKING =====
    
    (function initAnalytics() {
        // Track CTA button clicks
        const ctaButtons = document.querySelectorAll('.hero__cta, .header__cta, .emergency-service__button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Track CTA clicks (replace with actual analytics code)
                console.log('CTA clicked:', this.textContent.trim());
            });
        });

        // Track form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function() {
                // Track form submissions (replace with actual analytics code)
                console.log('Form submitted:', this.id || 'contact-form');
            });
        });

        // Track phone number clicks
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Track phone clicks (replace with actual analytics code)
                console.log('Phone number clicked:', this.textContent.trim());
            });
        });
    })();

    // ===== ERROR HANDLING =====
    
    (function initErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('JavaScript error:', e.error);
            // Send error to analytics or logging service
        });

        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled promise rejection:', e.reason);
            // Send error to analytics or logging service
        });
    })();

    // ===== INITIALIZATION =====
    
    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Sacramento Appliance Repair website loaded successfully');
        });
    } else {
        console.log('Sacramento Appliance Repair website loaded successfully');
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden
            console.log('Page hidden');
        } else {
            // Page is visible
            console.log('Page visible');
        }
    });

})();
