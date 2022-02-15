import express from "express";
import BookService from "./public/bookService.js";

const router = express.Router();
const bookService = new BookService();

// ===== VIEWS ===== //

router.get("/", (req, res, next) => {
    res.render("index", {books: bookService.getAllBooks()});
    next();
});
router.get("/book/:id", (req, res, next) => {
    let book = bookService.getBookByID(parseInt(req.params.id), 10);
    if(book)
        return res.render('book', {book: book});
    next();
});

// ===== GET BOOKS TYPED ===== //

router.get("/books/:type", (req, res, next) => {
    let type = req.params.type;
    let books;
    switch(type){
        case "expired":
            books = bookService.getAllExpiredBooks();
            break;
        case "available":
            books = bookService.getAllAvailableBooks();
            break;
        case "all":
        default:
            books = bookService.getAllBooks();
            break;
    }
    res.end(JSON.stringify({books: books}));
    next();
});

// ===== ADD BOOK ===== //

router.post("/book", (req, res) => {
    if (req.body.name !== '' && req.body.author !== '' && !isNaN(parseInt(req.body.year)))
        res.end(JSON.stringify(bookService.addBook({
            name: req.body.name,
            author: req.body.author,
            year: req.body.year
        })));
    else {
        res.status(400);
        res.end('Incorrect book data');
    }
});

// ===== DELETE BOOK ===== //

router.delete("/book/:id", (req, res) => {
    res.end(JSON.stringify(bookService.deleteBookByID(parseInt(req.params.id, 10))));
});

// ===== EDIT BOOK DATA ===== //

router.put('/book/data/:id', (req, res) => {
    let book = bookService.getBookByID(parseInt(req.params.id, 10));
    if (req.body.name !== '' && req.body.author !== '' && !isNaN(parseInt(req.body.year))) {
        book.name = req.body.name;
        book.author = req.body.author;
        book.year = parseInt(req.body.year, 10);
        bookService.updateBook(book);
        res.end(JSON.stringify(book));
    } else {
        res.status(400);
        res.end('Incorrect book data');
    }
});

// ===== EDIT READER DATA ===== //

router.put('/book/reader/:id', (req, res) => {
    let book = bookService.getBookByID(parseInt(req.params.id, 10));
    if(book.reader !== ''){
        book.reader = '';
        book.bookingDate = 0;
    } else {
        book.reader = req.body.reader;
        book.bookingDate = req.body.bookingDate;
    }
    bookService.updateBook(book);
    res.end(JSON.stringify(book));
});

export default router;
