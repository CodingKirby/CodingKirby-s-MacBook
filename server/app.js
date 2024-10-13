const express = require('express');
const bodyParser = require('body-parser');
const mailRoutes = require('./routes/mail');

const app = express();
app.use(bodyParser.json());
app.use('/api', mailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
