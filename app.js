const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

// Создаем и запускаем бота
const token = 'ВАШ_ТЕЛЕГРАМ_ТОКЕН';
const bot = new TelegramBot(token, {polling: true});

// Инициализация базы данных SQLite
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, username TEXT, visit_count INTEGER)");
});

const app = express();
app.use(bodyParser.json());

// Эндпоинт для хранения данных пользователя
app.post('/store_user_data', (req, res) => {
  const { user_id, username } = req.body;

  db.get("SELECT * FROM users WHERE user_id = ?", [user_id], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка сервера' });
      return;
    }

    if (row) {
      // Обновляем количество посещений, если пользователь уже существует
      const newVisitCount = row.visit_count + 1;
      db.run("UPDATE users SET visit_count = ? WHERE user_id = ?", [newVisitCount, user_id], (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Ошибка обновления данных' });
          return;
        }
        res.json({ visit_count: newVisitCount });
      });
    } else {
      // Добавляем нового пользователя
      db.run("INSERT INTO users (user_id, username, visit_count) VALUES (?, ?, ?)", [user_id, username, 1], (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Ошибка добавления данных' });
          return;
        }
        res.json({ visit_count: 1 });
      });
    }
  });
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
