const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Eğer kullanıcı modeliniz olacaksa
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: []
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema); 