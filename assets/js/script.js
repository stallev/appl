/**
 * Sacramento Appliance Pro - Main JavaScript File
 * Handles all interactive functionality for the website
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
     * Format phone number for display
     */
    function formatPhoneNumber(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    }

    /**
     * Validate email address
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validate phone number
     */
    function validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 10;
    }

    // ===== MOBILE MENU =====
    
    (function() {
        'use strict';
        
        class MobileMenu {
            constructor() {
                this.toggle = document.querySelector('.header__mobile-toggle');
                this.nav = document.querySelector('.header__nav');
                this.isOpen = false;
                this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                
                if (this.toggle && this.nav) {
                    this.init();
                }
            }

            init() {
                this.toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleMenu();
                });
                
                // Close menu when clicking on nav links
                const navLinks = this.nav.querySelectorAll('.nav__link');
                navLinks.forEach(link => {
                    link.addEventListener('click', () => this.closeMenu());
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (this.isOpen && !this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
                        this.closeMenu();
                    }
                });

                // Close menu on escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.closeMenu();
                    }
                });

                // Handle keyboard navigation
                this.toggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleMenu();
                    }
                });
            }

            toggleMenu() {
                if (this.isOpen) {
                    this.closeMenu();
                } else {
                    this.openMenu();
                }
            }

            openMenu() {
                this.isOpen = true;
                this.toggle.setAttribute('aria-expanded', 'true');
                this.nav.classList.add('nav--open');
                this.toggle.classList.add('toggle--open');
                
                // Focus on first menu item
                const firstMenuItem = this.nav.querySelector('.nav__link');
                if (firstMenuItem) {
                    setTimeout(() => firstMenuItem.focus(), 100);
                }
                
                // Trap focus within menu
                this.trapFocus();
            }

            closeMenu() {
                this.isOpen = false;
                this.toggle.setAttribute('aria-expanded', 'false');
                this.nav.classList.remove('nav--open');
                this.toggle.classList.remove('toggle--open');
                
                // Return focus to toggle button
                this.toggle.focus();
            }

            trapFocus() {
                const focusableElements = this.nav.querySelectorAll(this.focusableElements);
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                this.nav.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                lastElement.focus();
                                e.preventDefault();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                firstElement.focus();
                                e.preventDefault();
                            }
                        }
                    }
                });
            }
        }

        // Initialize mobile menu
        new MobileMenu();
    })();

    // ===== MODAL WINDOWS =====
    
    (function() {
        'use strict';
        
        class ModalManager {
            constructor() {
                this.modals = document.querySelectorAll('[data-modal]');
                this.init();
            }

            init() {
                this.modals.forEach(modal => {
                    const trigger = document.querySelector(`[data-modal-trigger="${modal.id}"]`);
                    const closeBtn = modal.querySelector('.modal__close');
                    const overlay = modal.querySelector('.modal__overlay');
                    
                    if (trigger) {
                        trigger.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.openModal(modal);
                        });
                    }
                    
                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => this.closeModal(modal));
                    }
                    
                    if (overlay) {
                        overlay.addEventListener('click', () => this.closeModal(modal));
                    }
                    
                    // Close on escape key
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
                            this.closeModal(modal);
                        }
                    });
                });
            }

            openModal(modal) {
                modal.classList.add('modal--open');
                document.body.style.overflow = 'hidden';
                
                // Focus on first input
                const firstInput = modal.querySelector('input, select, textarea');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 100);
                }
                
                // Trap focus
                this.trapFocus(modal);
            }

            closeModal(modal) {
                modal.classList.remove('modal--open');
                document.body.style.overflow = '';
                
                // Return focus to trigger
                const trigger = document.querySelector(`[data-modal-trigger="${modal.id}"]`);
                if (trigger) {
                    trigger.focus();
                }
            }

            trapFocus(modal) {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                lastElement.focus();
                                e.preventDefault();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                firstElement.focus();
                                e.preventDefault();
                            }
                        }
                    }
                });
            }
        }

    // Initialize modal manager
    new ModalManager();
    })();

// ===== STICKY HEADER =====

(function() {
    'use strict';
    
    class StickyHeader {
        constructor() {
            this.stickyHeader = document.querySelector('.sticky-header');
            this.scrollThreshold = 100; // Show sticky header after 100px scroll
            this.isVisible = false;
            
            if (this.stickyHeader) {
                this.init();
            }
        }
        
        init() {
            this.bindEvents();
        }
        
        bindEvents() {
            window.addEventListener('scroll', () => this.handleScroll());
            window.addEventListener('resize', () => this.handleResize());
        }
        
        handleScroll() {
            const scrollY = window.scrollY;
            
            if (scrollY > this.scrollThreshold && !this.isVisible) {
                this.showStickyHeader();
            } else if (scrollY <= this.scrollThreshold && this.isVisible) {
                this.hideStickyHeader();
            }
        }
        
        handleResize() {
            // Recalculate on resize if needed
            this.handleScroll();
        }
        
        showStickyHeader() {
            this.stickyHeader.classList.add('sticky-header--visible');
            this.stickyHeader.setAttribute('aria-hidden', 'false');
            this.isVisible = true;
        }
        
        hideStickyHeader() {
            this.stickyHeader.classList.remove('sticky-header--visible');
            this.stickyHeader.setAttribute('aria-hidden', 'true');
            this.isVisible = false;
        }
    }
    
    // Initialize sticky header
    new StickyHeader();
})();

// ===== EXIT INTENT POPUP =====

(function() {
    'use strict';
    
    class ExitIntentPopup {
        constructor() {
            this.popup = document.getElementById('exit-intent-popup');
            this.hasShown = false;
            this.mouseY = 0;
            this.delay = 1000; // Show popup after 1 second on page
            
            if (this.popup) {
                this.init();
            }
        }
        
        init() {
            this.bindEvents();
            this.startDelayTimer();
        }
        
        bindEvents() {
            // Mouse leave detection
            document.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
            
            // Close button
            const closeBtn = this.popup.querySelector('.exit-popup__close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closePopup());
            }
            
            // Overlay click
            const overlay = this.popup.querySelector('.exit-popup__overlay');
            if (overlay) {
                overlay.addEventListener('click', () => this.closePopup());
            }
            
            // Copy promo code
            const copyBtn = this.popup.querySelector('.exit-popup__copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => this.copyPromoCode());
            }
            
            // Keyboard events
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isVisible()) {
                    this.closePopup();
                }
            });
        }
        
        startDelayTimer() {
            // Only show popup after user has been on page for a while
            setTimeout(() => {
                this.canShow = true;
            }, this.delay);
        }
        
        handleMouseLeave(e) {
            // Only show if user is leaving from the top of the page
            if (e.clientY <= 0 && this.canShow && !this.hasShown) {
                this.showPopup();
            }
        }
        
        showPopup() {
            this.popup.classList.add('exit-popup--visible');
            this.popup.setAttribute('aria-hidden', 'false');
            this.hasShown = true;
            
            // Focus on first interactive element
            const firstButton = this.popup.querySelector('button, a');
            if (firstButton) {
                setTimeout(() => firstButton.focus(), 100);
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
        
        closePopup() {
            this.popup.classList.remove('exit-popup--visible');
            this.popup.setAttribute('aria-hidden', 'true');
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
        
        isVisible() {
            return this.popup.classList.contains('exit-popup--visible');
        }
        
        copyPromoCode() {
            const codeText = 'SAVE20';
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(codeText).then(() => {
                    this.showCopySuccess();
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = codeText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showCopySuccess();
            }
        }
        
        showCopySuccess() {
            const copyBtn = this.popup.querySelector('.exit-popup__copy-btn');
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅';
                copyBtn.style.background = 'var(--color-success)';
                copyBtn.style.color = 'white';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.background = '';
                    copyBtn.style.color = '';
                }, 2000);
            }
        }
    }
    
    // Initialize exit intent popup
    new ExitIntentPopup();
})();

// ===== MULTI-STEP FORM =====

(function() {
    'use strict';
    
    class MultiStepForm {
            constructor() {
                this.currentStep = 1;
                this.totalSteps = 3;
                this.form = document.getElementById('modal-quote-form');
                this.progressFill = document.getElementById('progress-fill');
                this.stepElements = document.querySelectorAll('.form__step');
                this.stepContents = document.querySelectorAll('.form__step-content');
                
                if (this.form) {
                    this.init();
                }
            }
            
            init() {
                this.bindEvents();
                this.updateProgress();
            }
            
            bindEvents() {
                // Step navigation buttons
                const step1Next = document.getElementById('step-1-next');
                const step2Back = document.getElementById('step-2-back');
                const step2Next = document.getElementById('step-2-next');
                const step3Back = document.getElementById('step-3-back');
                
                if (step1Next) {
                    step1Next.addEventListener('click', () => this.nextStep());
                }
                
                if (step2Back) {
                    step2Back.addEventListener('click', () => this.prevStep());
                }
                
                if (step2Next) {
                    step2Next.addEventListener('click', () => this.nextStep());
                }
                
                if (step3Back) {
                    step3Back.addEventListener('click', () => this.prevStep());
                }
                
                // Form submission
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
                
                // Radio button changes for visual feedback
                const radioButtons = this.form.querySelectorAll('input[type="radio"]');
                radioButtons.forEach(radio => {
                    radio.addEventListener('change', () => this.updateProgress());
                });
            }
            
            nextStep() {
                if (this.validateCurrentStep()) {
                    this.currentStep++;
                    this.showStep(this.currentStep);
                    this.updateProgress();
                }
            }
            
            prevStep() {
                this.currentStep--;
                this.showStep(this.currentStep);
                this.updateProgress();
            }
            
            showStep(step) {
                this.stepContents.forEach((content, index) => {
                    if (index + 1 === step) {
                        content.style.display = 'block';
                        content.setAttribute('aria-hidden', 'false');
                    } else {
                        content.style.display = 'none';
                        content.setAttribute('aria-hidden', 'true');
                    }
                });
                
                this.stepElements.forEach((stepEl, index) => {
                    if (index + 1 < step) {
                        stepEl.classList.add('form__step--completed');
                        stepEl.classList.remove('form__step--active');
                    } else if (index + 1 === step) {
                        stepEl.classList.add('form__step--active');
                        stepEl.classList.remove('form__step--completed');
                    } else {
                        stepEl.classList.remove('form__step--active', 'form__step--completed');
                    }
                });
            }
            
            validateCurrentStep() {
                const currentStepContent = this.stepContents[this.currentStep - 1];
                const requiredInputs = currentStepContent.querySelectorAll('input[required]');
                let isValid = true;
                
                requiredInputs.forEach(input => {
                    if (!input.checked && !input.value.trim()) {
                        isValid = false;
                        input.setAttribute('aria-invalid', 'true');
                    } else {
                        input.setAttribute('aria-invalid', 'false');
                    }
                });
                
                return isValid;
            }
            
            updateProgress() {
                const progress = (this.currentStep / this.totalSteps) * 100;
                this.progressFill.style.width = `${progress}%`;
            }
            
            handleSubmit(e) {
                e.preventDefault();
                
                if (this.validateCurrentStep()) {
                    // Show loading state
                    const submitBtn = this.form.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                    
                    // Simulate form submission (replace with actual submission logic)
                    setTimeout(() => {
                        // Show success message
                        this.showSuccessMessage();
                        
                        // Reset form
                        this.resetForm();
                        
                        // Close modal
                        const modal = document.getElementById('quick-quote-modal');
                        if (modal) {
                            modal.classList.remove('modal--open');
                            document.body.style.overflow = '';
                        }
                        
                        // Reset button
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                }
            }
            
            showSuccessMessage() {
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form__success';
                successMessage.innerHTML = `
                    <div class="form__success-content">
                        <div class="form__success-icon">✅</div>
                        <h3>Thank you!</h3>
                        <p>We'll call you within 30 minutes to schedule your repair.</p>
                    </div>
                `;
                
                // Add styles
                successMessage.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    z-index: 10001;
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                `;
                
                document.body.appendChild(successMessage);
                
                // Remove after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }
            
            resetForm() {
                this.currentStep = 1;
                this.showStep(1);
                this.updateProgress();
                this.form.reset();
            }
        }
        
        // Initialize multi-step form
        new MultiStepForm();
    })();

    // ===== SMOOTH SCROLLING =====
    
    (function() {
        'use strict';
        
        class SmoothScroll {
            constructor() {
                this.init();
            }

            init() {
                // Handle anchor links
                document.addEventListener('click', (e) => {
                    const link = e.target.closest('a[href^="#"]');
                    if (link) {
                        e.preventDefault();
                        const targetId = link.getAttribute('href').substring(1);
                        const targetElement = document.getElementById(targetId);
                        
                        if (targetElement) {
                            this.scrollToElement(targetElement);
                        }
                    }
                });
            }

            scrollToElement(element) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = element.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }

        // Initialize smooth scroll
        new SmoothScroll();
    })();

    // ===== FORM VALIDATION =====
    
    (function() {
        'use strict';
        
        class FormValidator {
        constructor(form) {
            this.form = form;
            this.fields = form.querySelectorAll('input, select, textarea');
            this.init();
        }

        init() {
            // Real-time validation
            this.fields.forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', debounce(() => this.validateField(field), 300));
            });

            // Form submission
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            const errorElement = document.getElementById(`${fieldName}-error`);
            
            let isValid = true;
            let errorMessage = '';

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required.';
            }

            // Email validation
            if (field.type === 'email' && value && !validateEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }

            // Phone validation
            if (field.type === 'tel' && value && !validatePhone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid 10-digit phone number.';
            }

            // Update field state
            this.updateFieldState(field, isValid, errorMessage, errorElement);
            
            return isValid;
        }

        updateFieldState(field, isValid, errorMessage, errorElement) {
            if (isValid) {
                field.classList.remove('form__input--error');
                field.setAttribute('aria-invalid', 'false');
                if (errorElement) {
                    errorElement.textContent = '';
                    errorElement.classList.remove('show');
                }
            } else {
                field.classList.add('form__input--error');
                field.setAttribute('aria-invalid', 'true');
                if (errorElement) {
                    errorElement.textContent = errorMessage;
                    errorElement.classList.add('show');
                }
            }
        }

        handleSubmit(e) {
            e.preventDefault();
            
            let isFormValid = true;
            
            // Validate all fields
            this.fields.forEach(field => {
                if (!this.validateField(field)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                this.submitForm();
            } else {
                // Focus first invalid field
                const firstInvalidField = this.form.querySelector('.form__input--error');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
            }
        }

        submitForm() {
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                this.showSuccessMessage();
                this.form.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        }

        showSuccessMessage() {
            const successMessage = document.createElement('div');
            successMessage.className = 'form__success';
            successMessage.innerHTML = `
                <div class="success__content">
                    <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    <h3>Thank you for your request!</h3>
                    <p>We'll contact you within 30 minutes to schedule your repair.</p>
                </div>
            `;
            
            this.form.parentNode.insertBefore(successMessage, this.form);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }
    }
    
    // Initialize form validators
    const forms = document.querySelectorAll('form');
    forms.forEach(form => new FormValidator(form));
    })();

    // ===== FAQ ACCORDION =====
    
    (function() {
        'use strict';
        
        class FAQAccordion {
        constructor() {
            this.faqItems = document.querySelectorAll('.faq__item');
            this.init();
        }

        init() {
            this.faqItems.forEach(item => {
                const question = item.querySelector('.faq__question');
                if (question) {
                    question.addEventListener('click', () => this.toggleItem(item));
                    
                    // Handle keyboard navigation
                    question.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            this.toggleItem(item);
                        }
                    });
                }
            });
        }

        toggleItem(item) {
            const isExpanded = item.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            this.faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            item.setAttribute('aria-expanded', !isExpanded);
        }
    }
    
    // Initialize FAQ accordion
    new FAQAccordion();
    })();

    // ===== SCROLL ANIMATIONS =====
    
    (function() {
        'use strict';
        
        class ScrollAnimations {
        constructor() {
            this.animatedElements = document.querySelectorAll('[data-animate]');
            this.init();
        }

        init() {
            if (this.animatedElements.length === 0) return;
            
            // Initial check
            this.checkAnimations();
            
            // Check on scroll
            window.addEventListener('scroll', throttle(() => this.checkAnimations(), 100));
        }

        checkAnimations() {
            this.animatedElements.forEach(element => {
                if (isInViewport(element) && !element.classList.contains('animated')) {
                    this.animateElement(element);
                }
            });
        }

        animateElement(element) {
            element.classList.add('animated');
            
            const animationType = element.dataset.animate;
            const delay = element.dataset.delay || 0;
            
            setTimeout(() => {
                element.classList.add(`animate--${animationType}`);
            }, delay);
        }
    }
    
    // Initialize scroll animations
    new ScrollAnimations();
    })();

    // ===== LAZY LOADING =====
    
    (function() {
        'use strict';
        
        class LazyLoader {
        constructor() {
            this.images = document.querySelectorAll('img[loading="lazy"]');
            this.init();
        }

        init() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.observer.unobserve(entry.target);
                        }
                    });
                }, {
                    rootMargin: '50px 0px'
                });

                this.images.forEach(img => {
                    this.observer.observe(img);
                });
            } else {
                // Fallback for older browsers
                this.images.forEach(img => this.loadImage(img));
            }
        }

        loadImage(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            
            img.classList.add('loaded');
        }
    }
    
    // Initialize lazy loader
    new LazyLoader();
    })();

    // ===== PHONE NUMBER FORMATTING =====
    
    (function() {
        'use strict';
        
        class PhoneFormatter {
        constructor() {
            this.phoneInputs = document.querySelectorAll('input[type="tel"]');
            this.init();
        }

        init() {
            this.phoneInputs.forEach(input => {
                input.addEventListener('input', (e) => this.formatPhone(e.target));
                input.addEventListener('keydown', (e) => this.handleKeydown(e));
            });
        }

        formatPhone(input) {
            let value = input.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }
            
            input.value = value;
        }

        handleKeydown(e) {
            // Allow backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
    }
    
    // Initialize phone formatter
    new PhoneFormatter();
    })();

    // ===== SCROLL TO TOP =====
    
    (function() {
        'use strict';
        
        class ScrollToTop {
        constructor() {
            this.button = null;
            this.init();
        }

        init() {
            this.createButton();
            this.bindEvents();
        }

        createButton() {
            this.button = document.createElement('button');
            this.button.className = 'scroll-to-top';
            this.button.innerHTML = `
                <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="18,15 12,9 6,15"></polyline>
                </svg>
            `;
            this.button.setAttribute('aria-label', 'Scroll to top');
            this.button.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background-color: var(--color-primary);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            `;
            
            document.body.appendChild(this.button);
        }

        bindEvents() {
            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            window.addEventListener('scroll', throttle(() => {
                if (window.pageYOffset > 300) {
                    this.button.style.opacity = '1';
                    this.button.style.visibility = 'visible';
                } else {
                    this.button.style.opacity = '0';
                    this.button.style.visibility = 'hidden';
                }
            }, 100));
        }
    }
    
    // Initialize scroll to top
    new ScrollToTop();
    })();

    // ===== PERFORMANCE MONITORING =====
    
    (function() {
        'use strict';
        
        class PerformanceMonitor {
        constructor() {
            this.init();
        }

        init() {
            // Monitor Core Web Vitals
            if ('web-vital' in window) {
                this.monitorWebVitals();
            }

            // Monitor page load time
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            });
        }

        monitorWebVitals() {
            // This would integrate with actual web vitals library
            console.log('Web vitals monitoring initialized');
        }
    }
    
    // Initialize performance monitoring
    new PerformanceMonitor();
    })();

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    (function() {
        'use strict';
        
        class AccessibilityEnhancer {
        constructor() {
            this.init();
        }

        init() {
            this.enhanceFocusManagement();
            this.enhanceKeyboardNavigation();
            this.enhanceScreenReaderSupport();
        }

        enhanceFocusManagement() {
            // Skip link functionality
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(skipLink.getAttribute('href'));
                    if (target) {
                        target.focus();
                        target.scrollIntoView();
                    }
                });
            }
        }

        enhanceKeyboardNavigation() {
            // Enhanced keyboard navigation for custom elements
            document.addEventListener('keydown', (e) => {
                // Handle custom button elements
                if (e.target.classList.contains('faq__question') && e.key === 'Enter') {
                    e.target.click();
                }
            });
        }

        enhanceScreenReaderSupport() {
            // Add live regions for dynamic content
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            `;
            document.body.appendChild(liveRegion);
        }
    }
    
    // Initialize accessibility enhancements
    new AccessibilityEnhancer();
    })();

    // ===== INITIALIZATION =====
    
    class App {
        constructor() {
            this.init();
        }

        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
        }

        initializeComponents() {
            // All components are now initialized in their own IIFE blocks
            // Initialize any page-specific functionality
            this.initializePageSpecific();
        }

        initializePageSpecific() {
            const currentPage = document.body.dataset.page;
            
            switch (currentPage) {
                case 'home':
                    this.initializeHomePage();
                    break;
                case 'services':
                    this.initializeServicesPage();
                    break;
                case 'about':
                    this.initializeAboutPage();
                    break;
                case 'contact':
                    this.initializeContactPage();
                    break;
            }
        }

        initializeHomePage() {
            // Home page specific functionality
            console.log('Home page initialized');
        }

        initializeServicesPage() {
            // Services page specific functionality
            console.log('Services page initialized');
        }

        initializeAboutPage() {
            // About page specific functionality
            console.log('About page initialized');
        }

        initializeContactPage() {
            // Contact page specific functionality
            console.log('Contact page initialized');
        }
    }

    // ===== ERROR HANDLING =====
    
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // In production, you might want to send this to an error tracking service
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        // In production, you might want to send this to an error tracking service
    });

    // ===== START APPLICATION =====
    
    // Initialize the application
    new App();

})();
