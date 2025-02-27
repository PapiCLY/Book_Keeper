import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import axios from 'axios';
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

db.connect()

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM booktable");
        const dbBooks = result.rows;
        
        console.log(dbBooks);
        res.render("index.ejs", {
            bookCover: null,
            data: null, // ✅ Ensure data exists even when no search has been made
            dbData: dbBooks,
            error: null
        });
    } catch (error) {
        console.log(error);
        res.render("index.ejs", {
            bookCover: null,
            data: null,
            dbData: [],
            error: "Error loading saved books."
        });
    }
});







app.post("/", async (req, res) => {
    try {
        const bookTitle = req.body.bookTitle;
        let newTitle = bookTitle.replace(/ /g, "+");

        // ✅ Fetch data from Open Library API
        const response = await axios.get(
            `https://openlibrary.org/search.json?q=${newTitle}`
        );
        const result = response.data;

        // ✅ Fetch saved books from the database
        const dbResult = await db.query("SELECT * FROM booktable");

        // ✅ If no books are found in the API, return only DB books
        // if (!result.docs.length) {
        //     return res.render("index.ejs", {
        //         bookCover: null,
        //         data: null,
        //         dbData: dbResult.rows,
        //         error: "No books found. Try a different title."
        //     });
        // }

        // ✅ Extract book details
        const book = result.docs[0];
        const bookImage = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null;

        console.log(book);
        console.log(bookImage);

        return res.render("index.ejs", {
            bookCover: bookImage,
            data: book,
            dbData: dbResult.rows, // ✅ Ensure DB books are always passed
            error: null
        });
    } catch (error) {
        console.error("Failed to retrieve data:", error.message);
        // ✅ Still fetch DB data on error
        const dbResult = await db.query("SELECT * FROM booktable");
        return res.render("index.ejs", {
            bookCover: null,
            data: null,
            dbData: dbResult.rows,
            error: "Failed to fetch book data. Please try again later."
        });
    }
});



app.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})