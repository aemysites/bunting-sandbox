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
  console.log('Inject script: Starting cleanup process for IDFC FIRST Bank page');
  
  // Comprehensive cleanup function for IDFC FIRST Bank specific elements
  function cleanupPage() {
    console.log('Cleanup: Starting comprehensive page cleanup');
    
    // 1. Remove cookie consent banners and overlays
    const cookieSelectors = [
      '#cookieDialog',
      '.cookie-banner',
      '.cookie-consent',
      '.cookie-notice',
      '[data-cookie]',
      '.gdpr-banner',
      '.privacy-banner',
      '.consent-banner'
    ];
    
    cookieSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        console.log(`Cleanup: Removing cookie element: ${selector}`);
        el.remove();
      });
    });
    
    // 2. Close any modal pop-ups, overlays, and promotional banners
    const closeSelectors = [
      '.close',
      '.btn-close', 
      '.modal-close',
      '[aria-label="Close"]',
      '[data-dismiss="modal"]',
      '.fa-times',
      '.fa-close',
      '.icon-close',
      '.popup-close',
      '.overlay-close',
      '[data-close]',
      '.dismiss',
      '.skip',
      '.continue',
      '.proceed'
    ];
    
    closeSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.offsetParent !== null) { // Only click visible elements
          console.log(`Cleanup: Clicking close button: ${selector}`);
          el.click();
        }
      });
    });
    
    // 3. Remove specific IDFC FIRST Bank elements that might interfere
    const idfcSelectors = [
      '.popup',
      '.modal',
      '.overlay',
      '.banner',
      '.promotion',
      '.offer-banner',
      '.notification',
      '.alert',
      '.toast',
      '.floating-element',
      '.sticky-banner'
    ];
    
    idfcSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Check if element is likely a popup/overlay (has high z-index or is positioned fixed/sticky)
        const styles = window.getComputedStyle(el);
        const zIndex = parseInt(styles.zIndex) || 0;
        const position = styles.position;
        
        if (zIndex > 100 || position === 'fixed' || position === 'sticky') {
          console.log(`Cleanup: Removing overlay element: ${selector}`);
          el.remove();
        }
      });
    });
    
    // 4. Accept cookie consent if present
    acceptCookieBanner();
    
    // 5. Remove any remaining problematic elements
    const problematicSelectors = [
      '[style*="position: fixed"]',
      '[style*="position: sticky"]',
      '[style*="z-index"]'
    ];
    
    problematicSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const zIndex = parseInt(styles.zIndex) || 0;
        if (zIndex > 50) { // High z-index likely indicates overlay
          console.log(`Cleanup: Removing high z-index element`);
          el.remove();
        }
      });
    });
  }
  
  // Enhanced cookie banner acceptance function
  function acceptCookieBanner() {
    console.log('Cookie banner: Starting acceptance process');
    
    // Multiple selectors for different cookie banner implementations
    const cookieBannerSelectors = [
      '#cookieDialog',
      '.cookie-banner',
      '.cookie-consent',
      '.gdpr-banner',
      '.privacy-notice',
      '[data-cookie]'
    ];
    
    let bannerFound = false;
    
    cookieBannerSelectors.forEach(selector => {
      const banner = document.querySelector(selector);
      if (banner && !bannerFound) {
        console.log(`Cookie banner: Found banner with selector: ${selector}`);
        bannerFound = true;
        
        // Try multiple accept button selectors
        const acceptButtonSelectors = [
          '.disclaimer-accept-button[data-ltype="cscookie"]',
          '.accept-button',
          '.cookie-accept',
          '.btn-accept',
          '[data-accept]',
          'button[type="submit"]',
          '.btn-primary',
          '.btn-success',
          'button:contains("Accept")',
          'button:contains("Agree")',
          'button:contains("OK")',
          'button:contains("Continue")'
        ];
        
        let buttonClicked = false;
        acceptButtonSelectors.forEach(btnSelector => {
          if (!buttonClicked) {
            const acceptButton = banner.querySelector(btnSelector) || document.querySelector(btnSelector);
            if (acceptButton && acceptButton.offsetParent !== null) {
              console.log(`Cookie banner: Found accept button: ${btnSelector}`);
              acceptButton.click();
              console.log('Cookie banner: Clicked accept button');
              buttonClicked = true;
            }
          }
        });
        
        // If no button found, try to remove the banner
        if (!buttonClicked) {
          console.log('Cookie banner: No accept button found, removing banner');
          banner.remove();
        }
      }
    });
    
    if (!bannerFound) {
      console.log('Cookie banner: No cookie banner found');
    }
  }
  
  // Execute cleanup immediately
  cleanupPage();
  
  // Set up mutation observer for dynamic content
  const observer = new MutationObserver((mutations) => {
    let shouldCleanup = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check for common popup/overlay indicators
            if (node.classList && (
              node.classList.contains('popup') ||
              node.classList.contains('modal') ||
              node.classList.contains('overlay') ||
              node.classList.contains('banner') ||
              node.id === 'cookieDialog'
            )) {
              shouldCleanup = true;
            }
          }
        });
      }
    });
    
    if (shouldCleanup) {
      console.log('Cleanup: Dynamic content detected, running cleanup');
      setTimeout(cleanupPage, 100); // Small delay to let content fully load
    }
  });
  
  // Start observing with comprehensive options
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'id', 'style']
  });
  
  // Additional cleanup after a delay to catch late-loading elements
  setTimeout(cleanupPage, 1000);
  setTimeout(cleanupPage, 3000);
  
  console.log('Inject script: Cleanup process completed');

})();
