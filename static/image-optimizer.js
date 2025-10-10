/**
 * Universal Image Optimizer for GitHub Pages
 * Automatically replaces images with WebP versions when available
 * Fallback to original images for older browsers
 */
(function() {
    'use strict';
    
    // Check WebP support
    function supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('webp') !== -1;
    }
    
    // Replace image with WebP if supported
    function optimizeImage(img) {
        if (!supportsWebP()) return;
        
        const src = img.getAttribute('src');
        if (!src || !src.includes('/static/')) return;
        
        let webpSrc = '';
        
        // Generate WebP path based on image type
        if (src.includes('/static/image/')) {
            const fileName = src.split('/').pop().split('.')[0];
            webpSrc = `/static/image/optimized/${fileName}-800.webp`;
        } else if (src.includes('/static/projects/')) {
            const fileName = src.split('/').pop().split('.')[0];
            webpSrc = `/static/projects/optimized/${fileName}-800.webp`;
        } else if (src.includes('/static/logo/')) {
            const fileName = src.split('/').pop().split('.')[0];
            if (fileName.includes('logo-zen')) {
                webpSrc = `/static/logo/optimized/${fileName}-200.webp`;
            } else {
                webpSrc = `/static/logo/optimized/${fileName}-400.webp`;
            }
        } else if (src.includes('/static/shape/')) {
            const fileName = src.split('/').pop().split('.')[0];
            webpSrc = `/static/shape/optimized/${fileName}-200.webp`;
        }
        
        if (!webpSrc) return;
        
        // Test if WebP file exists, then replace
        const testImg = new Image();
        testImg.onload = function() {
            img.src = webpSrc;
            img.classList.add('webp-optimized');
        };
        testImg.onerror = function() {
            // WebP doesn't exist, keep original
            console.log('WebP not found for:', src);
        };
        testImg.src = webpSrc;
    }
    
    // Process all images on the page
    function optimizeAllImages() {
        const images = document.querySelectorAll('img[src*="/static/"]');
        images.forEach(optimizeImage);
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeAllImages);
    } else {
        optimizeAllImages();
    }
    
    // Also run on dynamic content changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    const newImages = node.querySelectorAll ? node.querySelectorAll('img[src*="/static/"]') : [];
                    newImages.forEach(optimizeImage);
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();