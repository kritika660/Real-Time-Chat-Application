const joinScreen = document.getElementById('join-screen');
const chatScreen = document.getElementById('chat-screen');
const joinForm = document.getElementById('join-form');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const roomNameDisplay = document.getElementById('room-name');
const mobileRoomNameDisplay = document.getElementById('mobile-room-name');
const usersList = document.getElementById('users');
const userCountDisplay = document.getElementById('user-count');
const leaveBtn = document.getElementById('leave-btn');
const mobileToggle = document.getElementById('mobile-toggle');
const sidebar = document.querySelector('.chat-sidebar');

let socket = null;
let currentUsername = '';

// Toggle sidebar on mobile
mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !mobileToggle.contains(e.target) && 
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

// Join Chat
joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const room = document.getElementById('room').value;

    if (!username || !room) return;

    currentUsername = username;

    // Connect to Socket.io server
    socket = io();

    // Join room event
    socket.emit('joinRoom', { username, room });

    // Switch screens
    joinScreen.classList.remove('active');
    chatScreen.classList.add('active');

    // Setup socket listeners after connection
    setupSocketListeners();
});

// Send Message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msgInput = document.getElementById('msg');
    const msg = msgInput.value.trim();

    if (!msg || !socket) return;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input and refocus
    msgInput.value = '';
    msgInput.focus();
});

// Leave Room
leaveBtn.addEventListener('click', () => {
    if (socket) {
        socket.disconnect();
    }
    
    // Switch screens back
    chatScreen.classList.remove('active');
    joinScreen.classList.add('active');
    
    // Clear chat messages
    chatMessages.innerHTML = '';
    
    // Reset variables
    socket = null;
    currentUsername = '';
    document.getElementById('username').value = '';
});

function setupSocketListeners() {
    // Get room and users
    socket.on('roomUsers', ({ room, users }) => {
        outputRoomName(room);
        outputUsers(users);
    });

    // Message from server
    socket.on('message', (message) => {
        outputMessage(message);

        // Scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

function outputMessage(message) {
    const div = document.createElement('div');
    
    if (message.type === 'system') {
        div.classList.add('message', 'system');
        div.innerHTML = `<p class="text">${message.text}</p>`;
    } else {
        div.classList.add('message');
        
        // Check if message is from the current user
        if (message.username === currentUsername) {
            div.classList.add('own');
        }
        
        div.innerHTML = `
            <div class="message-header">
                <span class="meta">${message.username}</span>
                <span class="time">${message.time}</span>
            </div>
            <p class="text">${escapeHtml(message.text)}</p>
        `;
    }
    
    chatMessages.appendChild(div);
}

function outputRoomName(room) {
    roomNameDisplay.innerText = room;
    mobileRoomNameDisplay.innerText = room;
}

function outputUsers(users) {
    userCountDisplay.innerText = users.length;
    usersList.innerHTML = users.map(user => `<li>${escapeHtml(user.username)}</li>`).join('');
}

// Helper function to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
