import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';
import 'dotenv/config';


const app = express();
const port= process.env.PORT || 3000


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//db
const db = new pg.Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})

// db.connect()

// app.get('/', async(req,res)=>{
//     try {
        
//         const result = await db.query("SELECT * FROM booktable")
//         console.log(result.rows)

//     } catch (error) {
//         console.log(error)
//     }
// })
async function testQuery() {
    try {
        await db.connect();
        console.log("✅ Connected to PostgreSQL");

        const result = await db.query("SELECT * FROM booktable");
        console.log("✅ Extracted Rows:", result.rows);

        await db.end();
    } catch (error) {
        console.error("❌ Database error:", error.message);
    }
}

testQuery();







app.post('/', async(req,res)=>{
    try {
        const bookTitle = req.body.bookTitle
        let newTitle  = bookTitle.replace(/ /g, '+')

       
        const response = await axios.get(
            `https://openlibrary.org/search.json?q=${newTitle}`
        )
        const result = response.data
        const books = result.docs[0]

        const bookImage = result.docs[0].cover_i
        // const title = result.docs[0].title
        // const authorName = result.docs[0].author_name[0]
        // const publishYear = result.docs[0].first_publish_year

        const bookCover = `https://covers.openlibrary.org/b/id/${bookImage}-L.jpg`

        // Book cover jpg --- console.log(bookCover.config.url)
       //console.log(result.docs[0])
        return res.render("index.ejs", {
            bookCover: bookCover,
            data: books
        })
        
        // console.log(result.docs[0])
        // Author name --- console.log(result.docs[0].author_name[0])
        // 
        // Book title --- console.log(result.docs[0].title)
        // Published year --- console.log(result.docs[0].first_publish_year)
       

    } catch (error) {
        console.error('Failed to retrieve data:', error.message)
    }
})

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})