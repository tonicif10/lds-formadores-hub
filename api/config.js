module.exports = (req, res) => {
  res.json({
    supabaseUrl: `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co`,
    supabaseKey: process.env.SUPABASE_ANON_KEY || '',
    googleApiKey: process.env.GOOGLE_API_KEY || '',
    perplexityApiKey: process.env.PERPLEXITY_API_KEY || ''
  });
};
