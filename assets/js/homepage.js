let activeDropdown = null;
        let mobileMenuOpen = false;

        function toggleDropdown(dropdownId) {
            const dropdown = document.getElementById(dropdownId + '-dropdown');
            const arrow = document.getElementById(dropdownId + '-arrow');
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu.id !== dropdownId + '-dropdown') {
                    menu.classList.remove('active'); 
                }
            });
            
            document.querySelectorAll('.dropdown-arrow').forEach(arr => {
                if (arr.id !== dropdownId + '-arrow') {
                    arr.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            if (dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                arrow.classList.remove('active');
                activeDropdown = null;
            } else {
                dropdown.classList.add('active');
                arrow.classList.add('active');
                activeDropdown = dropdownId;
            }
        }

        function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobile-menu');
            const hamburgerIcon = document.getElementById('hamburger-icon');
            
            mobileMenuOpen = !mobileMenuOpen;
            
            if (mobileMenuOpen) {
                mobileMenu.classList.add('active');
                hamburgerIcon.innerHTML = `
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                `;
            } else {
                mobileMenu.classList.remove('active');
                hamburgerIcon.innerHTML = `
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                `;
            }
        }

        function toggleMobileDropdown(dropdownId) {
            const dropdown = document.getElementById(dropdownId + '-dropdown');
            const arrow = document.getElementById(dropdownId + '-arrow');
            
            if (dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                arrow.classList.remove('active');
            } else {
                dropdown.classList.add('active');
                arrow.classList.add('active');
            }
        }

        function setLanguage(language) {
            document.getElementById('selected-language').textContent = language;
            toggleDropdown('language');
        }

        function setMobileLanguage(language) {
            document.getElementById('mobile-selected-language').textContent = language;
            toggleDropdown('mobile-language');
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-item') && !e.target.closest('.language-dropdown')) {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('active');
                });
                document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
                    arrow.classList.remove('active');
                });
                activeDropdown = null;
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileMenuOpen) {
                toggleMobileMenu();
            }
        });

         function toggleAccordion(element) {
    const accordionItem = element.parentElement;
    const isActive = accordionItem.classList.contains('active');
    
    // Close all accordion items
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        accordionItem.classList.add('active');
    }
}

// Initialize - hepsi kapalı başlasın
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.accordion-item').forEach(item => {
    item.classList.remove('active');
  });
});

 function toggleMobileDropdown(key) {
    const dropdown = document.getElementById(`${key}-dropdown`);
    const arrow    = document.getElementById(`${key}-arrow`);
    const toggle   = dropdown?.previousElementSibling; // buton

    dropdown.classList.toggle('active');

    if (toggle) {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', (!expanded).toString());
    }

    if (arrow) {
      arrow.classList.toggle('rotated'); // veya sadece aria-expanded ile bırak
    }
  }


   (function CookieBanner(){
    var root = document.getElementById('cookie-consent');
    // Banner her zaman görünsün
    root.hidden = false;

    function hideOnly() { root.hidden = true; }

    document.getElementById('cc-accept')?.addEventListener('click', hideOnly);
    document.getElementById('cc-reject')?.addEventListener('click', hideOnly);

    // ESC tuşuyla kapatma
    root.addEventListener('keydown', function(e){
      if (e.key === 'Escape') root.hidden = true;
    });
  })();



  (function () {
    const navbar = document.querySelector('.navbar');
    const about  = document.querySelector('#about');
    if (!navbar || !about) return;

    function getTriggerY() {
      const navHeight = navbar.getBoundingClientRect().height;
      // About'un sayfa üstünden mutlak konumu:
      const aboutTop = about.getBoundingClientRect().top + window.scrollY;
      // Tetik: About üst kenarı navbarın altına geldiğinde
      return aboutTop - navHeight;
    }

    let triggerY = 0;

    function updateTrigger() {
      triggerY = Math.max(0, Math.floor(getTriggerY()));
      onScroll(); // boyut değişince sınıfı hemen doğru hale getir
    }

    function onScroll() {
      if (window.scrollY >= triggerY) {
        navbar.classList.add('on-about');
      } else {
        navbar.classList.remove('on-about');
      }
    }

    // ilk hesaplama + olaylar
    updateTrigger();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateTrigger);
  })();


