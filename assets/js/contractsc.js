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



  // succes modal kismi//
        document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const doneBtn = document.getElementById('done-btn');

    if (form && modal && doneBtn) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Formun normal gönderimini engelle
            modal.style.display = 'block'; // Modalı göster
        });

        doneBtn.addEventListener('click', function () {
            modal.style.display = 'none'; // Modalı kapat
            form.reset(); // Formu temizle (isteğe bağlı)
        });
    }
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