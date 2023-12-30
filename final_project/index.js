const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const { authenticated } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const books_route = require('./router/booksdb.js');

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/books", books_route);

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
console.log(req.session)
if(req.session){    
    if(req.session.authorization){
        let token = req.session.authorization.token;
        jwt.verify(token, "my-secret-key",(err, user) =>{
            if(!err){
                // Token verification passed
                req.session.user = user;
                next();
            }else{
                req.status(401).json({ error: "User not authenticated" });
            }
        });
    }else{
        return res.status(403).json({message: "User not Logged in."})
    }
}else{
    return res.status(403).json({message: "User session not found."})
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running on port:"+PORT));
