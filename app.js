if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const router = require('./routes/index');
const errorHandler = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});