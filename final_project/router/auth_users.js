const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "kaka", password: "123"}];

const isValid = (usern)=>{ //returns boolean
// code to check is the username is valid
return users.some(user => user.username === usern);

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  // Find the user by username and password
  const user = users.find(user => user.username === username && user.password === password);

  // Check if a user with the provided username and password is found
  return !!user;
}

//only registered users can login
const secretKey = 'b234a1';
regd_users.post("/login", (req,res) => {

  const uname = req.body.username;
  const password = req.body.password;
  console.log(uname, password);
  console.log(authenticatedUser(uname, password));
  if(authenticatedUser(uname, password))
  {
    let token = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
    
      req.session.authorization = {
        token,uname
    }
  return res.status(200).json({token});}
  else {
    // Authentication failed
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn  = req.params.isbn;
  const review  = req.query;
  const username  = req.session.username;
  // Find existing review for the same user and ISBN
 

  books[isbn].reviews[username] = review;


  return res.status(200).json({username:books[isbn].reviews[username]});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username; // Assuming the username is stored in the session
  
    // Check if the isbn key exists in books
    if (books.hasOwnProperty(isbn)) {
      // Check if the value associated with isbn is an object with reviews property
      if (typeof books[isbn] === "object" && !Array.isArray(books[isbn].reviews)) {
        // Check if the review exists for the specified username
        if (books[isbn].reviews.hasOwnProperty(username)) {
          // Delete the review
          delete books[isbn].reviews[username];
          return res.status(200).json({ message: 'Review deleted successfully' });
        } else {
          return res.status(404).json({ message: 'Review not found for the specified user' });
        }
      } else {
        return res.status(500).json({ message: `Invalid data structure for isbn ${isbn}` });
      }
    } else {
      return res.status(404).json({ message: `isbn ${isbn} not found in books` });
    }
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
