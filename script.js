document.addEventListener('DOMContentLoaded', function() {
    // ===== 1. MOBILE NAVIGATION =====
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    function toggleMobileMenu() {
        navLinks.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Update hamburger icon
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    }
    
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        document.body.style.overflow = '';
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // ===== 2. SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // ===== 3. NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow on scroll
            if (scrollTop > 10) {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            } else {
                navbar.style.boxShadow = 'none';
            }
            
            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.transition = 'transform 0.3s ease';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
                navbar.style.transition = 'transform 0.3s ease';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ===== 4. FADE IN ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== 5. IMAGE LAZY LOADING =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== 6. HOVER EFFECTS =====
    function addHoverEffects() {
        // Cards hover effects
        const cards = document.querySelectorAll('.pillar-card, .program-card, .community-card, .involvement-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Social icons hover effects
        const socialIcons = document.querySelectorAll('.social-icon, .social-link');
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.1)';
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    addHoverEffects();
    
    // ===== 7. FORM HANDLING =====
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const email = emailInput.value;
            
            // Validate email
            if (!isValidEmail(email)) {
                showFormMessage(this, 'Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                showFormMessage(this, 'Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showFormMessage(form, message, type) {
        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        // Add styles
        const styles = `
            .form-message {
                margin-top: 1rem;
                padding: 0.75rem 1rem;
                border-radius: var(--radius-md);
                font-size: 0.875rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .form-message-success {
                background-color: rgba(72, 187, 120, 0.1);
                color: #38a169;
                border: 1px solid rgba(72, 187, 120, 0.2);
            }
            .form-message-error {
                background-color: rgba(245, 101, 101, 0.1);
                color: #e53e3e;
                border: 1px solid rgba(245, 101, 101, 0.2);
            }
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#form-message-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'form-message-styles';
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);
        }
        
        form.appendChild(messageEl);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
    
    // ===== 8. STATS ANIMATION =====
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumber(stat);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    }
    
    function animateNumber(element) {
        const originalText = element.textContent;
        const cleanText = originalText.replace('+', '').replace('%', '');
        const targetNumber = parseFloat(cleanText);
        
        if (isNaN(targetNumber)) return;
        
        const duration = 2000;
        const steps = 60;
        const increment = targetNumber / steps;
        let current = 0;
        const hasPlus = originalText.includes('+');
        const hasPercent = originalText.includes('%');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                clearInterval(timer);
                element.textContent = originalText;
            } else {
                let displayValue = Math.floor(current);
                if (hasPlus) displayValue += '+';
                if (hasPercent) displayValue += '%';
                element.textContent = displayValue;
            }
        }, duration / steps);
    }
    
    // Initialize stats animation
    animateStats();
    
    // ===== 9. PAGE LOAD ANIMATION =====
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
        
        // Add loaded class to body for CSS transitions
        document.body.classList.add('loaded');
    });
    
    // ===== 10. CURRENT YEAR IN FOOTER =====
    const yearElement = document.querySelector('.copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2024', currentYear);
    }
    
    // ===== 11. PARALLAX EFFECT =====
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.backgroundPosition = `center ${rate}px`;
        }
    });
    
    // ===== 12. SOCIAL MEDIA COUNTERS (Simulated) =====
    function updateSocialCounters() {
        const counters = {
            discord: 500,
            instagram: 1200
        };
        
        // Update Discord members
        const discordStat = document.querySelector('.community-stat .stat-number');
        if (discordStat) {
            discordStat.textContent = counters.discord + '+';
        }
    }
    
    updateSocialCounters();
});

// ===== 13. SCROLL TO TOP BUTTON =====
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.setAttribute('aria-label', 'Scroll to top');
    button.setAttribute('title', 'Scroll to top');
    document.body.appendChild(button);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add keyboard support
    button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// Initialize scroll to top button
createScrollToTopButton();

// Add styles for scroll to top button
const scrollToTopStyles = document.createElement('style');
scrollToTopStyles.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 48px;
        height: 48px;
        background-color: var(--accent);
        color: white;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        font-size: 1.25rem;
        box-shadow: var(--shadow-lg);
    }
    
    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .scroll-to-top:hover {
        background-color: var(--accent-light);
        transform: translateY(-2px) scale(1.1);
        box-shadow: var(--shadow-xl);
    }
    
    .scroll-to-top:active {
        transform: translateY(0) scale(0.95);
    }
    
    @media (max-width: 768px) {
        .scroll-to-top {
            bottom: 1rem;
            right: 1rem;
            width: 40px;
            height: 40px;
            font-size: 1rem;
        }
    }
`;
document.head.appendChild(scrollToTopStyles);

// ===== 14. INSTAGRAM FEED INTERACTION =====
document.addEventListener('click', function(e) {
    if (e.target.closest('.instagram-post')) {
        const post = e.target.closest('.instagram-post');
        alert('Opening Instagram post... (In a real implementation, this would open a lightbox or link to Instagram)');
    }
});

// ===== 15. SMOOTH IMAGE LOADING =====
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
});