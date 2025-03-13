// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll animation for smooth navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature, .testimonial');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animation elements
    document.querySelectorAll('.feature, .testimonial').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    });

    // Run animation check on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load

    // Google Analytics event tracking for internal navigation
    document.querySelectorAll('a').forEach(link => {
        if (!link.id.includes('store-link')) { // Skip store links as they have dedicated tracking
            link.addEventListener('click', function() {
                const linkText = this.textContent.trim();
                const linkHref = this.getAttribute('href');
                
                // Track internal link clicks
                if (typeof gtag === 'function') {
                    gtag('event', 'link_click', {
                        'event_category': 'navigation',
                        'event_label': linkText,
                        'link_url': linkHref
                    });
                }
            });
        }
    });

    // Track scroll depth for engagement measurement
    let scrollDepthTracked = {};
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
        
        // Track at 25%, 50%, 75%, and 100% scroll depth
        const depths = [25, 50, 75, 100];
        
        depths.forEach(depth => {
            if (scrollPercentage >= depth && !scrollDepthTracked[depth]) {
                scrollDepthTracked[depth] = true;
                
                if (typeof gtag === 'function') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'engagement',
                        'event_label': depth + '%',
                        'value': depth
                    });
                }
            }
        });
    });
});
