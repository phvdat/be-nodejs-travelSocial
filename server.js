const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./Routes/Index.route.js');
require('dotenv/config');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);
app.listen(process.env.PORT);
