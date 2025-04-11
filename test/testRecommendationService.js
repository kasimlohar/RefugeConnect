const getRecommendations = require('../services/recommendationService');

(async () => {
  try {
    // Define test parameters
    const params = {
      preference: 'job',
      filters: { location: 'City', budget: 'low' }
    };

    // Call the getRecommendations function
    const recommendations = await getRecommendations(params);

    // Log the recommendations
    console.log('Recommendations:', recommendations);
  } catch (error) {
    console.error('Error testing recommendation service:', error);
  }
})();
