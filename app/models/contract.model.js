const mongoose = require("mongoose");

const Contract = mongoose.model(
  "Contract",
  new mongoose.Schema({
    trainerId: String,
    clientId: String,
    total: Number,
    createdDate: String,
    expiredDate: String,
    
    
  })
);

module.exports = Contract;