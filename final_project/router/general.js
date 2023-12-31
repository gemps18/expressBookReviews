const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.use(express.json());

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  console.log(req.body)
  if(username && password){
    if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User Successfully registred. You can now login."})
    }
    else{
      return res.status(404).json({message: "User already exist!"})
    }
  }else{
      return res.status(404).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    //TASK 10 WITH PROMISES and CALLBACKS
    let myBooks = new Promise((resolve, reject)=>{
        resolve(books)
    })
    myBooks.then((data)=> {
        return res.send(JSON.stringify(data, null, 4 ));
    })
    myBooks.catch(()=>{
        return res.status(400).json({message: "NOT FOUND"});
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Write your code here
    // TASK 11 WITH PROMISES and CALLBACKS
    let isbn = req.params.isbn;
    let singleBook = new Promise((resolve, reject)=>{
        const isbnBook = Object.values(books).filter(el => { return el.isbn === isbn; });
        resolve(isbnBook)
    })

    singleBook.then((data) => {
       return res.send(JSON.stringify(data, null, 4));
    });
   
    singleBook.catch(() => {
       return res.status(404).json({ message: "No Book Found With The Specified ISBN." });
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //TASK 12 WITH PROMISES and CALLBACKS
  let author = req.params.author
  let singleBook = new Promise((resolve, reject)=>{
      const authorBook = Object.values(books).filter(el => { return el.author === author; });
    resolve(authorBook)
  })

  singleBook.then(data =>{
    return res.send(JSON.stringify(data, null, 4));
  })

  singleBook.catch(() =>{
    return res.status(404).json({message: "No Books Found With The Specified Author."})
  })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //TASK 13 WITH PROMISES and CALLBACKS
  let title = req.params.title;
  let singleBook = new Promise((resolve, reject)=>{
    const titleBook = Object.values(books).filter(el =>{return el.title === title})
    resolve(titleBook)
  })
  singleBook.then(data =>{
    return res.send(JSON.stringify(data, null, 4));
  })

  singleBook.catch((e) =>{
    return res.status(404).json({message: "No Books Found With The Specified Title."})
  })
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    let review = req.params.review;
    let singleBook = new Promise((resolve, reject)=>{
        const reviewBook = Object.values(books).filter(el =>{return el.review === review})
        resolve(reviewBook)
    })
    singleBook.then(data =>{
        return res.send(JSON.stringify(data, null, 4));
    })

    singleBook.catch(() =>{
        return res.status(404).json({message: "No Reviews Found With The Specified ISBN."})
    })
  });

module.exports.general = public_users;
