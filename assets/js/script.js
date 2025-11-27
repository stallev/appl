// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle menu visibility
            navMenu.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a nav link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
});

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== FORM VALIDATION AND SUBMISSION =====
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#f56565';
            isValid = false;
        } else {
            field.style.borderColor = '#e2e8f0';
        }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.style.borderColor = '#f56565';
            isValid = false;
        }
    }
    
    // Phone validation
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phoneField.value.replace(/\D/g, ''))) {
            phoneField.style.borderColor = '#f56565';
            isValid = false;
        }
    }
    
    return isValid;
}

// ===== CONTACT FORM HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual form handling)
                setTimeout(() => {
                    alert('Thank you for your message! We will contact you within 24 hours.');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                alert('Please fill in all required fields correctly.');
            }
        });
    }
});

// ===== SCROLL ANIMATIONS =====
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .feature, .testimonial');
    
    animatedElements.forEach(element => {
        if (isElementInViewport(element) && !element.classList.contains('fade-in-up')) {
            element.classList.add('fade-in-up');
        }
    });
}

// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleScrollAnimations, 100);
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== SOCIAL PROOF POPUP =====
function showSocialProof() {
    const popup = document.getElementById('social-proof');
    if (popup) {
        // Show popup after 3 seconds
        setTimeout(() => {
            popup.style.display = 'block';
            // Hide after 5 seconds
            setTimeout(() => {
                popup.style.display = 'none';
            }, 5000);
        }, 3000);
    }
}

// ===== URGENCY COUNTER =====
function updateUrgencyCounter() {
    const slotsElement = document.querySelector('.slots-indicator');
    if (slotsElement) {
        // Simulate decreasing slots
        let slots = 3;
        setInterval(() => {
            if (slots > 1) {
                slots--;
                slotsElement.innerHTML = `
                    <svg viewBox="0 0 24 24" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>
                    Only ${slots} slots left today
                `;
            }
        }, 30000); // Update every 30 seconds
    }
}

// ===== FORM PROGRESS TRACKING =====
function trackFormProgress() {
    const form = document.querySelector('#contact-form');
    if (form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let completedFields = 0;
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                completedFields = Array.from(inputs).filter(input => input.value.trim() !== '').length;
                const progress = (completedFields / inputs.length) * 100;
                
                // Update form completion indicator
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.textContent = `Get Free Quote (${Math.round(progress)}% Complete)`;
                }
            });
        });
    }
}

// ===== DEVICE SELECTOR INTERACTIONS =====
function initDeviceSelector() {
    const deviceOptions = document.querySelectorAll('.device-option');
    
    deviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            deviceOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            // Track selection
            const device = this.querySelector('input').value;
            trackDeviceSelection(device);
        });
    });
}

// ===== PHONE NUMBER FORMATTING =====
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }
    input.value = value;
}

// Apply phone formatting to all phone inputs
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});

// ===== TESTIMONIAL CAROUSEL (if needed) =====
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentIndex = 0;
    
    if (testimonials.length <= 1) return;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }
    
    // Auto-rotate testimonials every 5 seconds
    setInterval(nextTestimonial, 5000);
    showTestimonial(0);
}

// ===== LAZY LOADING FOR IMAGES =====
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== GOOGLE MAPS INTEGRATION (placeholder) =====
function initMap() {
    // This would be replaced with actual Google Maps API integration
    const mapContainer = document.querySelector('#map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="width: 100%; height: 300px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                <p style="color: #4a5568;">Interactive Map - Sacramento, CA</p>
            </div>
        `;
    }
}

// ===== ANALYTICS AND TRACKING =====
function trackEvent(eventName, eventData) {
    // Google Analytics or other tracking implementation
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// ===== CALL TRACKING =====
function trackCall(phoneNumber) {
    trackEvent('phone_call', {
        'event_category': 'contact',
        'event_label': phoneNumber,
        'value': 1
    });
}

// ===== FORM TRACKING =====
function trackFormSubmission(formType) {
    trackEvent('form_submit', {
        'event_category': 'lead_generation',
        'event_label': formType,
        'value': 1
    });
}

// ===== DEVICE SELECTION TRACKING =====
function trackDeviceSelection(device) {
    trackEvent('device_selected', {
        'event_category': 'engagement',
        'event_label': device,
        'custom_parameter_1': device
    });
}

// ===== CONVERSION TRACKING =====
function trackConversion(conversionType, value = 0) {
    trackEvent('conversion', {
        'event_category': 'conversion',
        'event_label': conversionType,
        'value': value
    });
}

// Track CTA button clicks
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .phone-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_click', {
                button_text: this.textContent,
                button_location: this.closest('section')?.className || 'unknown'
            });
            
            // Track phone calls
            if (this.href && this.href.startsWith('tel:')) {
                trackCall(this.href);
            }
        });
    });
    
    // Track phone links
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackCall(this.href);
        });
    });
    
    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            trackFormSubmission('contact_form');
        });
    });
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Skip to main content link
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '6px';
    skipLink.style.zIndex = '10000';
    skipLink.style.padding = '8px 16px';
    skipLink.style.background = '#f56565';
    skipLink.style.color = 'white';
    skipLink.style.textDecoration = 'none';
    skipLink.style.borderRadius = '4px';
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
        this.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
        this.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    lazyLoadImages();
    initTestimonialCarousel();
    initMap();
    addSkipLink();
    
    // Initialize new features
    showSocialProof();
    updateUrgencyCounter();
    trackFormProgress();
    initDeviceSelector();
    initABTesting();
    
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" style="animation: spin 1s linear infinite;">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    </svg>
                    Sending...
                `;
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/></svg>
                        Call Me Back Now
                    `;
                }, 3000);
            }
        });
    });
});

// ===== PRICING CALCULATOR =====
function updateCalculator() {
    const deviceType = document.getElementById('deviceType').value;
    const issueType = document.getElementById('issueType').value;
    const deviceBrand = document.getElementById('deviceBrand').value;
    
    if (deviceType && issueType && deviceBrand) {
        // Calculate price based on selections
        let basePrice = 0;
        
        // Device type pricing
        const devicePrices = {
            'phone': 59,
            'tablet': 79,
            'laptop': 149,
            'desktop': 199,
            'tv': 299,
            'gaming': 89
        };
        
        // Issue type multipliers
        const issueMultipliers = {
            'screen': 1.0,
            'battery': 0.8,
            'water': 1.5,
            'software': 0.6,
            'charging': 0.7,
            'other': 1.2
        };
        
        // Brand multipliers
        const brandMultipliers = {
            'apple': 1.3,
            'samsung': 1.1,
            'lg': 1.0,
            'sony': 1.2,
            'dell': 1.0,
            'hp': 1.0,
            'other': 1.0
        };
        
        basePrice = devicePrices[deviceType] || 99;
        const multiplier = (issueMultipliers[issueType] || 1.0) * (brandMultipliers[deviceBrand] || 1.0);
        const finalPrice = Math.round(basePrice * multiplier);
        
        // Update UI
        document.getElementById('priceDisplay').textContent = `$${finalPrice}`;
        document.getElementById('calculatorResult').style.display = 'block';
        
        // Update steps
        document.getElementById('step1').classList.add('completed');
        document.getElementById('step2').classList.add('completed');
        document.getElementById('step3').classList.add('active');
        
        // Track calculator completion
        trackEvent('calculator_completed', {
            device_type: deviceType,
            issue_type: issueType,
            brand: deviceBrand,
            estimated_price: finalPrice
        });
    }
}

// ===== VIDEO TESTIMONIALS =====
function playVideo(container) {
    // Simulate video play
    const playButton = container.querySelector('.play-button');
    playButton.innerHTML = '⏸';
    playButton.style.background = '#38a169';
    
    // Track video play
    trackEvent('video_testimonial_play', {
        video_id: container.closest('.video-testimonial').querySelector('.testimonial-author').textContent
    });
}

// ===== CHATBOT =====
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.style.display = chatbot.style.display === 'flex' ? 'none' : 'flex';
    
    if (chatbot.style.display === 'flex') {
        trackEvent('chatbot_opened');
    }
}

function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const messages = document.getElementById('chatbotMessages');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.textContent = message;
        messages.appendChild(userMessage);
        
        // Clear input
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.textContent = botResponse;
            messages.appendChild(botMessage);
            
            // Scroll to bottom
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
        
        // Track chatbot interaction
        trackEvent('chatbot_message_sent', { message: message });
    }
}

function handleChatbotKeypress(event) {
    if (event.key === 'Enter') {
        sendChatbotMessage();
    }
}

function getBotResponse(message) {
    const responses = [
        "I understand you need help with your device. Can you tell me what specific issue you're experiencing?",
        "That sounds like a common problem we can definitely fix! What's the make and model of your device?",
        "Great! We specialize in that type of repair. Would you like me to get you a free quote?",
        "I can help you with that. Our technicians have 8+ years of experience with this exact issue.",
        "Perfect! We offer same-day service for this type of repair. Shall I connect you with our team?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// ===== EXIT INTENT POPUP =====
let exitIntentShown = false;

function showExitIntent() {
    if (!exitIntentShown) {
        document.getElementById('exitIntentPopup').style.display = 'flex';
        exitIntentShown = true;
        
        // Track exit intent
        trackEvent('exit_intent_shown');
        
        // Auto close after 30 seconds
        setTimeout(() => {
            closeExitPopup();
        }, 30000);
    }
}

function closeExitPopup() {
    document.getElementById('exitIntentPopup').style.display = 'none';
    trackEvent('exit_intent_closed');
}

// ===== EXIT INTENT DETECTION =====
document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0 && !exitIntentShown) {
        showExitIntent();
    }
});

// ===== A/B TESTING =====
function initABTesting() {
    // Randomly assign users to test groups
    const testGroup = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem('ab_test_group', testGroup);
    
    // Apply different CTA text based on group
    if (testGroup === 'B') {
        const ctaButtons = document.querySelectorAll('.btn-primary');
        ctaButtons.forEach(button => {
            if (button.textContent.includes('Call Now')) {
                button.textContent = button.textContent.replace('Call Now', 'Get Free Quote');
            }
        });
    }
    
    trackEvent('ab_test_assigned', { group: testGroup });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to analytics
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Track page load time
    const loadTime = performance.now();
    trackEvent('page_load_time', {
        load_time: Math.round(loadTime)
    });
});
