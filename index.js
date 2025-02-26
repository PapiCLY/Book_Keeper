import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port= process.env.PORT


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

db.connect()
console.log("📌 Connected to database:", process.env.PGDATABASE);




app.get('/', async (req, res) => {
    try {
        console.log("➡️ Route '/' triggered. Fetching books...");

        const result = await db.query("SELECT * FROM bookdata"); // Query DB
        
        console.log("✅ Raw Query Result:", result); // Log full object
        console.log("✅ Extracted Rows:", result.rows); // Log just the rows

        if (result.rows.length === 0) {
            console.warn("⚠️ No books found in database.");
        }

        res.render('index.ejs', { dbBooks: result.rows });
    } catch (error) {
        console.error("❌ Database error:", error.message);
        res.render('index.ejs', { dbBooks: [], error: "Failed to load books" });
    }
});





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