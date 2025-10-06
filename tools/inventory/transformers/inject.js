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
  // remove dom elements - typically cookie consent or other items that should not be imported
  //document.querySelectorAll('#grexitintentPopup').forEach((el) => el.remove());
  //document.querySelectorAll('.close, .btn-close, .modal-close, [aria-label="Close"], [data-dismiss="modal"], .fa-times, .fa-close, .icon-close').forEach((el) => el.click());

  // Automatically accept cookie consent banners to ensure clean inventory generation
    
  function acceptCookieBanner() {
    console.log('Cookie banner: Starting acceptance process');
      
    // Check if cookie dialog exists
    const cookieDialog = document.querySelector('#cookieDialog');
    if (cookieDialog) {
      console.log('Cookie banner: Found cookieDialog element');
       
      // Method 1: Simple click on Accept button (most likely to work)
      const acceptButton = document.querySelector('#cookieDialog .disclaimer-accept-button[data-ltype="cscookie"]');
        
      if (acceptButton) {
        console.log(`Cookie banner: Found Accept button - "${acceptButton.textContent.trim()}"`);
        acceptButton.click();
        console.log('Cookie banner: Clicked Accept button');
        
        console.log('Cookie banner: Cookie accepted successfully');
          
      } else {
        console.log('Cookie banner: Accept button not found');
      }
        
    } else {
      console.log('Cookie banner: No cookieDialog found');
      return false;
    }
  }
    
  // Try to accept cookie banner immediately
  acceptCookieBanner();
    
  // Set up a mutation observer to catch dynamically loaded cookie banners
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
      
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if the cookieDialog was added
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.id === 'cookieDialog' || node.querySelector('#cookieDialog')) {
              shouldCheck = true;
            }
          }
        });
      }
    });
      
    if (shouldCheck) {
      console.log('Cookie banner: New content detected, checking for cookie banners');
      acceptCookieBanner();
    }
  });
    
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
