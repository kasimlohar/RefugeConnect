module.exports = {
    handleApiError: (error) => {
        console.error('API Error:', error.message || error);
        return { success: false, message: 'An error occurred. Please try again later.' };
    },
};
