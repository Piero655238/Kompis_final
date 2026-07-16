// Kompis Interactive App Simulator Script

document.addEventListener('DOMContentLoaded', () => {
    initCategoryChips();
});

/* Toggle Phone Frame / Full Screen Mode */
function togglePhoneFrame() {
    const frame = document.getElementById('phone-frame');
    const toggleBtn = document.getElementById('btn-toggle-frame');
    
    frame.classList.toggle('full-view');

    if (frame.classList.contains('full-view')) {
        toggleBtn.classList.remove('active');
        toggleBtn.querySelector('span').textContent = 'Vista Marco';
    } else {
        toggleBtn.classList.add('active');
        toggleBtn.querySelector('span').textContent = 'Vista Celular';
    }
}

/* Switch Active Navigation Tab */
function switchAppTab(tabId) {
    const views = document.querySelectorAll('.app-tab-view');
    const tabs = document.querySelectorAll('.nav-tab-item');

    views.forEach(view => view.classList.remove('active'));
    tabs.forEach(tab => tab.classList.remove('active'));

    const targetView = document.getElementById(tabId);
    if (targetView) {
        targetView.classList.add('active');
    }

    const activeNavBtn = document.querySelector(`.nav-tab-item[data-tab="${tabId}"]`);
    if (activeNavBtn) {
        activeNavBtn.classList.add('active');
    }
}

/* Filter Chips in Discover Feed */
function initCategoryChips() {
    const chips = document.querySelectorAll('.filter-scroll-chips .chip-btn');
    const groupCards = document.querySelectorAll('#discover-groups-list .app-group-card');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const selectedCat = chip.getAttribute('data-interest');

            groupCards.forEach(card => {
                if (selectedCat === 'all' || card.getAttribute('data-category') === selectedCat) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* Enter Spectator Mode with Specific Group Title */
function enterSpectatorMode(groupTitle) {
    const chatTitleElement = document.getElementById('current-chat-title');
    if (chatTitleElement && groupTitle) {
        chatTitleElement.textContent = groupTitle;
    }

    switchAppTab('view-spectator');
    showAppToast('Modo Espectador Activo', `Entraste a la sala de "${groupTitle}" sin compromiso.`);
}

/* Send User Message in Spectator Chat Simulator */
function sendUserChatMessage() {
    const inputField = document.getElementById('chat-input-field');
    const text = inputField.value.trim();
    if (!text) return;

    const chatContainer = document.getElementById('chat-messages-container');

    // Create user bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-sent-bubble';
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    userBubble.innerHTML = `
        <p>${escapeHTML(text)}</p>
        <span class="bubble-time">${currentTime}</span>
    `;

    chatContainer.appendChild(userBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    inputField.value = '';

    // Automated Friendly Host Reply Simulation
    setTimeout(() => {
        const hostReplies = [
            "¡Qué alegría leerte! 👋 Si te animas a acompañarnos el sábado, estaremos en la mesa larga del fondo.",
            "¡Hola! No te preocupes por nada, cada quien va a su ritmo y nadie se siente presionado. 😊",
            "¡Bienvenido/a al chat! Estamos hablando de juegos sencillos para romper el hielo tranquilos."
        ];
        const randomReply = hostReplies[Math.floor(Math.random() * hostReplies.length)];

        const hostBubble = document.createElement('div');
        hostBubble.className = 'chat-bubble host-bubble';
        hostBubble.innerHTML = `
            <div class="bubble-header">
                <strong>Sofía V. (Anfitriona)</strong>
                <span class="badge-host">Host Kompis</span>
            </div>
            <p>${randomReply}</p>
            <span class="bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        `;
        chatContainer.appendChild(hostBubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1200);
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendUserChatMessage();
    }
}

/* Confirm Attendance from Group Card or Spectator Mode */
function confirmAssistanceGroup(groupTitle) {
    addMeetupTicket(groupTitle || 'Reunión Kompis');
    showAppToast('¡Asistencia Confirmada! 🎉', `Te has unido a "${groupTitle}". Tu cupo está asegurado.`);
    switchAppTab('view-schedule');
}

function confirmCurrentSpectatorGroup() {
    const groupTitle = document.getElementById('current-chat-title').textContent;
    confirmAssistanceGroup(groupTitle);
}

/* Dynamically Add Confirmed Ticket to Mis Encuentros */
function addMeetupTicket(title) {
    const meetupsList = document.getElementById('my-meetups-list');
    const ticketId = 'ticket-' + Date.now();

    const ticketHtml = `
        <div class="meetup-ticket-card" id="${ticketId}">
            <div class="ticket-status-bar">
                <span class="status-badge-active"><i class="fa-solid fa-circle-check"></i> Asistencia Confirmada</span>
                <span class="ticket-date">Próximo Fin de Semana</span>
            </div>
            <h3 class="ticket-title">${escapeHTML(title)}</h3>
            <p class="ticket-place"><i class="fa-solid fa-location-dot"></i> Espresso & Coffee Bar • Coyoacán</p>

            <div class="ticket-details-box">
                <div class="detail-item">
                    <i class="fa-solid fa-users"></i>
                    <span>Grupo Reducido (4 Miembros)</span>
                </div>
                <div class="detail-item">
                    <i class="fa-solid fa-user-shield"></i>
                    <span>Anfitriona Verificada Kompis</span>
                </div>
            </div>

            <div class="ticket-actions">
                <button type="button" class="btn-ticket-icebreaker" onclick="generateNewIcebreaker()">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> <span>Ver Rompehielos</span>
                </button>
                <button type="button" class="btn-ticket-cancel" onclick="cancelMeetup('${ticketId}')">
                    <i class="fa-solid fa-xmark"></i> <span>Cancelar sin culpa</span>
                </button>
            </div>
        </div>
    `;

    meetupsList.insertAdjacentHTML('afterbegin', ticketHtml);
}

/* Cancel Meetup without guilt */
function cancelMeetup(ticketId) {
    const ticketElement = document.getElementById(ticketId);
    if (ticketElement) {
        ticketElement.style.opacity = '0';
        ticketElement.style.transform = 'scale(0.9)';
        setTimeout(() => {
            ticketElement.remove();
            showAppToast('Cancelado sin culpa 💙', 'Notificamos tu lugar libre. ¡Te esperamos en tu próximo momento!');
        }, 300);
    }
}

/* Icebreaker Question Generator */
const icebreakers = [
    "¿Cuál es el juego de mesa o videojuego de tu infancia que más recuerdas con cariño?",
    "Si pudieras vivir en la ciudad o universo de una serie o libro, ¿cuál elegirías?",
    "¿Cuál es tu tipo de café o bebida favorita para una tarde tranquila?",
    "¿Qué hobbie o pasatiempo descubriste recientemente y te encantó?",
    "¿Cuál ha sido la mejor película o animación que has visto en este año?"
];

function generateNewIcebreaker() {
    const display = document.getElementById('icebreaker-card-text');
    if (!display) return;

    const randomIndex = Math.floor(Math.random() * icebreakers.length);
    display.textContent = `"${icebreakers[randomIndex]}"`;
}

/* Simulated Notifications & Saved Profile */
function triggerNotificationSim() {
    showAppToast('Recordatorio Kompis 🔔', 'Sofía (Anfitriona) ha publicado una actualización sobre la mesa de café.');
}

function triggerSaveProfileSim() {
    showAppToast('¡Perfil Actualizado!', 'Tus preferencias de comodidad y hobbies han sido guardadas.');
}

/* App Toast Popup Mechanism */
function showAppToast(title, message) {
    const toast = document.getElementById('app-toast');
    const toastTitle = document.getElementById('app-toast-title');
    const toastMsg = document.getElementById('app-toast-msg');

    toastTitle.textContent = title;
    toastMsg.textContent = message;

    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3800);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
