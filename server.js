// server.js: Main entry point for the Express server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./routes/index');

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Use defined routes
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
