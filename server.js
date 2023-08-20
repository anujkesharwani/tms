const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const UserDetails = require("./models/userDetails");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// Configure Express to use EJS as the view engine
app.set("view engine", "ejs");

// Middleware for parsing URL-encoded and JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
// const dburl =
//   "mongodb+srv://harshdeep542001:<password>@cluster0.znwgumj.mongodb.net/?retryWrites=true&w=majority";
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

// Routes
app.get("/", function (req, res) {
  res.render("navigation");
});

app.get("/user", function (req, res) {
  res.render("user");
});

// app.get("/admin", function (req, res) {
//   res.render("admin");
// });

// app.get("/resolver", function (req, res) {
//   res.render("resolver");
// });
app.get('/resolver', (req, res) => {

  res.render('resolver'); // Pass the data to the template
});

app.post("/user", upload.single("file"), async (req, res) => {
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

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
