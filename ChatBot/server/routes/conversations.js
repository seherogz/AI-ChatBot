const express = require('express');
const { getConversations, deleteConversation } = require('../controllers/conversations');
const router = express.Router();

// Geçici protect middleware'i
const protect = (req, res, next) => {
    req.user = { id: '60d0fe4f5311236168a109ca' };
    next();
};

router.route('/')
    .get(protect, getConversations);

router.route('/:id')
    .delete(protect, deleteConversation);

module.exports = router; 