require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Serve the main Talent Hub index page at "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve config endpoint
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co`,
    supabaseKey: process.env.SUPABASE_ANON_KEY || '',
    googleApiKey: process.env.GOOGLE_API_KEY || '',
    perplexityApiKey: process.env.PERPLEXITY_API_KEY || ''
  });
});

// Perplexity Proxy (for compatibility with the LDS Oracle in index.html)
app.post('/api/tour/perplexity', async (req, res) => {
  try {
    const { userApiKey, ...requestBody } = req.body;
    const apiKey = userApiKey || process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key not configured.' });
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Perplexity API error:', error);
    res.status(500).json({ error: 'Failed to fetch from Perplexity API' });
  }
});

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// Serve photos folder as static
app.use('/photos', express.static(path.join(__dirname, 'photos')));

// Start server
app.listen(PORT, () => {
  console.log(`LDS Talent Hub server running on port ${PORT}`);
});
