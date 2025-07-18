const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User'); // User modelini buraya ekliyoruz
const axios = require('axios');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
    try {
        const { message, recipientId } = req.body;
        const senderId = "60d0fe4f5311236168a109ca"; // Geçici kullanıcı ID'si
        const aiUserId = "60d0fe4f5311236168a109cb"; // Yapay zeka için sabit bir ID

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recipientId],
            });
        }

        // 1. Kullanıcının mesajını kaydet
        const userMessage = new Message({
            sender: senderId,
            recipient: recipientId,
            message,
        });
        conversation.messages.push(userMessage._id);

        await Promise.all([conversation.save(), userMessage.save()]);
        
        // 2. Mesajı AI'a gönder
        const aiResponse = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mistral-7b-instruct", // Geçerli bir model adı ile değiştirildi
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                },
            }
        );

        const aiMessageContent = aiResponse.data.choices[0].message.content;

        // 3. AI'ın cevabını kaydet
        const aiMessage = new Message({
            sender: recipientId, // AI gönderici
            recipient: senderId, // Kullanıcı alıcı
            message: aiMessageContent,
        });

        conversation.messages.push(aiMessage._id);
        await Promise.all([conversation.save(), aiMessage.save()]);

        // Kullanıcıya hem kendi mesajını hem de AI'ın cevabını döndürebiliriz
        // Şimdilik sadece AI'nın mesajını döndürelim
        res.status(201).json(aiMessage);

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        if (error.response) {
            console.error("AI API Error:", error.response.data);
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:id
// @access  Private
exports.getMessages = async (req, res, next) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = "60d0fe4f5311236168a109ca"; // Geçici kullanıcı ID'si

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}; 

// @desc    Update a message
// @route   PUT /api/messages/:id
// @access  Private
exports.updateMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        let msg = await Message.findById(req.params.id);

        if (!msg) {
            return res.status(404).json({ error: "Message not found" });
        }

        // TODO: Add check to ensure user owns the message
        // if (msg.sender.toString() !== req.user.id) {
        //     return res.status(401).json({ error: "User not authorized" });
        // }

        msg = await Message.findByIdAndUpdate(req.params.id, { message }, { new: true });

        res.status(200).json(msg);
    } catch (error) {
        console.log("Error in updateMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
    try {
        const msg = await Message.findById(req.params.id);

        if (!msg) {
            return res.status(404).json({ error: "Message not found" });
        }

        // TODO: Add check to ensure user owns the message

        await msg.deleteOne();

        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in deleteMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}; 