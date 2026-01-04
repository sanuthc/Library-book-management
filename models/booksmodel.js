const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  publishedYear: Number,
  availableCopies: {
    type: Number,
    min: 0,
    required:true
  }
});

module.exports = mongoose.model("Books", bookSchema);
