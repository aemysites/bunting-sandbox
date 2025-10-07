/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
(() => {
  console.log('Inject script: Starting aggressive cleanup process for IDFC FIRST Bank page');
  
  // Track cleanup attempts to avoid infinite loops
  let cleanupCount = 0;
  const maxCleanupAttempts = 50;
  
  // Aggressive cleanup function for late-loading popups
  function aggressiveCleanup() {
    cleanupCount++;
    console.log(`Cleanup: Attempt ${cleanupCount} - Starting aggressive cleanup`);
    
    // 1. Remove ALL elements with high z-index (likely overlays/popups)
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const zIndex = parseInt(styles.zIndex) || 0;
      const position = styles.position;
      const display = styles.display;
      
      // Remove elements that are likely popups/overlays
      if ((zIndex > 100 && position !== 'static') || 
          (position === 'fixed' && zIndex > 10) ||
          (position === 'sticky' && zIndex > 10) ||
          (display === 'block' && zIndex > 50)) {
        
        // Check if element is visible and likely a popup
        if (el.offsetParent !== null && el.offsetWidth > 0 && el.offsetHeight > 0) {
          console.log(`Cleanup: Removing high z-index element (z-index: ${zIndex}, position: ${position})`);
          el.remove();
        }
      }
    });
    
    // 2. Remove specific popup/overlay patterns
    const popupSelectors = [
      // Cookie and consent banners
      '#cookieDialog', '.cookie-banner', '.cookie-consent', '.cookie-notice',
      '[data-cookie]', '.gdpr-banner', '.privacy-banner', '.consent-banner',
      
      // Modal and popup patterns
      '.modal', '.popup', '.overlay', '.lightbox', '.dialog',
      '.popup-overlay', '.modal-overlay', '.backdrop',
      
      // Banner and notification patterns
      '.banner', '.notification', '.alert', '.toast', '.snackbar',
      '.promotion', '.offer-banner', '.sticky-banner', '.floating-banner',
      
      // IDFC specific patterns
      '.idfc-popup', '.idfc-modal', '.idfc-banner',
      '[id*="popup"]', '[id*="modal"]', '[id*="overlay"]',
      '[class*="popup"]', '[class*="modal"]', '[class*="overlay"]',
      
      // Generic overlay patterns
      '.overlay', '.backdrop', '.mask', '.shade',
      '[role="dialog"]', '[role="alertdialog"]', '[aria-modal="true"]'
    ];
    
    popupSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.offsetParent !== null) { // Only remove visible elements
          console.log(`Cleanup: Removing popup element: ${selector}`);
          el.remove();
        }
      });
    });
    
    // 3. Click ALL close buttons and dismiss elements
    const closeSelectors = [
      '.close', '.btn-close', '.modal-close', '.popup-close', '.overlay-close',
      '[aria-label="Close"]', '[aria-label="close"]', '[data-dismiss="modal"]',
      '.fa-times', '.fa-close', '.icon-close', '.close-icon', '.x-close',
      '[data-close]', '[data-dismiss]', '.dismiss', '.skip', '.continue',
      '.proceed', '.accept', '.ok', '.got-it', '.understand',
      'button[type="button"]', '.btn', 'a[href="#"]'
    ];
    
    closeSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.offsetParent !== null && el.offsetWidth > 0 && el.offsetHeight > 0) {
          console.log(`Cleanup: Clicking close button: ${selector}`);
          try {
            el.click();
            // Also try triggering events
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          } catch (e) {
            console.log(`Cleanup: Error clicking element: ${e.message}`);
          }
        }
      });
    });
    
    // 4. Force remove any remaining overlays by targeting body children
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(child => {
      const styles = window.getComputedStyle(child);
      const zIndex = parseInt(styles.zIndex) || 0;
      const position = styles.position;
      
      // Remove any direct body children that look like overlays
      if ((zIndex > 50) || (position === 'fixed') || (position === 'sticky')) {
        console.log(`Cleanup: Removing overlay child of body (z-index: ${zIndex})`);
        child.remove();
      }
    });
    
    // 5. Disable any remaining popup triggers
    const popupTriggers = document.querySelectorAll('[onclick*="popup"], [onclick*="modal"], [onclick*="show"]');
    popupTriggers.forEach(trigger => {
      trigger.removeAttribute('onclick');
      trigger.onclick = null;
    });
  }
  
  // Execute aggressive cleanup immediately
  aggressiveCleanup();
  
  // Set up continuous monitoring for late-loading popups
  const continuousObserver = new MutationObserver((mutations) => {
    let shouldCleanup = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const styles = window.getComputedStyle(node);
            const zIndex = parseInt(styles.zIndex) || 0;
            const position = styles.position;
            
            // Check for any new elements that might be popups
            if (node.classList && (
              node.classList.contains('popup') ||
              node.classList.contains('modal') ||
              node.classList.contains('overlay') ||
              node.classList.contains('banner') ||
              node.classList.contains('notification') ||
              node.classList.contains('alert') ||
              node.id === 'cookieDialog' ||
              zIndex > 50 ||
              position === 'fixed' ||
              position === 'sticky'
            )) {
              shouldCleanup = true;
              console.log('Cleanup: New popup/overlay detected, triggering cleanup');
            }
          }
        });
      }
      
      // Also check for style changes that might indicate popup appearance
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
        const target = mutation.target;
        if (target.nodeType === 1) {
          const styles = window.getComputedStyle(target);
          const zIndex = parseInt(styles.zIndex) || 0;
          const position = styles.position;
          
          if (zIndex > 50 || position === 'fixed' || position === 'sticky') {
            shouldCleanup = true;
            console.log('Cleanup: Style change detected that might indicate popup');
          }
        }
      }
    });
    
    if (shouldCleanup && cleanupCount < maxCleanupAttempts) {
      console.log('Cleanup: Mutation detected, running aggressive cleanup');
      setTimeout(() => aggressiveCleanup(), 50); // Very short delay
    }
  });
  
  // Start continuous monitoring
  continuousObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'id', 'style', 'data-*']
  });
  
  // Set up multiple cleanup intervals to catch late-loading popups
  const cleanupIntervals = [100, 500, 1000, 2000, 3000, 5000, 10000, 15000, 30000];
  
  cleanupIntervals.forEach((delay, index) => {
    setTimeout(() => {
      if (cleanupCount < maxCleanupAttempts) {
        console.log(`Cleanup: Scheduled cleanup ${index + 1} after ${delay}ms`);
        aggressiveCleanup();
      }
    }, delay);
  });
  
  // Set up a final aggressive cleanup that runs every 2 seconds for the first minute
  let finalCleanupCount = 0;
  const finalCleanupInterval = setInterval(() => {
    if (finalCleanupCount < 30 && cleanupCount < maxCleanupAttempts) { // Run for 1 minute
      console.log(`Cleanup: Final aggressive cleanup attempt ${finalCleanupCount + 1}`);
      aggressiveCleanup();
      finalCleanupCount++;
    } else {
      clearInterval(finalCleanupInterval);
      console.log('Cleanup: Final cleanup interval stopped');
    }
  }, 2000);
  
  // Override common popup creation methods
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    
    // Monitor for elements that might become popups
    const observer = new MutationObserver(() => {
      const styles = window.getComputedStyle(element);
      const zIndex = parseInt(styles.zIndex) || 0;
      const position = styles.position;
      
      if (zIndex > 50 || position === 'fixed' || position === 'sticky') {
        console.log('Cleanup: New element detected as potential popup, removing');
        element.remove();
      }
    });
    
    observer.observe(element, { attributes: true, attributeFilter: ['style', 'class'] });
    
    return element;
  };
  
  console.log('Inject script: Aggressive cleanup system initialized');

})();
