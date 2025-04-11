$(document).ready(function () {
    console.log('chat.js loaded'); // Debug log
  
    $('#chat-form').on('submit', function (e) {
      e.preventDefault();
      console.log('Form submitted'); // Debug log
  
      const userMessage = $('#user-message').val().trim();
      if (!userMessage) {
        console.warn('User message is empty.'); // Debug log
        return;
      }
  
      console.log(`User message: ${userMessage}`); // Debug log
  
      const chatMessages = $('#chat-messages');
  
      // Append user message
      const userMessageElement = `
        <div class="message user mb-2">
          <i class="fas fa-user text-secondary"></i>
          <div class="message-content d-inline-block bg-primary text-white p-2 rounded">
            ${userMessage}
          </div>
        </div>
      `;
      chatMessages.append(userMessageElement);
  
      // Scroll to the newest message
      chatMessages.scrollTop(chatMessages.prop('scrollHeight'));
  
      // Clear input
      $('#user-message').val('');
  
      // Send message to chatbot API
      $.ajax({
        url: '/api/chat',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ message: userMessage }),
        success: function (data) {
          console.log(`Bot response: ${data.response}`); // Debug log
          const botReply = data.response || 'Sorry, I could not understand that.';
          const botMessageElement = `
            <div class="message assistant mb-2">
              <i class="fas fa-robot text-primary"></i>
              <div class="message-content d-inline-block bg-light p-2 rounded">
                ${botReply}
              </div>
            </div>
          `;
          chatMessages.append(botMessageElement);
  
          // Scroll to the newest message
          chatMessages.scrollTop(chatMessages.prop('scrollHeight'));
        },
        error: function (xhr, status, error) {
          console.error(`Error: ${status}, ${error}`); // Debug log
          const errorMessageElement = `
            <div class="message assistant mb-2">
              <i class="fas fa-robot text-danger"></i>
              <div class="message-content d-inline-block bg-light p-2 rounded">
                Sorry, something went wrong. Please try again later.
              </div>
            </div>
          `;
          chatMessages.append(errorMessageElement);
  
          // Scroll to the newest message
          chatMessages.scrollTop(chatMessages.prop('scrollHeight'));
        }
      });
    });
  });