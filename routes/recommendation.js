const express = require('express');
const router = express.Router();
const getRecommendations = require('../services/recommendationService');

// Handle recommendation API requests
router.post('/api/recommend', async (req, res) => {
  const { preference, filters } = req.body;

  if (!preference) {
    console.error('Error: Preference is missing in the request body.');
    return res.status(400).json({ success: false, error: 'Preference is required' });
  }

  try {
    console.log(`Received recommendation request: ${JSON.stringify({ preference, filters })}`);
    const recommendations = await getRecommendations({ preference, filters });
    console.log(`Recommendations: ${JSON.stringify(recommendations)}`);
    res.json({ success: true, recommendations });
  } catch (error) {
    console.error('Error in recommendation API:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
