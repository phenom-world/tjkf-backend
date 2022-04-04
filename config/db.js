const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({path : './.env'})

const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONG0_URI,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    console.log(`MongoDB is connected to ${conn.connection.host}`.green.underline.bold)
}

module.exports = connectDb