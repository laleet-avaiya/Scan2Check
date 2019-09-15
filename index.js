const express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var bcrypt = require("bcrypt-nodejs");
var cors = require("cors");

const app = express();

// Then use it before your routes are set up:
app.use(cors());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
// var corsMiddleware = function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'localhost'); //replace localhost with actual host
//     res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');

//     next();
// }

// app.use(corsMiddleware);

app.use(bodyParser.urlencoded({ extended: true }));

var url =
  "mongodb+srv://lmavaiya:111996A@M@cluster0-ivhjb.mongodb.net/scan2check?retryWrites=true";
mongoose.connect(url, { useNewUrlParser: true }, () =>
  console.log("Database Connected.")
);

require("./admin");
const Admin = mongoose.model("User");
const Services = mongoose.model("Barcodes");

//-----------------------------------------------------------------------------------------------
// ------------------------------------------Home------------------------------------------------
//-----------------------------------------------------------------------------------------------

app.get("/", (req, res) => res.json({ msg: "service on..." }));

//------------------------------------------------------------------------------------------------
// -------------------------------------- Admin Login --------------------------------------------
//------------------------------------------------------------------------------------------------
app.post("/login", function(req, res) {
  var query = Admin.findOne({ email: req.body.email });
  query.exec(function(err, user) {
    if (err) res.send("user not found.");
    if (bcrypt.compareSync(req.body.password, user.password)) {
      // res.send("password Match");
      res.json(user);
    } else {
      res.json({ msg: "password did not Match" });
    }
  });
});

//-----------------------------------------------------------------------------------------------
// -------------------------------------- Admin Registration -------------------------------------
//------------------------------------------------------------------------------------------------
app.post("/register", function(req, res) {
  var new_user = new Admin();
  new_user.email = req.body.email;

  new_user.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(8),
    null
  );

  new_user.name = req.body.name;
  new_user.phone = req.body.phone;
  new_user.business_name = req.body.business_name;
  new_user.business_address = req.body.business_address;
  new_user.registered_on = Date.now();


  new_user
    .save()
    .then(() => res.json({ msg: "Registered Successfully" }))
    .catch(err => {
      if (err.code == "11000") res.json({ msg: "User Already exits" });
      else res.json({ msg: "Something wrong happened Try Again." });
    });
});

/*--------------------------------------------------------------------------------------------------
/------------------------------------------ List of Services ---------------------------------------
**------------------------------------------------------------------------------------------------*/

app.get("/services/", (req, res) => {
  var query = Services.find({});
  query.exec(function(err, docs) {
    if (err) res.json({ msg: "Not Found" });

    res.json(docs);
  });
});

/*------------------------------------------------------------------------------------------------
--------------------------------------- Services By id  ------------------------------------------
------------------------------------------------------------------------------------------------*/
app.get("/services/:id", (req, res) => {
  var query = Services.findById(req.params.id);
  query.exec(function(err, docs) {
    if (err) res.send({ msg: "Not Found" });
    res.json(docs);
  });
});

/*--------------------------------------------------------------------------------------------------
------------------------------------------- Insert New Service  ------------------------------------
--------------------------------------------------------------------------------------------------*/
app.post("/insert_service/", (req, res) => {
  var new_code = new Services();
  new_code.code = req.body.code;
  new_code.validity = req.body.validity;
  new_code.client_id = req.body.client_id;
  new_code.packed_on = Date.UTC();

  new_code
    .save()
    .then(() => res.json({ msg: "Code Added Successfully" }))
    .catch(err => {
      if (err.code == "11000") res.json({ msg: "Code Already exits" });
      else res.json({ msg: "Something wrong happened Try Again." });
    });
});

/*--------------------------------------------------------------------------------------------------
------------------------------------------- Update  Service  ---------------------------------------
--------------------------------------------------------------------------------------------------*/
// app.post("/update_service/", (req, res) => {
//   var updated_service = new Services();
//   var id = req.body.id;
//   // console.log(id);
//   updated_service._id = id;
//   updated_service.code = req.body.name;

//   Services.findByIdAndUpdate(id, updated_service, { new: true }, function(
//     err,
//     model
//   ) {
//     if (err) res.send(err);
//     else res.send(model);
//   });
// });

/*--------------------------------------------------------------------------------------------------
------------------------------------------- Delete  Service  ---------------------------------------
--------------------------------------------------------------------------------------------------*/
app.post("/delete_service/", (req, res) => {
  // console.log(req.body.id);
  Services.findById(mongoose.Types.ObjectId(req.body.id))
    .then(ser => ser.remove())
    .then(() => res.json({ msg: "Deleted" }))
    .catch(e => res.send(e));
});

//------------------------------------------------------------------------------------------------
// ---------------------------- Port Config-------------------------------------------------------
//------------------------------------------------------------------------------------------------

// const PORT = process.env.PORT || 4001
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server Started"));
