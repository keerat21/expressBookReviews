const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const usern = req.query.username;
  const pass = req.query.password;
  
  if(usern =="" || pass=="")
    return res.status(200).json({message: "Wrong Credentials; Enter user and password"});
if(!users.some(user => user.username === usern))
    {   
        users.push({ username: usern, password: pass });
        return res.status(200).json({message: "User added"});
    }
else
  return res.status(200).json({message: "Already user exists"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
//  get books from booksdb.js 
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  bn = JSON.stringify(books[isbn]);
  bn2 = books[isbn];
//   books.filter((book) => {book.isbn})
  return res.status(200).json({message: 'ISBN is index in booksdb.js: '+bn});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

   // Respond with a JSON object
   const author = req.params.author;
   booksArray = Object.values(books);
   bn = booksArray.filter(book=>book.author===author)
return res.status(200).json({ message: bn });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    booksArray = Object.values(books);
    bn = booksArray.filter(book=>book.title===title)
 return res.status(200).json({ message: bn });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews;

 return res.status(200).json({ review: reviews});
});

module.exports.general = public_users;
