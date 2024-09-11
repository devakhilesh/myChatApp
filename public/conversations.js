document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/user/conversation/getAllCoversation', {
      method: 'GET',
      headers: { 'x-auth-token': token }
    });
  
    const result = await response.json();
    const conversations = result.data;
    const conversationDiv = document.getElementById('conversations');
  
    conversations.forEach(conv => {
      const div = document.createElement('div');
      div.textContent = `Conversation with ${conv.receiverId.name}`;
      div.addEventListener('click', () => {
        window.location.href = `/messages.html?conversationId=${conv._id}`;
      });
      conversationDiv.appendChild(div);
    });
  });
  