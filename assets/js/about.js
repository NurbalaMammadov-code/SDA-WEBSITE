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






// Modal functions
function openModal(memberId) {
    const modal = document.getElementById('modal');
    const member = teamData[memberId] || additionalTeamData[memberId];
    
    if (member) {
        document.getElementById('modal-name').textContent = member.name;
        document.getElementById('modal-title').textContent = member.title;
        document.getElementById('modal-image').src = member.image;
        document.getElementById('modal-image').alt = member.name;
        document.getElementById('modal-description').innerHTML = member.description;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add animation class
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.animation = 'modalSlideOut 0.3s ease-in';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('modal');
        if (modal.style.display === 'block') {
            closeModal();
        }
    }
});

// Add slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
`;
document.head.appendChild(style);



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
      arrow.classList.toggle('rotated'); 
    }
  }
        

 // navbari gizlemek ucun olan modal kisim
  function openModal(memberId) {
  const modal = document.getElementById('modal');
  const member = teamData[memberId] || additionalTeamData[memberId];

  if (member) {
    document.getElementById('modal-name').textContent = member.name;
    document.getElementById('modal-title').textContent = member.title;
    document.getElementById('modal-image').src = member.image;
    document.getElementById('modal-image').alt = member.name;
    document.getElementById('modal-description').innerHTML = member.description;

    document.body.classList.add('modal-open');

    
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.dropdown-arrow').forEach(a => a.classList.remove('active'));

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
  }
}


function closeModal() {
  const modal = document.getElementById('modal');
  const modalContent = modal.querySelector('.modal-content');

  modalContent.style.animation = 'modalSlideOut 0.3s ease-in';

  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

   
    document.body.classList.remove('modal-open');
  }, 300);
}



// TEAM: Load more 
document.addEventListener('DOMContentLoaded', function () {
  const grid = document.querySelector('.team-grid');       
  const btn  = document.getElementById('team-load-btn');
  if (!grid || !btn) return;

  const txt  = btn.querySelector('.btn-text');
  const IS_PROD = /sdaconsulting\.az$/i.test(location.hostname);
  const CAP  = 12;     
  let visible = 4;     

  const getCards = () => Array.from(grid.querySelectorAll('.team-member'));

  function applyVisibility() {
    const cards = getCards();
    const MAX = Math.min(cards.length, CAP);

   
    if (!IS_PROD && cards.length === 0) {
      btn.style.display = '';
      if (txt) txt.textContent = 'Load more';
      btn.setAttribute('aria-expanded', 'false');
      return;
    }

    
    btn.style.display = (MAX <= 4) ? 'none' : '';

   
    if (visible > MAX) visible = MAX;

    
    cards.forEach((card, i) => card.classList.toggle('is-hidden', i >= visible));

    const expanded = (visible >= MAX);  
    if (txt) txt.textContent = expanded ? 'Load less' : 'Load more';
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

 
  const mo = new MutationObserver(applyVisibility);
  mo.observe(grid, { childList: true });

 
  applyVisibility();

  
  btn.addEventListener('click', () => {
    const cards = getCards();
    const MAX = Math.min(cards.length, CAP);
    if (MAX <= 4 && IS_PROD) return; 

    visible = (visible < MAX) ? MAX : 4; 
    applyVisibility();
  });

  
  document.addEventListener('team:rendered', applyVisibility);
});



