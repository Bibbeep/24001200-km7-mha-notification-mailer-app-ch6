require('./utils/instrument');
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const router = require('./routes/index');
const errorHandler = require('./utils/errorHandler');
const http = require('http');
const { Server } = require('socket.io');
const Sentry = require('@sentry/node');
const HttpRequestError = require('./utils/error');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);
Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

io.on('connection', (socket) => {
    socket.on('notification', (msg) => {
        io.emit('notification', msg);
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});