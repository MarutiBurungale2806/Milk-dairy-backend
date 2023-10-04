const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    userId: Number,
    name: String,
    mobileNo: Number,
  });
  
  module.exports = mongoose.model('Member', memberSchema);