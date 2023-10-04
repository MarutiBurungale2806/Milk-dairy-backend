const mongoose = require('mongoose');

// Create a schema for your collection
const collectionSchema = new mongoose.Schema({
  userId: {
    type: Number,
    ref: 'Member', // Reference to the Member model
    required: true,
  },
  memberName: {
    type: String,
    required: true,
  },
  milk: {
    type: String,
    required: true,
  },
  snf: {
    type: String,
    required: true,
  },
  fat: {
    type: String,
    required: true,
  },
  animal: {
    type: String,
    enum: ['cow', 'buffalo'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  // Add other fields as needed
});

// Create a model for your collection
const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
