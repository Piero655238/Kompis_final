// Kompis Interactive Features & Animation Script

document.addEventListener('DOMContentLoaded', () => {
    initTagCloud();
    initSafetyModal();
    initNodeCanvas();
    initSmoothScroll();
    initExplorerFilters();
    initFAQAccordion();
});

/* Tag Cloud Selection for Interests */
function initTagCloud() {
    const tagButtons = document.querySelectorAll('#tag-cloud .tag-btn');
    const selectedInput = document.getElementById('selected-interests');
    const hintText = document.getElementById('interests-hint');
    const selectedSet = new Set();

    tagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const interest = btn.getAttribute('data-interest');
            
            if (selectedSet.has(interest)) {
                selectedSet.delete(interest);
                btn.classList.remove('active');
            } else {
                selectedSet.add(interest);
                btn.classList.add('active');
            }

            const selectedArray = Array.from(selectedSet);
            selectedInput.value = selectedArray.join(', ');

            if (selectedArray.length > 0) {
                hintText.textContent = `Intereses seleccionados: ${selectedArray.length}`;
                hintText.style.color = '#8338ec';
                hintText.style.fontWeight = '600';
            } else {
                hintText.textContent = 'Haz clic en tus pasiones favoritas';
                hintText.style.color = '#5e5274';
                hintText.style.fontWeight = 'normal';
            }
        });
    });
}

/* Handle Form Submission */
function handleFormSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name').value.trim();
    const emailInput = document.getElementById('email').value.trim();
    const interestsInput = document.getElementById('selected-interests').value;

    if (!interestsInput) {
        alert('Por favor, selecciona al menos un interés para personalizar tus recomendaciones.');
        return;
    }

    // Trigger Toast Notification
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-content strong').textContent = `¡Bienvenido(a), ${nameInput}!`;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 4500);

    // Reset Form
    event.target.reset();
    document.querySelectorAll('#tag-cloud .tag-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('selected-interests').value = '';
    document.getElementById('interests-hint').textContent = 'Haz clic en tus pasiones favoritas';
}

/* Safety Information Modal Controls */
function initSafetyModal() {
    const modal = document.getElementById('safety-modal');
    
    // Close modal when clicking background overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSafetyModal();
        }
    });

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeSafetyModal();
        }
    });
}

function openSafetyModal() {
    document.getElementById('safety-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSafetyModal() {
    document.getElementById('safety-modal').classList.remove('active');
    document.body.style.overflow = '';
}

/* Smooth Scrolling & Header backdrop adjustment */
function initSmoothScroll() {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.padding = '12px 0';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.padding = '18px 0';
            header.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.25)';
        }
    });
}

/* Canvas Animation for Background Connection Nodes (Violet & Yellow Nodes) */
function initNodeCanvas() {
    const canvas = document.getElementById('nodes-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const nodesCount = Math.floor(width / 35);
    const nodes = [];

    const colors = ['#8338ec', '#ffbe0b', '#a056ff', '#ffd043'];

    for (let i = 0; i < nodesCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(131, 56, 236, ${0.15 - dist / 120 * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Draw node points
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = node.color;
            ctx.fill();

            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* Group Explorer Interactive Category Filtering */
function initExplorerFilters() {
    const filterButtons = document.querySelectorAll('.explorer-filters .filter-btn');
    const groupCards = document.querySelectorAll('.groups-grid .group-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            groupCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
}

/* FAQ Accordion Expansion Toggle */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-accordion .faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close other items
            faqItems.forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* Scroll smoothly to registration form and pre-select specified interest tag */
function scrollToRegister(interestName) {
    const formSection = document.getElementById('registro');
    if (!formSection) return;

    formSection.scrollIntoView({ behavior: 'smooth' });

    if (interestName) {
        setTimeout(() => {
            const tagBtn = document.querySelector(`#tag-cloud .tag-btn[data-interest="${interestName}"]`);
            if (tagBtn && !tagBtn.classList.contains('active')) {
                tagBtn.click();
            }
        }, 400);
    }
}

