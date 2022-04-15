const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDb = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const { errorHandler, notFound } = require('./middlewares/error.js');
const user = require('./routes/user');
const team = require('./routes/team');
const teammessage = require('./routes/teammessages');
const request = require('./routes/request');
const privatechat = require('./routes/privatechat');

dotenv.config({path : './config/.env'})

connectDb()

const app = express();

//Body Parser
app.use(express.json())

//CookieParser
app.use(cookieParser());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//Prevent xss attack
app.use(xss());

//Enable Cors
app.use(cors());

//Prevent http param pollution
app.use(hpp());

app.use('/tjkf/users', user);
app.use('/tjkf/teams', team);
app.use('/tjkf/teammessages', teammessage);
app.use('/tjkf/request', request);
app.use('/tjkf/privatechat', privatechat );

app.use(notFound);

app.use(errorHandler)

const PORT = process.env.PORT || 3005;

const server = app.listen(PORT, () =>console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

process.on('unhandledRejection',(err , promise) => {
    console.log(`Error ${err.message}`.red.bold)
    server.close(()=>process.exit(1));
})