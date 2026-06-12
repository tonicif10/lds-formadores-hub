module.exports = async (req, res) => {
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
};
