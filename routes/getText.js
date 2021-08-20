const express = require('express');
const router  = express.Router();

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
        cb(null, file.originalname);
    }
});

let upload = multer({ storage: storage });

router.post("/getText",upload.single("file"),async(req,res,next)=>{
    pdf2pic(req.file.path)
});

const tesseractify = (file)=>{
    fs.readFile(req.file.path,async(err,data)=>{
        if(err) return err;
        console.log(data);

        (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(data);
            res.json({
                msg:'SUCCESS',
                text
            })
            await worker.terminate();
          })();

    })
}

const pdf2pic = (path) =>{
    const options = {
        density: 100,
        saveFilename: "untitled",
        savePath: "./tempImages",
        format: "png",
        width: 600,
        height: 600
      };
      const storeAsImage = fromPath(path, options);
      const pageToConvertAsImage = 1;
      
      storeAsImage(pageToConvertAsImage).then((resolve) => {
        console.log("PDF has Been converted to images");
      
        return resolve;
      });
}

module.exports = router;
