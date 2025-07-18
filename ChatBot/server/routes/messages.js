const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messages');

// Auth middleware (koruma) - rotaları korumak için
// Şimdilik bir yer tutucu (placeholder) olacak, sonra JWT ile dolduracağız.
const protect = (req, res, next) => {
    // Geçici olarak test için sabit bir kullanıcı ID'si atıyoruz.
    // Gerçekte bu bilgi, token'dan çözümlenerek gelecek.
    req.user = { id: '60d0fe4f5311236168a109ca' }; // Örnek bir MongoDB ObjectId
    next();
};


const router = express.Router();

// Mesajları getir
// GET /api/messages/:id
router.get('/:id', protect, getMessages);

// Mesaj gönder
// POST /api/messages
router.post('/', protect, sendMessage);


module.exports = router; 