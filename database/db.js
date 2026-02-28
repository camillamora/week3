const mongoose = require('mongoose');


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Mongodb connected')
    } catch(error){
        console.error("DB connection failes", error);
        process.exit(l);
    }
}

module.exports = connectDB;