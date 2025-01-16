document.addEventListener('DOMContentLoaded', function() {
    // Chat container and messages
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input input');
    const chatButton = document.querySelector('.chat-input button');
    
    // Function to scroll to the bottom of the chat
    function scrollToBottom() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  
    // Event listener for sending messages
    chatButton.addEventListener('click', function() {
      const messageText = chatInput.value.trim();
      if (messageText !== "") {
        // Create new message bubble
        const newMessage = document.createElement('div');
        newMessage.classList.add('chat-bubble', 'right');
        newMessage.textContent = messageText;
        
        // Add the message bubble to chat messages
        chatMessages.appendChild(newMessage);
        
        // Clear the input field
        chatInput.value = "";
        
        // Scroll to the bottom
        scrollToBottom();
      }
    });
  
    // Auto-scroll on message change (in case of a new incoming message)
    const observer = new MutationObserver(scrollToBottom);
    observer.observe(chatMessages, {
      childList: true,  // Observe added/removed child nodes
      subtree: true     // Observe all descendants of chatMessages
    });
  
    // Initial scroll to the bottom
    scrollToBottom();
  });
  