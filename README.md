# AI-Chatbot

## Proje Açıklaması

Bu proje, sıkça sorulan sorulara (FAQ) yanıt veren veya OpenAI API üzerinden kullanıcılarla sohbet edebilen bir yapay zeka chatbot uygulamasıdır. Kullanıcılar, web arayüzü üzerinden sorularını yazabilir ve anında yanıt alabilirler.

## Kullanılan Teknolojiler

- **Node.js**: Sunucu tarafı geliştirme ve API entegrasyonu için.
- **HTML/CSS**: Web arayüzü tasarımı için.
- **OpenAI API**: Yapay zeka sohbet ve yanıtlar için.

## Özellikler

- Kullanıcı dostu web arayüzü.
- OpenAI API ile entegre sohbet özelliği.
- Sıkça Sorulan Sorular (FAQ) modülü.
- Gerçek zamanlı yanıtlar.

## Fonksiyonel Gereksinimler

- Kullanıcı, web arayüzünden metin girerek mesaj gönderebilmelidir.
- Chatbot, kullanıcıdan gelen soruya anlamlı yanıtlar verebilmelidir.
- Sohbet ekranı, geçmiş mesajları gösterebilmelidir.
- Sıkça sorulan sorular için özel yanıtlar sunulabilir (Opsiyonel).

## Teknik Gereksinimler

- Web sunucusu Node.js ile çalışmalıdır.
- OpenAI API ile entegre çalışarak gerçek zamanlı yanıt üretmelidir.
- Arayüz HTML/CSS ile oluşturulmalıdır.
- API anahtarı .env dosyasında gizli tutulmalıdır.

## Kurulum ve Kullanım

1. **Projeyi Klonlayın**
   ```bash
   git clone https://github.com/seherogz/AI-ChatBot.git
   cd AI-ChatBot
   ```

2. **Bağımlılıkları Yükleyin**
   ```bash
   npm install
   ```

3. **OpenAI API Anahtarını Ekleyin**
   - `config.js` veya `.env` dosyasına OpenAI API anahtarınızı ekleyin.

4. **Uygulamayı Başlatın**
   ```bash
   npm start
   ```