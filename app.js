// -------------------- Import Modules -------------------
const express = require("express");
var bodyParser = require("body-parser");
var expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
var multer  = require('multer');
const cors = require('cors');
const path = require("path");
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

// CORES
app.use(cors());

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
app.use(express.static(__dirname + "/public"));

// Multer 

const storage = multer.diskStorage({
    destination: (req, file, cb)=> cb(null, './public/uploads/'),
    filename: (req, file, cb)=>{
        cb(null, file.originalname )
    }
});

var upload = multer({ dest: '/public/uploads/',storage: storage });

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
const operations = require('./controllers/operations');
const bidController = require('./controllers/bidController');

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
app.get("/Dashboard/bid", bidController.bidSection);
app.post("/Dashboard/approve", bidController.approveBid);
app.get('/Dashboard/delete/:bidId', bidController.deleteBid);

// Logout Handlers
app.get("/logout", loginController.logout);

app.get('/transactions', operations.transactions)
app.get('/getTransaction/:hash/:event', operations.getTransaction)

// Action Handlers for schemes
app.get('/allSchemes', operations.allSchemes)
app.get('/getAScheme/:id', operations.getAScheme)
app.post('/addScheme',upload.single('fimage'), operations.addScheme)
app.get('/deleteScheme/:id', operations.deleteScheme)
app.post('/updateScheme',upload.single('fimage'), operations.updateScheme)

// Action handler for Matrials 
app.get('/getAMaterial/:id', operations.getAMaterial)
app.post('/addMaterial', operations.addMaterial)
app.get('/deleteMaterial/:id', operations.deleteMaterial)
app.post('/updateMaterial', operations.updateMaterial)
app.get('/myMaterials', operations.myMaterials)

//  Handlers for Bid 
app.post('/makeBid', operations.makeBid)
app.get('/Dashboard/getBid/:contract_id', operations.getBid)
app.get('/myScheme', bidController.myScheme);

// Handler for the Funds
app.post('/addFund', bidController.addFund);

app.post('/addProgress',upload.array('wimage',5), bidController.addProgress);
app.get('/progress', bidController.progress)

// ContactUs Handlers
app.get("/contact", contactUs.getPage);
app.post("/contact", contactUs.storeQuery);
app.get("/QueryStatus", contactUs.trackQuery);
app.get("/AllQuery", contactUs.AllQuery);
app.post('/resolveQuery', contactUs.resolveQuery);

// Other API Handlers
app.get("/VerifyMail", verifyEmail.verify);

// notification
app.post('/notification', operations.notification);
app.get('/notification', operations.getNotification);

app.post('/addQuta', operations.addQuta);
app.post('/approveQuota', operations.approveQuota);

// ---------------------------- Init Server -------------------
// Start Server
app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT}`) 
);
