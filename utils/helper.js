// helper.js: Common helper functions
module.exports = {
  formatDate: (date) => {
    return date.toISOString().split('T')[0];
  }
};
