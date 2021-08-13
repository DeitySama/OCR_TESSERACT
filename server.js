const express = require('express');
const app = express();
const color = require('colors');
const morgan = require('morgan');
const getText = require('./routes/getText');
const path = require('path');

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(morgan('dev'));

//Mount Routers
app.use('/api/v1',getText);

//Route to access uploaded files
app.use('/temp', express.static(path.join(__dirname, '/temp')));

const PORT = 5000||process.env.PORT;
const server = app.listen(PORT,console.log(`Tesseract is about to go down on PORT:${PORT}`.green.bold ));


process.on('unhandledRejection',(err,promise)=>{
    console.log(`${err}`.black.bgRed);
});
