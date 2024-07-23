require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');

const coptons = require('../config/corsOptions');
const app = express();

app.use(cors(coptons)); //to enable cross origin resource sharingbetween backend and frontend



app.use(express.json()); //moddleware to parse the data coming from frontend and provide it for backend processes
//we use it at top so that it parses the data for all further api or they will have to parse seperately

const port = process.env.PORT;
// to connect the database
const connectDB = require('../config/dbConnect');
connectDB();
console.log(port)




//user api for user data getting entered , saved , login and register 
app.use('/api', require('../routes/UserRoutes'))


//article routes for articles to be written and published and seen by other users

app.use('/api/articles', require('../routes/articleRoutes'))


//to print once only once that DB is connected
mongoose.connection.once('open', () => {
    console.log("database connected");
    app.listen(port, () => console.log("server Started"));

})
mongoose.connection.on('error', (err) => {
    console.log('error while connecting DB', err);
})
