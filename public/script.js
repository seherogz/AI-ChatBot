const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const newChatButton = document.getElementById('new-chat-btn');
const chatList = document.getElementById('chat-list');
const sidebar = document.querySelector('.sidebar');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');

let currentChatId = null;
let chats = JSON.parse(localStorage.getItem('chats')) || [];
let chatToDelete = null;

// Modal işlemleri
function showDeleteModal(chatId) {
    chatToDelete = chatId;
    deleteModal.classList.add('active');
}

function hideDeleteModal() {
    deleteModal.classList.remove('active');
    chatToDelete = null;
}

// Sohbet silme işlemi
function deleteChat(chatId) {
    const chatIndex = chats.findIndex(chat => chat.id === chatId);
    if (chatIndex > -1) {
        chats.splice(chatIndex, 1);
        localStorage.setItem('chats', JSON.stringify(chats));
        
        // Eğer silinen sohbet aktif sohbetse, başka bir sohbete geç
        if (chatId === currentChatId) {
            if (chats.length > 0) {
                loadChat(chats[0].id);
            } else {
                createNewChat();
            }
        }
        
        loadChatHistory();
    }
}

// Event listeners for modal
cancelDeleteBtn.addEventListener('click', hideDeleteModal);
confirmDeleteBtn.addEventListener('click', () => {
    if (chatToDelete) {
        deleteChat(chatToDelete);
        hideDeleteModal();
    }
});

// Clicking outside modal closes it
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        hideDeleteModal();
    }
});

// Mobil görünümde sidebar toggle
function toggleSidebar() {
    if (window.innerWidth <= 576) {
        sidebar.classList.toggle('expanded');
    }
}

newChatButton.addEventListener('click', () => {
    createNewChat();
    toggleSidebar();
});

// Sohbet öğesine tıklandığında sidebar'ı kapat
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 576 && e.target.closest('.chat-item')) {
        toggleSidebar();
    }
});

// Sohbet geçmişini yükle
function loadChatHistory() {
    chatList.innerHTML = '';
    chats.forEach(chat => {
        const chatItem = createChatListItem(chat);
        chatList.appendChild(chatItem);
    });
}

// Yeni sohbet öğesi oluştur
function createChatListItem(chat) {
    const div = document.createElement('div');
    div.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'chat-item-content';
    contentDiv.textContent = chat.title || 'Yeni Sohbet';
    contentDiv.onclick = () => loadChat(chat.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-chat-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        showDeleteModal(chat.id);
    };
    
    div.appendChild(contentDiv);
    div.appendChild(deleteBtn);
    return div;
}

// Sohbeti yükle
function loadChat(chatId) {
    currentChatId = chatId;
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
        chatMessages.innerHTML = '';
        chat.messages.forEach(msg => addMessage(msg.content, msg.isUser));
        // Aktif sohbeti vurgula
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
            if (item.querySelector('.chat-item-content').textContent === chat.title) {
                item.classList.add('active');
            }
        });
    }
}

// Yeni sohbet oluştur
function createNewChat() {
    const chatId = Date.now().toString();
    const newChat = {
        id: chatId,
        title: 'Yeni Sohbet',
        messages: [{
            content: 'Merhaba! Size nasıl yardımcı olabilirim?',
            isUser: false
        }]
    };
    chats.unshift(newChat);
    localStorage.setItem('chats', JSON.stringify(chats));
    
    // Yeni sohbeti yükle
    loadChatHistory();
    loadChat(chatId);
}

// Mesaj ekle
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Mesajı sohbet geçmişine kaydet
    if (currentChatId) {
        const chat = chats.find(c => c.id === currentChatId);
        if (chat) {
            chat.messages.push({ content: message, isUser });
            // İlk kullanıcı mesajını sohbet başlığı yap
            if (isUser && chat.messages.length === 2) {
                chat.title = message;
                loadChatHistory();
            }
            localStorage.setItem('chats', JSON.stringify(chats));
        }
    }
}

// Loading animasyonu
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot loading';
    loadingDiv.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv;
}

// Mesaj gönder
async function sendMessage(message) {
    const loadingDiv = showLoading();
    
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        loadingDiv.remove();
        
        if (response.ok) {
            addMessage(data.response);
        } else {
            addMessage('Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.');
        }
    } catch (error) {
        loadingDiv.remove();
        addMessage('Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.');
        console.error('Error:', error);
    }
}

// Event listeners
sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        if (!currentChatId) {
            createNewChat();
        }
        addMessage(message, true);
        sendMessage(message);
        userInput.value = '';
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = userInput.value.trim();
        if (message) {
            if (!currentChatId) {
                createNewChat();
            }
            addMessage(message, true);
            sendMessage(message);
            userInput.value = '';
        }
    }
});

// Sayfa yüklendiğinde
window.addEventListener('load', () => {
    if (chats.length > 0) {
        loadChatHistory();
        loadChat(chats[0].id);
    } else {
        createNewChat();
    }
}); 