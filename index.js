const connect = require('./db');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());

connect();

app.use('/user',require('./routes/user'));
app.use('/book',require('./routes/book'));

app.listen(4500);
