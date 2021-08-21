const express = require('express');
const router  = express.Router();

const path = require('path');
const pdf = require('pdf-poppler');

const { fromPath } = require("pdf2pic");

const  {createWorker} = require('tesseract.js');
const worker = createWorker({
    logger:m=>console.log(m)
});

const  multer = require("multer"); 
const fs = require('fs');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temp/');
    },
    filename: function (req, file, cb) {
        const timeStamp = new Date;
        cb(null, `${timeStamp.getTime()+path.extname(file.originalname)}`);
    }
});

let upload = multer({ storage: storage });

router.post("/getText",upload.single("file"),async(req,res,next)=>{
    await augFile(req.file.path);
});

const tesseractify = (file)=>{
    fs.readFile(file,async(err,data)=>{
        if(err) return err;
        console.log(data);

        (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(data);
            console.log(text);
            await worker.terminate();
          })();

    })
}

const augFile = (file) =>{

    let opts = {
        format: 'jpeg',
        out_dir: './tempImages',
        out_prefix: path.basename(file, path.extname(file)),
        page: null
    }
     
    pdf.convert(file, opts).then(res=>{
        console.log(res)
    });

}

module.exports = router;
