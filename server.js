require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3-8b-instruct",
                messages: [
                    { role: "system", content: "Sen OKİDOKİ, Türkçe konuşan yardımcı bir yapay zeka asistanısın." },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        res.json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error('Hata:', error.message);
        res.status(500).json({ error: "Yanıt alınamadı. Lütfen tekrar deneyin." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment variables loaded:', {
        OPENAI_API_KEY_SET: !!process.env.API_KEY
    });
});
