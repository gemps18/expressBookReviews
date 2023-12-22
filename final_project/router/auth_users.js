const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    }

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
    }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const bookISBN = req.params.isbn;
    const userReview = req.query.review;
    const currentUser = req.session.authenticated.username;
    let bookReviews = books[bookISBN].reviews;
    
    let reviewExists = false;
    for (const username in bookReviews) {
      if (username === currentUser) {
        bookReviews[currentUser] = userReview;
        reviewExists = true;
        break;
      }
    }
    if (!reviewExists) {
      bookReviews[currentUser] = userReview;
    }
    
    res.send("added successfully.");
  });
  
  // Delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const bookISBN = req.params.isbn;
    const currentUser = req.session.authenticated.username;
    const bookReviews = books[bookISBN].reviews;
    let reviewExists = false;
    for (const username in bookReviews) {
      if (username === currentUser) {
        delete bookReviews[currentUser];
        reviewExists = true;
        break;
      }
    }
    
    if (!reviewExists) {
      res.send("could not be deleted.");
    }
    res.send("deleted successfully.");
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
