const express = require("express")
const regd_books = express.Router();

let books = {
      1: {"isbn": "978-0-385-47454-9","author": "Chinua Achebe","title": "Things Fall Apart","review": {} },
      2: {"isbn": "978-1-84749-719-5","author": "Hans Christian Andersen","title": "Fairy tales","review": {} },
      3: {"isbn": "978-0-140-43687-3","author": "Dante Alighieri","title": "The Divine Comedy", "review": {} },
      4: {"isbn": "978-0-14-044100-0","author": "Unknown","title": "The Epic Of Gilgamesh","review": {} },
      5: {"isbn": "978-0-19-953587-3","author": "Unknown","title": "The Book Of Job","review": {} },
      6: {"isbn": "978-1-59308-266-8","author": "Unknown","title": "One Thousand and One Nights","review": {} },
      7: {"isbn": "978-0-14-044769-9","author": "Unknown","title": "Nj\u00e1l's Saga","review": {} },
      8: {"isbn": "978-1-59308-324-5","author": "Jane Austen","title": "Pride and Prejudice","review": {} },
      9: {"isbn": "978-1-85326-685-0","author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot","review": {} },
      10: {"isbn": "978-0-394-75269-1","author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "review": {} }
}

regd_books.get('/',(req,res)=>{
    res.json(books);
})

module.exports = books;
module.exports = regd_books;
