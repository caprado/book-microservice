require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const bookRoutes = require('./src/routes/bookRoutes');

// Body parser middleware
app.use(express.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Mount router
app.use('/book', bookRoutes);

// Start listening for connections
app.listen(port, () => {
    console.log(`Book service listening at http://localhost:${port}`);
});
