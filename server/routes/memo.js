const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Database (you can use MariaDB or another DB)
let memos = [];

app.use(cors());
app.use(bodyParser.json());

app.get('/api/memos', (req, res) => {
  res.json(memos);
});

app.post('/api/memos', (req, res) => {
  const { name, message } = req.body;
  const newMemo = { id: memos.length + 1, name, message };
  memos.push(newMemo);
  res.status(201).json(newMemo);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
