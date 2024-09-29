const express = require('express');
const axios = require('axios');  // Для отправки запросов к внешним доменам
const app = express();
const port = 3000;

app.get('/proxy', async (req, res) => {
    const domain = req.query.domain;
    if (!domain) {
        return res.status(400).send({ error: 'Домен не указан' });
    }

    try {
        const response = await axios.get(`http://${domain}`);
        const cookies = response.headers['set-cookie'];  // Получаем cookies из заголовков

        res.json({
            data: response.data,
            cookies: cookies ? cookies.map(cookie => ({
                name: cookie.split('=')[0],
                value: cookie.split(';')[0].split('=')[1]
            })) : []
        });
    } catch (error) {
        res.status(500).send({ error: 'Ошибка при запросе к домену' });
    }
});

app.get('/api/domains', (req, res) => {
    const domains = ["kra6.cc", "anotherdomain.com"];  // Твои домены
    res.json(domains);
});

app.listen(port, () => {
    console.log(`Прокси-сервер запущен на порту ${port}`);
});