const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Add security headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      // Avoid 'unsafe-eval' or inline scripts to keep CSP strict
    },
  },
}));

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: 'https://thinkalike-frontend.onrender.com', // Replace with your frontend URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  // Enforce JSON with charset to fix the MIME-type warning
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Example endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Helmet and headers are configured.' });
});

const port = 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
