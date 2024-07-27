const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the username is valid (i.e., not already taken)
const isValid = (username) => { // Returns boolean
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  // If no users with the same username are found, return true
  if (usersWithSameName.length == 0) {
    return true;
  } else {
    // If a user with the same username is found, return false
    return false;
  }
};


// Function to check if the user is authenticated
const authenticatedUser = (username, password) => { // Returns boolean
  // Filter the users to get the user with the requested username and password
  const validUser = users.find(
    (e) => username === e.username && password === e.password
  );

  // If a matching user is found, return true
  if (validUser) {
    return true;
  } else {
    // If no matching user is found, return false
    return false;
  }
};


// Only registered users can log in
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }

  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
    // Generate a JWT token for the user
    let accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60, // Token expires in 1 hour
    });
    // Store the token and username in the session
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User logged in successfully" });
  } else {
    // If authentication fails, Return an error message
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username; // Get the username from the session
  const review = req.body.review;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found!" });
  }

  // Check if the review is provided
  if (!review) {
    return res.status(404).json({ message: "Review is required" });
  }

  const isNewReview = !books[isbn].reviews[username]; // Check if it's a new review or an update
  books[isbn].reviews[username] = review; // Add or update the review

  // Return a success message and the updated reviews
  return res.status(200).json({
    isbn: isbn,
    username: username,
    message: isNewReview ? "Review is added successfully" : "Review is updated successfully",
    reviews: books[isbn].reviews,
  });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username; // Get the username from the session

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const isFound = books[isbn].reviews[username]; // Check if the review exists
  if (!isFound) {
    return res.status(404).json({ message: "Review not exists" });
  }

  // Delete the review
  delete books[isbn].reviews[username];

  // Return a success message and the updated reviews
  return res.status(200).json({
    isbn: isbn,
    username: username,
    message: "Review is deleted successfully",
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
