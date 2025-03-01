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
        const result = await db.query("SELECT * FROM booktable ORDER BY id DESC");
        const dbBooks = result.rows;
        
       
        res.render("index.ejs", {
            //Ensure data exists even when no search has been made!!!
            bookCover: null,
            data: null, 
            dbData: dbBooks,
            error: null,
            sortByYear: null,
            sortByAuthor: null
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

        //Open Library API
        const response = await axios.get(
            `https://openlibrary.org/search.json?q=${newTitle}`
        );
        const result = response.data;

        //Fetch saved books from the database
        const dbResult = await db.query("SELECT * FROM booktable");

        //book details
        const book = result.docs[0];
        const bookImage = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null;

        
       

        return res.render("index.ejs", {
            bookCover: bookImage,
            data: book,
            dbData: dbResult.rows,
            error: null,
            sortByYear: null,
            sortByAuthor: null
        });
    } catch (error) {
        console.error("Failed to retrieve data:", error.message);

        //Still fetch DB data on error
        const dbResult = await db.query("SELECT * FROM booktable");
        return res.render("index.ejs", {
            bookCover: null,
            data: null,
            dbData: dbResult.rows,
            error: "Failed to fetch book data. Please try again later."
        });
    }
});

app.post("/add", async (req, res) => {
    const { title, author, published, coverimg } = req.body;

    const publishedYear = published ? parseInt(published) || null : null; //for those books without a published year
    try {
        await db.query(
            "INSERT INTO booktable (title, author, published, coverimg) VALUES ($1, $2, $3, $4)",
            [title, author, publishedYear, coverimg]
        );
        

        res.redirect("/");
    } catch (error) {
        console.error("Error adding book:", error.message);
        res.status(500).send("Failed to add book");
    }
});

app.post('/delete', async(req,res)=>{
    const id = req.body.deleteBook

    try {
        await db.query("DELETE FROM booktable WHERE id = $1", [id]);
        res.redirect('/')    
    } catch (error) {
        console.error("Error deleting book:", error.message);
        res.status(500).send("Failed to remove book");
    }
})

app.post("/year", async(req, res)=>{


    try {
        const results = await db.query("SELECT * FROM booktable ORDER BY published")
        
        res.render('index.ejs', {
            dbData: results.rows,
            sortByYear: true,
            sortByAuthor: null,
            error: null,
            data: null 
        })
    } catch (error) {
        console.error("Error sorting books:", error.message);
        res.status(500).send("Failed to sort book");

        const results = await db.query("SELECT * FROM booktable ORDER BY published")

        res.render('index.ejs', {
            sortResult: results.rows,
            sortByYear: true,
            error: null 
        })
    }
})

app.post("/author", async(req, res)=>{
    try {

        const result = await db.query("SELECT * FROM booktable ORDER BY author")

         res.render('index.ejs', {
            dbData: result.rows,
            sortByAuthor: true,
            sortByYear: null,
            error: null,
            data: null 
        })
    } catch (error) {
        console.error("Error sorting books:", error.message);
        res.status(500).send(error.message);


        const results = await db.query("SELECT * FROM booktable ORDER BY published")

        res.render('index.ejs', {
            sortResult: results.rows,
            sortByYear: true,
            error: null,
            data: null,
            dbData: null 
        })
    }
})


app.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})