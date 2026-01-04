const express = require("express");
const mongoose = require("mongoose");
const Books = require("./models/booksmodel");


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/libraryDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ---------------- CREATE ---------------- */
// Insert a book
app.post("/add-book", async (req, res) => {
  try {
    if (req.body.availableCopies < 0) {
      return res.send("Negative stock not allowed");
    }
    await Book.create(req.body);
    res.send("Book added successfully");
  } catch {
    res.send("Error adding book");
  }
});

/* ---------------- READ ---------------- */
// 1. All books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// 2. Books by category
app.get("/books/category/:cat", async (req, res) => {
  const books = await Book.find({ category: req.params.cat });
  res.json(books);
});

// 3. Books after 2015
app.get("/books/after/2015", async (req, res) => {
  const books = await Book.find({ publishedYear: { $gt: 2015 } });
  res.json(books);
});

/* ---------------- UPDATE ---------------- */
// Update copies
app.put("/update-copies/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.send("Book not found");

  const newCopies = book.availableCopies + req.body.change;
  if (newCopies < 0) return res.send("Negative stock not allowed");

  book.availableCopies = newCopies;
  await book.save();
  res.send("Copies updated");
});

// Change category
app.put("/update-category/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.send("Book not found");

  book.category = req.body.category;
  await book.save();
  res.send("Category updated");
});

/* ---------------- DELETE ---------------- */
// Delete book if copies = 0
app.delete("/delete-book/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.send("Book not found");

  if (book.availableCopies !== 0) {
    return res.send("Cannot delete: copies not zero");
  }

  await Book.findByIdAndDelete(req.params.id);
  res.send("Book deleted");
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
