const Conversation = require('../models/Conversation');

// @desc    Get all conversations for a user
// @route   GET /api/conversations
// @access  Private
exports.getConversations = async (req, res) => {
    try {
        const userId = "60d0fe4f5311236168a109ca"; // Geçici kullanıcı ID'si
        const conversations = await Conversation.find({ participants: userId }).populate({
            path: 'messages',
            options: { sort: { 'createdAt': -1 }, limit: 1 } // Her sohbetin son mesajını al
        });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Delete a conversation
// @route   DELETE /api/conversations/:id
// @access  Private
exports.deleteConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({ msg: 'Conversation not found' });
        }
        
        // TODO: Add check to ensure user owns the conversation

        await conversation.deleteOne();

        res.json({ msg: 'Conversation removed' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}; 