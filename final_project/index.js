const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
     // Check if the user is authenticated
    const token = req.headers.authorization;
const isAuthenticated = verifyToken(token);
if (isAuthenticated) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, send an unauthorized response
    res.status(401).send("Unauthorized");
  }
});

// Your other routes and middleware can go here

// Example route using the authentication middleware
// app.get("/customer/auth/profile", function (req, res) {
//   res.send("User profile page");
// });


 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server is running at port {PORT}`));
