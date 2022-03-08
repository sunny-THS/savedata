const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();

const storage = require('../routes/Storage');
const auth = require('../routes/Auth');

const port = process.env.PORT || 5002;

const app = express();

// connect to mongodb
mongoose.connect(process.env.SUNNY_DRIVE_MONGOURI, () => console.log('Connected to mongodb'))

app.use(express.static('client'))
app.use(express.json({ limit: '3mb' }));
// app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

// routes
app.use('/storage', storage);
app.use('/auth', auth);

app.use((req, res, next) => {
    const err = new Error('not found');
    res.status(404);
    next(err);
});

app.use((err, req, res, next) => {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message
    });
});

app.listen(port, () => console.log("Listening on port 5002"));