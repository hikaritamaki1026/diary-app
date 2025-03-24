const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = './data.json';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// ホーム画面（記録入力）
app.get('/', (req, res) => {
  res.render('index');
});

// 記録保存（新バージョン）
app.post('/save', (req, res) => {
  const { wakeTime, sleepTime, breakfast, lunch, dinner, note } = req.body;
  const newEntry = {
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    wakeTime,
    sleepTime,
    meals: {
      breakfast,
      lunch,
      dinner
    },
    note
  };

  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  data.unshift(newEntry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.redirect('/history');
});

// 記録一覧
app.get('/history', (req, res) => {
  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  res.render('history', { logs: data });
});

app.listen(PORT, () => {
  console.log(`📘 Server running: http://localhost:${PORT}`);
});
