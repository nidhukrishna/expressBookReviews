const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (isValid(username)) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully." });
  });

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      // Simulating an async fetch (could be a real API in other scenarios)
      const getBooks = () => {
        return new Promise((resolve) => {
          resolve(books);
        });
      };
  
      const bookList = await getBooks();
      res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (err) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    // Simulate async fetching with a Promise
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      });
    };
  
    try {
      const book = await getBookByISBN(isbn);
      res.status(200).json(book);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
  
    // Simulate async search
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
  
        for (let isbn in books) {
          if (books[isbn].author.toLowerCase() === author) {
            matchingBooks.push({ isbn, ...books[isbn] });
          }
        }
  
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found for this author.");
        }
      });
    };
  
    try {
      const result = await getBooksByAuthor(author);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  });
  
  
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();
  
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
  
        for (let isbn in books) {
          if (books[isbn].title.toLowerCase() === title) {
            matchingBooks.push({ isbn, ...books[isbn] });
          }
        }
  
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found with this title.");
        }
      });
    };
  
    try {
      const result = await getBooksByTitle(title);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  });
  
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.general = public_users;
