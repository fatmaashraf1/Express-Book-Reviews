const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


// Task 1: Get the book list available in the shop
public_users.get("/books", function (req, res) {
  // Return the list of all books
  res.status(200).json({ books: books });
});


// Task 10: Get the book list available in the shop using async-await axios
public_users.get("/", async (req, res) => {
  try {
    // Axios GET request to fetch the book list
    const response = await axios.get("http://localhost:5000/books");
    return res.status(200).json({ books: response.data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});


// Task 2: Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Extract the ISBN from the request parameters
  const book = books[req.params.isbn];

  if (book) {
    // If the book is found, return the book details
    return res.status(200).json(book);
  } else {
    // If the book is not found, return an error message
    return res.status(404).send("Book not found!");
  }
});


// Task 11: Get book details based on ISBN using Promises
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;

    // Create a Promise to find the book by ISBN
    const bookByISBN = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book); // Resolve the promise with the book details if found
      } else {
        reject("Book not found!"); // Reject the promise if the book is not found
      }
    });

    // Return the book details if found
    res.status(200).json(bookByISBN);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});


// Task 3: Get all book details based on author
public_users.get("/author/:author", function (req, res) {
  const isbns = Object.keys(books); // Get all ISBNs
  let booksByAuthor = [];

  // Iterate over each ISBN to find books by the given author
  isbns.forEach((isbn) => {
    if (books[isbn].author === req.params.author) {
      // If the author matches, add the book details to the result list
      let book = {
        isbn: isbn,
        title: books[isbn].title,
        reviews: books[isbn].reviews,
      };
      booksByAuthor.push(book);
    }
  });

  // Return the list of books by the author
  return res.status(200).json({ booksbyauthor: booksByAuthor });
});


// Task 12: Get all book details based on author using Promises
public_users.get("/author/:author", async (req, res) => {
  try {
    // Create a Promise to find all books by author
    const booksByAuthor = await new Promise((resolve, reject) => {
      const isbns = Object.keys(books); // Get all ISBNs
      let booksAuthor = [];

      try {
        // Iterate over each ISBN to find books by the given author
        isbns.forEach((isbn) => {
          if (books[isbn].author === req.params.author) {
            // If the author matches, add the book details to the result list
            let book = {
              isbn: isbn,
              title: books[isbn].title,
              reviews: books[isbn].reviews,
            };
            booksAuthor.push(book);
          }
        });
        resolve(booksAuthor); // Resolve the promise with the list of books by the author
      } catch (error) {
        reject(error); // Reject the promise if an error occurs
      }
    });

    // Return the list of books by the author
    res.status(200).json({ booksbyauthor: booksByAuthor });
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Task 4: Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const isbns = Object.keys(books); // Get all ISBNs
  let booksByTitle = [];

  // Iterate over each ISBN to find books by the given title
  isbns.forEach((isbn) => {
    if (books[isbn].title === req.params.title) {
      // If the title matches, add the book details to the result list
      let book = {
        isbn: isbn,
        author: books[isbn].author,
        reviews: books[isbn].reviews,
      };
      booksByTitle.push(book);
    }
  });

  // Return the list of books by the title
  return res.status(200).json({ booksbytitle: booksByTitle });
});

// Task 13: Get all books based on title using Promises
public_users.get("/title/:title", async (req, res) => {
  try {
    // Create a Promise to find all books by title
    const booksByTitle = await new Promise((resolve, reject) => {
      const isbns = Object.keys(books); // Get all ISBNs
      let booksTitle = [];

      try {
        // Iterate over each ISBN to find books by the given title
        isbns.forEach((isbn) => {
          if (books[isbn].title === req.params.title) {
            // If the title matches, add the book details to the result list
            let book = {
              isbn: isbn,
              author: books[isbn].author,
              reviews: books[isbn].reviews,
            };
            booksTitle.push(book);
          }
        });
        resolve(booksTitle); // Resolve the promise with the list of books by the title
      } catch (error) {
        reject(error); // Reject the promise if an error occurs
      }
    });

    // Return the list of books by the title
    res.status(200).json({ booksbytitle: booksByTitle });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Task 5: Get book reviews based on ISBN
public_users.get("/review/:isbn", function (req, res) {
  // Get the book details by ISBN
  const book = books[req.params.isbn];

  if (book) {
    // If the book is found, Return the book reviews
    return res.status(200).json(book.reviews);
  } else {
    // If the book is not found, Return an error message
    return res.status(404).send("Book not found!");
  }
});

// Task 6: Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add new user to the users list
  const newUser = { username, password };
  users.push(newUser);

  // Return a success message and the new user details
  res
    .status(200)
    .json({ message: "Customer registered successfully", user: newUser });
});

module.exports.general = public_users;
