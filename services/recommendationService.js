const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const getRecommendations = async (params) => {
  try {
    console.log(`Sending recommendation request with params: ${JSON.stringify(params)}`);
    const response = await fetch('http://localhost:6000/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Received recommendations: ${JSON.stringify(data)}`);
    return data.recommendations || [];
  } catch (error) {
    console.error('Error communicating with recommendation service:', error);
    return ['Sorry, the recommendation service is currently unavailable.'];
  }
};

module.exports = getRecommendations;
