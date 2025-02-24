import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import 'dotenv/config';

const app = express();
const port= process.env.PORT


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req,res)=>{
    res.render('index.ejs')
})


app.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})