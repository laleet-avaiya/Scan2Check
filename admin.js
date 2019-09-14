var mongoose = require("mongoose");

// Create Schema and Model it
mongoose.model("Admin", {
  // _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  business_name: {
    type: String,
    required: true
  },
  business_address: {
    type: String,
    required: true
  },
  registered_on: {
    type: Date,
    require: true
  }
});

mongoose.model("Services", {
  // _id: mongoose.Schema.Types.ObjectId,
  service_name: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  }
});
