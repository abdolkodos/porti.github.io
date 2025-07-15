document.addEventListener('DOMContentLoaded', function() {
    // Animation configuration - add your animation classes here
    const animationConfig = {
        // Number counter animations
        'stat-item': {
            triggerClass: 'animate',
            action: (element) => {
                const numberElement = element.querySelector('.stat-number');
                if (numberElement) {
                    const target = parseInt(numberElement.getAttribute('data-target'));
                    animateNumber(numberElement, target);
                }
            }
        },
        
        // Generic fade-in animation
        'fade-in': {
            triggerClass: 'active',
            action: null // CSS handles the animation
        },
        
        // Slide-up animation
        'slide-up': {
            triggerClass: 'active',
            action: null
        },
        
        // Add more animation types here as needed
        // Format: 'class-to-watch': { config }
        'container1': {
            triggerClass: 'test', // Class to add when element is in view
            //action: (element) => {
                // Custom JavaScript animation if needed
            //},
            unobserve: true // Whether to stop observing after first trigger
        },
                'container2': {
            triggerClass: 'test', // Class to add when element is in view
            //action: (element) => {
                // Custom JavaScript animation if needed
            //},
            unobserve: true // Whether to stop observing after first trigger
        }
    };

    // Function to animate numbers
    function animateNumber(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(updateNumber);
    }
    
    // Function to handle intersection observer
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Check all configured animation types
                for (const [animClass, config] of Object.entries(animationConfig)) {
                    if (element.classList.contains(animClass)) {
                        // Add trigger class
                        element.classList.add(config.triggerClass);
                        
                        // Execute custom action if defined
                        if (config.action) {
                            setTimeout(() => {
                                config.action(element);
                            }, 200);
                        }
                        
                        // Stop observing if configured to do so
                        if (config.unobserve !== false) {
                            observer.unobserve(element);
                        }
                        break;
                    }
                }
            }
        });
    }
    
    // Create intersection observer
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe all elements with animation classes
    const animatableSelectors = Object.keys(animationConfig).map(c => `.${c}`).join(', ');
    if (animatableSelectors) {
        document.querySelectorAll(animatableSelectors).forEach(item => {
            observer.observe(item);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Scroll progress indicator
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: ${scrollPercent}%;
                height: 5px;
                border-radius:3px;
                background: linear-gradient(90deg, #5572f3ff, #ffffffff);
                z-index: 9999;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        } else {
            progressBar.style.width = scrollPercent + '%';
        }
    }
     function moveitems() {
        const scrol = window.pageYOffset;
        const docsHeight = document.body.offsetHeight - window.innerHeight;
        const scrolPercent = scrol*40/600 ;
        
        let progres = document.querySelector('.ring');
        if (!progres) {
            progres = document.getElementsByClassName("ring");
            progres.style.cssText = `
                top:${scrolPercent}%;
            `;
            document.body.appendChild(progressBar);
        } else {
            progres.style.top = scrolPercent + '%';
        }
    }
    // Parallax effect
    function handleParallax() {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.parallax').forEach(el => {
            const rate = scrolled * (parseFloat(el.dataset.rate) || -0.5);
            el.style.transform = `translateY(${rate}px)`;
        });
    }
    // Hover effects for stat items
    document.querySelectorAll('.stat-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Performance optimization: throttle scroll events
    let ticking = false;
    function throttledScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateScrollProgress();
                handleParallax();
                moveitems();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', throttledScroll);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const keyActions = {
            'ArrowDown': window.innerHeight * 0.8,
            'PageDown': window.innerHeight * 0.8,
            'ArrowUp': -window.innerHeight * 0.8,
            'PageUp': -window.innerHeight * 0.8
        };
        
        if (keyActions[e.key] !== undefined) {
            e.preventDefault();
            window.scrollBy({
                top: keyActions[e.key],
                behavior: 'smooth'
            });
        } else if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
    
    console.log('Animation system initialized successfully!');
});