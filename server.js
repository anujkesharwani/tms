const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
var socketio = require("socket.io");
const io = socketio(server)
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const UserDetails = require("./models/userDetails");
const UserDetailssignup = require("./models/signupdata");
var session = require('express-session');
app.use('/', express.static(__dirname + '/chat'));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const dburl ='mongodb://0.0.0.0/TicketsManagementSystem';
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });


//session
app.set('trust proxy',1)
app.use(session({
  secret : 'anuj',
  resave: false,
  saveUninitialized: true,
}))

// Routes
app.get("/", function (req, res) {
  res.render("navigation");
});

app.get("/user", function (req, res) {
  res.render("user");
});

app.get("/signUp", function (req, res) {
  res.render("signUp");
});
app.get("/login",function(req,res){
  res.render("login")
})
app.get('/resolver', (req, res) => {

  res.render('resolver'); // Pass the data to the template
});

app.post("/user", upload.single("file"), async (req, res) => {
  if(!req.session.isloggedin){
    res.redirect("/login");
    return;
  }
  res.render("navigation",{email:req.session.email});
  try {
    const { name, email, phone, issue, note } = req.body;
    const file = req.file ? req.file.filename : "";

    const userDetailsInstance = new UserDetails({
      name,
      email,
      phone,
      issue,
      file,
      note,
    });

    await userDetailsInstance.save();
    //res.status(201).json({ message: "Ticket raised successfully" });
    res.redirect("/admin")
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});


app.get("/admin", async (req, res) => {
  try {
    const userTickets = await UserDetails.find(); // Fetch all documents from the collection
    
    res.render("admin", { userTickets });
    // console.log(userTickets)
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.post("/signUp",async(req,res) =>{
  try{
      const { name,email,phone,password}=req.body;
      const signupdata=new UserDetailssignup({
          name,
          email,
          phone,
          password,
      });
      console.log(signupdata)
      await signupdata.save();
      res.redirect("/login");
  }
  catch (error){
      console.error("error creating",error);
      res.status(500).json({message:"an error occured"})
  }
});



app.post("/login",async function(req,res){
  try{
      const user = await UserDetailssignup.findOne({email:req.body.email});
      if(user){
          
          const result=req.body.password===user.password;
          if(result){
              console.log("login succes")
              res.render("user");
  
          }
          else{
               res.status(400).json({ error: 'password doesnot match' }); 
          }
      }
      else{
              res.status(400).json({error:'user does not exist'})
      }
  }catch(error){
      res.status(400).json({error})
  }
});




//chat
io.on('connection',(socket) =>{
  console.log("connected with socket id=",socket.id)
  //socket.on('msgsend',(data) => {
    // console.log('received' , data.msg)               //print the masge in console
    // io.emit('msgrece',data)                         // msg send to all client and self also
    // socket.emit('msgrece',data)                     // masg send to only self
    //socket.broadcast.emit('msgrece',data)              // msg send to except self and send to other
    
})
//});


// Start the server
const port = 8081;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
