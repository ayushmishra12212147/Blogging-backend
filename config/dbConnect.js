const mongoose=require('mongoose');


const connectDb= async () =>{
    try {
        console.log('connecting to database');
        //connecting to DataBase
        mongoose.connect(process.env.DATABASE_URI);

    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDb;