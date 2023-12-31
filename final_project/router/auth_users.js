const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const axios = require("axios")

// let users = [{"username": "bigboi123", "password": "bigheart789","username": "joe456", "password": "mama654"}];
let users = [{"username": "bigboi123", "password": "bigheart789"}];



const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
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
//write code to check if username and password match the one we have in records.
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
  //Write your code here
  console.log(req.body)

  let username = req.body.username;
  let password = req.body.password;
  if(username && password){
    if(authenticatedUser(username,password)){
      //create a JWT token

      let token = jwt.sign({username:username}, 'my-secret-key', { expiresIn: '1h' });
      req.session.authorization = {
        token, username
      }
      return res.status(200).json({message: "User logged in successfully", token: token});
    }
    else{
      return res.status(400).json({message: "Username or password is incorrect"});
    }
  }
  return res.status(300).json({message: "Yet to be implemented"});
});
   
   // Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;
  console.log("we are here ")
  if(books[isbn]){
    if(books[isbn].reviews[username]){
      books[isbn].reviews[username] = [review];
      return res.status(200).json({ message: "Review modified successfully" });
    }
    else{
      books[isbn].reviews[username] = [review];
      return res.status(200).json({ message: "Review added successfully" });
    }
  }
  else{
    return res.status(404).json({message: "No book found with ISBN "+isbn});
  }
}
);
   
// delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  if(books[isbn]){
    if(books[isbn].reviews[username]){
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    }
    else{
      return res.status(404).json({message: "No review found for ISBN "+isbn});
    }
  }
  else{
    return res.status(404).json({message: "Sorry. No book found with ISBN "+isbn});
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
