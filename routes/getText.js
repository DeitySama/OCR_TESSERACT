const express = require('express');
const router  = express.Router();
const {getText} = require('../controllers/getText.js');
const  multer = require("multer"); 

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temp/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

let upload = multer({ storage: storage });

router.post("/getText",upload.single("file"),async(req,res,next)=>{
    
    console.log(req.file);
    res.status(200).json({
        msg:"Fire ooooooooooooo"
    })
});

module.exports = router;
