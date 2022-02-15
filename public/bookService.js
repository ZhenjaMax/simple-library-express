import fs from "fs";
import path from "path";

export default class BookService{
    constructor() { this.dataPath = path.join(path.resolve(), "/sources/books.json") }

    getBookStatus(book){
        if(book.bookingDate === 0)
            return 0;
        if(book.bookingDate >= Date.now())
            return 1;
        return 2;
    }

    getAllBooks(){ return JSON.parse(fs.readFileSync(this.dataPath)) || [] }
    getAllAvailableBooks(){ return this.getAllBooks().filter(x =>  (this.getBookStatus(x) === 0)) }
    getAllExpiredBooks(){ return this.getAllBooks().filter(x => (this.getBookStatus(x) === 2)) }
    getBookByID(id){ return this.getAllBooks().filter(x => (x.id===id))[0] }

    saveBooks(books){
        books = books.sort((a, b) => (a.id-b.id));
        fs.writeFileSync(this.dataPath, JSON.stringify(books))
    }

    getNextID(){
        let id = 1;
        let books = this.getAllBooks();
        while(true){
            if(!books.filter(x => (x.id === id)).length)
                return id;
            id++;
        }
    }

    addBook(bookRaw){
        bookRaw.id = this.getNextID();
        bookRaw.reader = "";
        bookRaw.bookingDate = 0;

        let books = this.getAllBooks();
        books.push(bookRaw);
        this.saveBooks(books);
        return bookRaw;
    }

    deleteBookByID(id){
        let book = this.getBookByID(id);
        if(!book)
            return undefined;
        let books = this.getAllBooks();
        books.splice(books.findIndex(x => (x.id === id)), 1);
        this.saveBooks(books);
        return book;
    }

    updateBook(book){
        if(typeof book.bookingDate === 'string')
            book.bookingDate = Date.parse(book.bookingDate);
        let books = this.getAllBooks();
        books[books.findIndex(x => (x.id === book.id))] = book;
        this.saveBooks(books);
        return book;
    }
}
