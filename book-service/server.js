const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const bookRoutes = require('./src/routes/bookRoutes');

// Body parser middleware
app.use(express.json());

// Mount router
app.use('/book', bookRoutes);

// Start listening for connections
app.listen(port, () => {
    console.log(`Book service listening at http://localhost:${port}`);
});
