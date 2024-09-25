const express = require('express');
const csvParser = require('csv-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 7001;

app.use(cors());
app.use(express.json());

module.exports = server

let filedata = [];

//multer variable
const upload = multer({dest: __dirname + '/uploads/'})


//apis//

//Upload api
app.post('/uploadfile',upload.single('file'), (req, res) => {

    const filePath =  req.file.path;
    const fdata = [];

    fs.createReadStream(filePath).pipe(csvParser()).on('data',(row) =>{
        fdata.push(row);
    })
    .on('end', () =>{
        filedata = fdata;
        fs.unlinkSync(filePath);
        res.json({message: 'File has been uploaded successfully', data: filedata.length});
    })
    .on('error', (error)=> {
        res.status(500).json({message: 'Error: File process fail', error});
    });

});

//Show data
app.get('/showdata', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = page * limit;

    const getdata = filedata.slice(start,end)
    res.json({
        data: getdata,
        totalItems: filedata.length,
        currentPage: page,
        totalPage: Math.ceil(filedata.length / limit),        
    });

});

//Search/filter data 
app.get('/searchdata', (req, res) => {
    const searchQuery = req.query.q.toLowerCase();
    const filterData = filedata.filter(row => Object.values(row).some(val => val.toLowerCase().includes(searchQuery)));
    res.json({data: filterData});
});

app.listen(PORT,(err)=>{
    if(err)
        console.log('Error in server setup')
    console.log(`Server running on port: ${PORT}`);
});