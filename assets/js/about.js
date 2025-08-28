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


// Team member data
const teamData = {
    sabina: {
        name: "Sabina Gazizade",
        title: "Founder",
        image: "/assets/images/image 1.png",
        description: `
            <p>The idea of SDA Consulting emerged from over 17 years of experience in real estate development, retail management, and operational leadership. Sabina specializes in driving growth, optimizing operations, and delivering exceptional results across diverse sectors.</p>
            
            <p>Her career highlights include leading sales management for the prestigious Port Baku Residence, managing Pasha Malls Group for over four years, and spearheading operations for six shopping malls across Baku and Ganja.</p>
            
            <p>Sabina has overseen every stage of mall development, from concept to operation-design, layout, brand mix, marketing, leasing, and operational excellence, working with notable successes like Ganjlik Mall, Ganja Mall, Amburan Mall, Deniz Mall, and the revitalization of Port Baku Mall and Mall 28.</p>
            
            <p>Additionally, as Managing Director of Blue Planet Distribution LLC, she managed 24 stores representing 9 international brands across 12 multi-brand chains, leading a team of over 400 employees and achieving financial and operational excellence.</p>
        `
    },
    yelena1: {
        name: "Yelena İsmayilova",
        title: "Head of Leasing and Brokerage",
        image: "/assets/images/image 9.png",
        description: `
            <p>Yelena brings extensive experience in commercial real estate leasing and brokerage services. She has successfully managed complex leasing negotiations and has been instrumental in securing high-profile tenants for major retail developments.</p>
            
            <p>Her expertise spans across retail, office, and mixed-use developments, with a strong track record of maximizing property values through strategic leasing approaches.</p>
            
            <p>Yelena's deep understanding of market dynamics and tenant requirements makes her an invaluable asset in developing successful leasing strategies that benefit both property owners and tenants.</p>
        `
    },
    nurana: {
        name: "Nurana İsgandarova",
        title: "Marketing Manager",
        image: "/assets/images/image 7.png",
        description: `
            <p>Nurana is a creative marketing professional with a passion for developing innovative campaigns that drive engagement and results. She specializes in digital marketing, brand development, and customer acquisition strategies.</p>
            
            <p>Her experience includes managing marketing campaigns for major retail developments, creating compelling brand narratives, and implementing data-driven marketing strategies that deliver measurable results.</p>
            
            <p>Nurana's expertise in both traditional and digital marketing channels ensures comprehensive campaign coverage and maximum reach for all client initiatives.</p>
        `
    },
    yelena2: {
        name: "Yelena İsmayilova",
        title: "Head of Leasing and Brokerage",
        image: "/assets/images/image 8.png",
        description: `
            <p>With years of experience in the commercial real estate sector, Yelena has developed a comprehensive understanding of market trends and client needs. Her strategic approach to leasing has resulted in successful partnerships with numerous international and local brands.</p>
            
            <p>She excels in market analysis, tenant relationship management, and creating customized leasing solutions that align with both tenant requirements and property owner objectives.</p>
            
            <p>Yelena's professional network and industry knowledge make her a trusted advisor for all leasing and brokerage matters.</p>
        `
    }
};

// Additional team members for load more functionality
const additionalTeamData = {
    member5: {
        name: "Aysel Mammadova",
        title: "Property Manager",
        image: "/assets/images/image 1.png",
        description: `
            <p>Aysel is an experienced property manager with expertise in commercial real estate operations. She ensures optimal property performance through strategic management and tenant relations.</p>
            
            <p>Her background includes managing diverse property portfolios and implementing efficient operational systems that maximize property value and tenant satisfaction.</p>
        `
    },
    member6: {
        name: "Rashad Aliyev",
        title: "Investment Advisor",
        image: "/assets/images/image 9.png",
        description: `
            <p>Rashad specializes in real estate investment strategies and market analysis. He provides comprehensive investment advice to help clients make informed decisions.</p>
            
            <p>His expertise includes portfolio optimization, risk assessment, and identifying high-potential investment opportunities in the commercial real estate sector.</p>
        `
    },
    member7: {
        name: "Leyla Hasanova",
        title: "Development Coordinator",
        image: "/assets/images/image 7.png",
        description: `
            <p>Leyla coordinates development projects from conception to completion. She ensures projects are delivered on time and within budget while maintaining quality standards.</p>
            
            <p>Her experience includes managing complex development timelines, coordinating with multiple stakeholders, and overseeing project execution.</p>
        `
    },
    member8: {
        name: "Elvin Huseynov",
        title: "Financial Analyst",
        image: "/assets/images/image 8.png",
        description: `
            <p>Elvin provides detailed financial analysis and modeling for real estate investments. He helps clients understand the financial implications of their property decisions.</p>
            
            <p>His expertise includes cash flow analysis, ROI calculations, and comprehensive financial reporting for commercial real estate transactions.</p>
        `
    },
    member9: {
        name: "Gulnar Ibrahimova",
        title: "Client Relations Manager",
        image: "/assets/images/image 1.png",
        description: `
            <p>Gulnar manages client relationships and ensures exceptional service delivery. She works closely with clients to understand their needs and provide tailored solutions.</p>
            
            <p>Her focus on client satisfaction and long-term relationship building has resulted in high client retention and referral rates.</p>
        `
    },
    member10: {
        name: "Farid Mammadov",
        title: "Legal Advisor",
        image: "/assets/images/image 9.png",
        description: `
            <p>Farid provides legal expertise for real estate transactions and compliance matters. He ensures all deals are structured properly and meet regulatory requirements.</p>
            
            <p>His experience includes contract negotiation, due diligence, and regulatory compliance across various commercial real estate transactions.</p>
        `
    },
    member11: {
        name: "Sevda Qasimova",
        title: "Market Research Analyst",
        image: "/assets/images/image 7.png",
        description: `
            <p>Sevda conducts comprehensive market research and analysis to support strategic decision-making. She provides insights into market trends and opportunities.</p>
            
            <p>Her research capabilities include market forecasting, competitive analysis, and identifying emerging trends in the commercial real estate sector.</p>
        `
    },
    member12: {
        name: "Tural Rzayev",
        title: "Operations Manager",
        image: "/assets/images/image 8.png",
        description: `
            <p>Tural oversees daily operations and ensures efficient workflow across all departments. He implements operational improvements and manages team performance.</p>
            
            <p>His leadership ensures smooth operations and continuous improvement in service delivery and internal processes.</p>
        `
    }
};

// Load more functionality
let currentlyVisible = 4;
const totalMembers = 12;
const membersPerLoad = 4;

function toggleLoadMore() {
    const teamGrid = document.querySelector('.team-grid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const loadMoreText = loadMoreBtn.querySelector('span') || loadMoreBtn.childNodes[0];
    const loadMoreSvg = loadMoreBtn.querySelector('svg');
    
    if (currentlyVisible < totalMembers) {
        // Load more members
        const membersToAdd = Math.min(membersPerLoad, totalMembers - currentlyVisible);
        const additionalMembers = Object.keys(additionalTeamData).slice(currentlyVisible - 4, currentlyVisible - 4 + membersToAdd);
        
        additionalMembers.forEach((memberKey, index) => {
            const member = additionalTeamData[memberKey];
            const memberElement = createMemberElement(memberKey, member);
            teamGrid.appendChild(memberElement);
        });
        
        currentlyVisible += membersToAdd;
        
        if (currentlyVisible >= totalMembers) {
            // Change to "Load less"
            loadMoreText.textContent = 'Load less ';
            loadMoreSvg.style.transform = 'rotate(180deg)';
        }
    } else {
        // Load less - remove additional members
        const membersToRemove = teamGrid.querySelectorAll('.team-member');
        for (let i = membersToRemove.length - 1; i >= 4; i--) {
            membersToRemove[i].remove();
        }
        
        currentlyVisible = 4;
        loadMoreText.textContent = 'Load more ';
        loadMoreSvg.style.transform = 'rotate(0deg)';
    }
}

function createMemberElement(memberKey, member) {
    const memberDiv = document.createElement('div');
    memberDiv.className = 'team-member';
    
    memberDiv.innerHTML = `
        <div class="member-image-container">
            <img src="${member.image}" alt="${member.name}" class="member-image">
            <button class="add-button" onclick="openModal('${memberKey}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1V17M1 9H17" stroke="#00B2BA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="member-info">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-title">${member.title}</p>
        </div>
    `;
    
    return memberDiv;
}

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
      arrow.classList.toggle('rotated'); // veya sadece aria-expanded ile bırak
    }
  }
        




