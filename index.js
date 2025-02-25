import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const port= process.env.PORT


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req,res)=>{
    res.render('index.ejs')
})


app.post('/', async(req,res)=>{
    try {
        const bookTitle = req.body.bookTitle
        let newTitle  = bookTitle.replace(/ /g, '+')

       
        const response = await axios.get(
            `https://openlibrary.org/search.json?q=${newTitle}`
        )
        const result = response.data

        const bookImage = result.docs[0].cover_i
        const title = result.docs[0].title
        const authorName = result.docs[0].author_name[0]
        const publishYear = result.docs[0].first_publish_year

        const bookCover = await axios.get(
            `https://covers.openlibrary.org/b/id/${bookImage}.jpg`
        )

        console.log(bookCover)
       
        // res.render("index.js", {
        //     bookCover: bookCover,
        //     bookTitle: title,
        //     authorName: authorName,
        //     publishYear: publishYear
        // })
        // console.log(result.docs[0])
        // console.log(result.docs[0].author_name[0])
        // console.log(result.docs[0].cover_i)
        // console.log(result.docs[0].title)
        // console.log(result.docs[0].first_publish_year)
       

    } catch (error) {
        console.error('Failed to retrieve data:', error.message)
    }
})

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})