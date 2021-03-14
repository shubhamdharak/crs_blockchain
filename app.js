// -------------------- Import Modules -------------------
const express = require("express");
var bodyParser = require("body-parser");
var expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const app = express();

// ----------------- Middelware Manager ---------------------
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { path: "/", httpOnly: false, secure: false, maxAge: null },
    resave: true,
    saveUninitialized: false,
  })
);

app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userName;
  next();
});

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(expressLayouts);
app.use(express.static("public"));

// ----------------------- Import Controllers / URL Router --------------------------------
const regController = require("./controllers/User");
const loginController = require("./controllers/login");
const dashboardController = require("./controllers/Dashboard");
const verifyEmail = require("./controllers/verifyUser");
const contactUs = require("./controllers/contactUs");
const userController = require("./controllers/User");
const authUser = require("./controllers/authUser");
const mail = require("./controllers/mail");
const rpass = require("./controllers/resetPassword");
const operations = require('./controllers/operations')

// ---------------------------- Use Controllers -----------------------
// Home Page Handlers
app.get("/", operations.index);

// Registration Handlers
app.get("/register", regController.getData);
app.post("/register", regController.register);

// Login Handlers
app.get("/login", loginController.login);
app.post("/login", loginController.postLogin);

//Forgot Reset Password Handlers
app.post("/forgot", rpass.forgotPassword);
app.get("/ResetPassword/:token", rpass.reset);
app.post("/reset", rpass.setNewPwd);

// Dashboard Handlers
app.get("/Dashboard", dashboardController.dashboard);

// Logout Handlers
app.get("/logout", loginController.logout);

app.get('/transactions', operations.transactions)
app.get('/getTransaction/:hash', operations.getTransaction)

// Action Handlers for schemes
app.get('/allSchemes', operations.allSchemes)
app.get('/getAScheme/:id', operations.getAScheme)
app.post('/addScheme', operations.addScheme)
app.get('/deleteScheme/:id', operations.deleteScheme)
app.post('/updateScheme', operations.updateScheme)

// Action handler for Matrials 
app.get('/getAMaterial/:id', operations.getAMaterial)
app.post('/addMaterial', operations.addMaterial)
app.get('/deleteMaterial/:id', operations.deleteMaterial)
app.post('/updateMaterial', operations.updateMaterial)

// ContactUs Handlers
app.get("/contact", contactUs.getPage);
app.post("/contact", contactUs.storeQuery);
app.get("/QueryStatus", contactUs.trackQuery);

// Other API Handlers
app.get("/VerifyMail", verifyEmail.verify);

// ---------------------------- Init Server -------------------
// Start Server
app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT}`) 
);
