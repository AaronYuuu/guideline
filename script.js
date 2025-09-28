/* CHART Website JavaScript */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    setActiveNavigation();
    initializeCitationForms();
    initializeFeedbackForm();
    initializeScrollEffects();
    setCurrentYear();
    initializeMobileMenu();
    checkForSuccessMessage();
    
    // Initialize citation format dropdown
    const formatSelect = document.getElementById('citationFormat');
    if (formatSelect) {
        formatSelect.addEventListener('change', updateCitationFormat);
        // Set initial format
        updateCitationFormat();
    }
});

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // For external PDF links, don't prevent default
            const href = this.getAttribute('href');
            if (href.endsWith('.pdf')) {
                return; // Let the browser handle PDF links normally
            }
            
            // Close mobile menu when navigating to a new page
            closeMobileMenu();
        });
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (nav && mobileToggle) {
        nav.classList.remove('active');
        mobileToggle.classList.remove('active');
    }
}

// Set active navigation item based on current page
function setActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Citation Forms and Functionality
function initializeCitationForms() {
    // Citation format tabs
    const formatTabs = document.querySelectorAll('.format-tab');
    const formatContents = document.querySelectorAll('.format-content');
    
    formatTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const format = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showFormat(format);
        });
    });
    
    // Copy citation functionality
    const copyButton = document.querySelector('.copy-citation');
    if (copyButton) {
        copyButton.addEventListener('click', copyCitation);
    }
}

// Show citation format
function showFormat(format) {
    const formatTabs = document.querySelectorAll('.format-tab');
    const formatContents = document.querySelectorAll('.format-content');
    
    formatTabs.forEach(tab => tab.classList.remove('active'));
    formatContents.forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[onclick*="${format}"]`).classList.add('active');
    document.getElementById(`${format}-format`).classList.add('active');
}

// Update citation format based on dropdown selection
function updateCitationFormat() {
    const formatSelect = document.getElementById('citationFormat');
    const citationText = document.getElementById('citationText');
    
    if (!formatSelect || !citationText) return;
    
    const format = formatSelect.value;
    const citations = {
        vancouver: 'Reporting guideline for chatbot health advice studies: the Chatbot Assessment Reporting Tool (CHART) statement. BMJ Medicine. 2025;4:e001632. https://doi.org/10.1136/bmjmed-2025-001632',
        apa: 'Reporting guideline for chatbot health advice studies: the Chatbot Assessment Reporting Tool (CHART) statement. (2025). <em>BMJ Medicine</em>, <em>4</em>, e001632. https://doi.org/10.1136/bmjmed-2025-001632',
        mla: '"Reporting guideline for chatbot health advice studies: the Chatbot Assessment Reporting Tool (CHART) statement." <em>BMJ Medicine</em>, vol. 4, 2025, e001632, https://doi.org/10.1136/bmjmed-2025-001632.'
    };
    
    citationText.innerHTML = citations[format];
}

// Copy citation to clipboard
function copyCitation() {
    const citationText = document.getElementById('citationText');
    if (citationText) {
        const citation = citationText.textContent || citationText.innerText;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(citation).then(() => {
                showNotification('Citation copied to clipboard!', 'success');
            }).catch(() => {
                fallbackCopyToClipboard(citation);
            });
        } else {
            fallbackCopyToClipboard(citation);
        }
    }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Citation copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy citation. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Feedback Form
function initializeFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmission);
    }
    
    // Handle follow-up checkbox toggle
    const followUpCheckbox = document.getElementById('followUp');
    const emailGroup = document.getElementById('emailGroup');
    const emailInput = document.getElementById('email');
    
    console.log('Elements found:', {
        followUpCheckbox: followUpCheckbox,
        emailGroup: emailGroup,
        emailInput: emailInput
    });
    
    if (followUpCheckbox && emailGroup && emailInput) {
        console.log('All elements found, adding event listener');
        followUpCheckbox.addEventListener('change', function() {
            console.log('Checkbox changed to:', this.checked);
            if (this.checked) {
                emailGroup.style.display = 'block';
                emailInput.setAttribute('required', 'required');
                console.log('Email field shown');
            } else {
                emailGroup.style.display = 'none';
                emailInput.removeAttribute('required');
                emailInput.value = ''; // Clear the email field when hidden
                console.log('Email field hidden');
            }
        });
        
        // Initial state - make sure it's hidden
        emailGroup.style.display = 'none';
        emailInput.removeAttribute('required');
        console.log('Initial state set - email field hidden');
    } else {
        console.log('Some elements not found!');
    }
}

// Handle feedback form submission
function handleFeedbackSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate required fields
    if (!formData.get('rating')) {
        showNotification('Please rate your overall experience with CHART.', 'error');
        return;
    }
    
    // Check if follow-up is selected but email is missing
    const followUpCheckbox = document.getElementById('followUp');
    const emailInput = document.getElementById('email');
    if (followUpCheckbox && followUpCheckbox.checked && emailInput && !emailInput.value.trim()) {
        showNotification('Please provide your email address for follow-up contact.', 'error');
        emailInput.focus();
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    // Submit to Formspree
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show success message
            showNotification('Thank you for your feedback! Your input helps us improve CHART.', 'success');
            
            // Reset form
            form.reset();
            
            // Store locally as backup
            storeFeedbackBackup(formData);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        showNotification('There was an error submitting your feedback. Please try again.', 'error');
        
        // Store locally as fallback
        storeFeedbackBackup(formData);
    })
    .finally(() => {
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}

// Store feedback locally as backup
function storeFeedbackBackup(formData) {
    try {
        const feedbackData = {
            useCase: formData.get('useCase'),
            rating: formData.get('rating'),
            useful: formData.getAll('useful'),
            comments: formData.get('comments'),
            followUp: formData.get('followUp'),
            email: formData.get('email'),
            timestamp: new Date().toISOString()
        };
        
        let storedFeedback = JSON.parse(localStorage.getItem('chartFeedbackBackup')) || [];
        storedFeedback.push(feedbackData);
        localStorage.setItem('chartFeedbackBackup', JSON.stringify(storedFeedback));
        
        console.log('Feedback backed up locally:', feedbackData);
        
    } catch (error) {
        console.error('Error storing feedback backup:', error);
    }
}

// Resource Opening Functions
function openResource(filename) {
    // Open PDF in new tab
    window.open(filename, '_blank', 'noopener,noreferrer');
    
    // Track resource access (for analytics if needed)
    trackResourceAccess(filename);
}

function trackResourceAccess(filename) {
    try {
        let accessLog = JSON.parse(localStorage.getItem('chartResourceAccess')) || [];
        accessLog.push({
            resource: filename,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        
        // Keep only last 100 entries
        if (accessLog.length > 100) {
            accessLog = accessLog.slice(-100);
        }
        
        localStorage.setItem('chartResourceAccess', JSON.stringify(accessLog));
        
        // TODO: Send to analytics service if needed
        // Example: gtag('event', 'resource_download', { 'resource_name': filename });
        
    } catch (error) {
        console.error('Error tracking resource access:', error);
    }
}

// Modern Scroll Effects and Animations
function initializeScrollEffects() {
    // Modern intersection observer for staggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for modern fade-in animation
    const elementsToObserve = document.querySelectorAll('.resource-card, .content-block, .resource-item, .feature-item, .step, .info-item');
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.95)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
    
    // Add loading state for buttons
    addButtonLoadingStates();
    
    // Modern scroll-based header effects
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', throttle(function() {
        const currentScrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        if (header) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            lastScrollY = currentScrollY;
        }
    }, 10));
}

// Add modern loading states to buttons
function addButtonLoadingStates() {
    const buttons = document.querySelectorAll('.btn, .icon-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't add loading state to PDF links
            if (this.href && this.href.endsWith('.pdf')) {
                return;
            }
            
            // Add loading state
            const originalText = this.textContent;
            this.style.pointerEvents = 'none';
            this.innerHTML = '<span style="opacity: 0.7;">Loading...</span>';
            
            // Remove loading state after a short delay
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
            }, 800);
        });
    });
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#678DC6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation keyframes if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .notification-message {
                flex: 1;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add modern fade-in class for animations
const fadeInStyles = document.createElement('style');
fadeInStyles.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
    }
    
    /* Modern scroll header transition */
    .header {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    /* Enhanced loading states */
    .btn:disabled,
    .icon-btn:disabled {
        opacity: 0.7;
        transform: none !important;
        cursor: not-allowed;
    }
    
    /* Modern selection styles */
    ::selection {
        background: rgba(79, 70, 229, 0.3);
        color: var(--text-white);
    }
    
    ::-moz-selection {
        background: rgba(79, 70, 229, 0.3);
        color: var(--text-white);
    }
`;
document.head.appendChild(fadeInStyles);

// Utility Functions
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

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Check for success message from Formspree redirect
function checkForSuccessMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showNotification('Thank you for your feedback! Your submission was received successfully.', 'success');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Accessibility Improvements
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Enter key on resource cards
    if (e.key === 'Enter' && e.target.classList.contains('resource-card')) {
        const button = e.target.querySelector('.icon-btn');
        if (button) button.click();
    }
});

// Performance monitoring (optional)
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Service Worker Registration (for offline functionality - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        /*
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
        */
    });
}

// Export functions for global access
window.openResource = openResource;
window.showFormat = showFormat;
window.copyCitation = copyCitation;