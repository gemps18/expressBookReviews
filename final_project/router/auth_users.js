const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// let users = [{"username": "bigboi123", "password": "bigheart789","username": "joe456", "password": "mama654"}];
let users = [{"username": "bigboi123", "password": "bigheart789"}];



const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsmaename = users.filter(user =>{
    return user.username === username
});
if(userswithsmaename.length > 0){
    return true;
}else{
    return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter(user =>{
    return (user.username === username && user.password === password)
});
if(validusers.length >0){
    return true;
}else{
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password
  if(!username || !password){
      return res.status(400).json({message: "Error logging in!"});
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60});
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

function findBookById(id) {
    return books.find(book => book.id === id);
}

// Add a book review
regd_users.put("/auth/review/:id", (req, res) => {
    let id = req.params.id;
    let review = req.query.review;
    let username = req.session.authorization.username;
    let book = findBookById(id);

    if (book) {
        let obj = book.reviews;
        let tipo = typeof(obj);
        if(obj[username]){
            obj[username] = review;
            return res.status(200).json({message: "Review same user saved ***"+ tipo +"**** " + JSON.stringify(book)});
        }else{
            obj[username] = review;
            return res.status(200).json({message: "Different user Review saved " + JSON.stringify(book)});
        }
    } else {
        return res.status(404).json({message: "Book not found!"});
    }
});

regd_users.delete("/auth/review/:id", (req, res)=>{
    let id = req.params.id;
    let username = req.session.authorization.username;
    let book = findBookById(id);

    if (book) {
        let obj = book.reviews[username];

        if(obj && obj.length > 0){
            delete book.reviews[username]
            return res.status(200).json({message: JSON.stringify(obj) +" , was deleted succesfully. "+ JSON.stringify(book)});
        }else{
            return res.status(404).json({message: "The review was not found!"} + JSON.stringify(obj))
        }
    } else {
        return res.status(404).json({message: "Book not found!"});
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
