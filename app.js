const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch-all handler for all routes (i.e., for client-side routing by React Router)
app.get('/api/users', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

module.exports = app;
