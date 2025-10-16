// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // Newsletter Form Submission with Firebase
    const newsletterForm = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message') || document.getElementById('newsletter-message');
    const emailInput = document.getElementById('email-input') || document.getElementById('newsletter-email');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = emailInput.value.trim();

            // Disable submit button
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNewsletterMessage('Please enter a valid email address', 'error');
                resetNewsletterButton();
                return;
            }

            try {
                // Import Firebase functions
                const { functions, httpsCallable } = await import('./firebase-config.js');
                const submitNewsletter = httpsCallable(functions, 'submitNewsletter');

                // Call Firebase function
                const result = await submitNewsletter({ email: email });

                if (result.data.success) {
                    showNewsletterMessage(result.data.message, 'success');
                    emailInput.value = '';

                    // Hide message after 5 seconds
                    setTimeout(() => {
                        if (formMessage) {
                            formMessage.classList.add('hidden');
                        }
                    }, 5000);
                } else {
                    showNewsletterMessage('There was an issue with your subscription. Please try again.', 'error');
                    resetNewsletterButton();
                }
            } catch (error) {
                console.error('Error subscribing to newsletter:', error);
                let errorMessage = 'Sorry, there was an error. Please try again.';

                if (error.code === 'functions/invalid-argument') {
                    errorMessage = 'Please enter a valid email address.';
                }

                showNewsletterMessage(errorMessage, 'error');
                resetNewsletterButton();
            }

            function showNewsletterMessage(message, type) {
                if (formMessage) {
                    formMessage.textContent = message;
                    formMessage.style.color = type === 'success' ? '#2e7d32' : '#d32f2f';
                    formMessage.classList.remove('hidden');
                }
            }

            function resetNewsletterButton() {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // Contact Form Submission with Firebase
    const contactForm = document.getElementById('contact-form');
    const contactFormMessage = document.getElementById('contact-form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Disable submit button to prevent double submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                company: document.getElementById('company').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: document.getElementById('service').value,
                message: document.getElementById('message').value.trim()
            };

            // Client-side validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const nameRegex = /^[a-zA-Z\s\-']+$/;

            if (!formData.name || formData.name.length < 2) {
                showFormMessage('Please enter your name (at least 2 characters).', 'error');
                resetSubmitButton();
                return;
            }

            if (!nameRegex.test(formData.name)) {
                showFormMessage('Name can only contain letters, spaces, hyphens, and apostrophes.', 'error');
                resetSubmitButton();
                return;
            }

            if (!formData.email || !emailRegex.test(formData.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                resetSubmitButton();
                return;
            }

            if (!formData.message || formData.message.length < 10) {
                showFormMessage('Please enter a message (at least 10 characters).', 'error');
                resetSubmitButton();
                return;
            }

            if (formData.message.length > 5000) {
                showFormMessage('Message is too long (maximum 5000 characters).', 'error');
                resetSubmitButton();
                return;
            }

            try {
                // Import Firebase functions
                const { functions, httpsCallable } = await import('./firebase-config.js');
                const submitContactForm = httpsCallable(functions, 'submitContactForm');

                // Call Firebase function
                const result = await submitContactForm(formData);

                if (result.data.success) {
                    showFormMessage(result.data.message, 'success');
                    contactForm.reset();

                    // Hide message after 7 seconds
                    setTimeout(() => {
                        contactFormMessage.classList.add('hidden');
                    }, 7000);
                } else {
                    showFormMessage('There was an issue sending your message. Please try again.', 'error');
                    resetSubmitButton();
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                let errorMessage = 'Sorry, there was an error sending your message. Please try again.';

                if (error.code === 'functions/invalid-argument') {
                    errorMessage = error.message;
                } else if (error.code === 'functions/unauthenticated') {
                    errorMessage = 'Authentication error. Please refresh the page and try again.';
                } else if (error.code === 'functions/unavailable') {
                    errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
                }

                showFormMessage(errorMessage, 'error');
                resetSubmitButton();
            }

            function showFormMessage(message, type) {
                contactFormMessage.textContent = message;
                contactFormMessage.style.color = type === 'success' ? '#2e7d32' : '#d32f2f';
                contactFormMessage.classList.remove('hidden');
            }

            function resetSubmitButton() {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to header
    let lastScroll = 0;
    const header = document.getElementById('site-header');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Lazy loading images (optional enhancement)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply fade-in to service cards and sections
    document.querySelectorAll('.service-card, .contact-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(el);
    });
});
