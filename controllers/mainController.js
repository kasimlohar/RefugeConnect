// mainController.js: Controller logic for main routes
exports.home = (req, res) => {
  res.render('index', { title: 'Home' });
};

exports.chatbot = (req, res) => {
  res.render('chatbot', { title: 'Chatbot' });
};
