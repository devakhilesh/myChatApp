const socket = io();
const conversationId = new URLSearchParams(window.location.search).get('conversationId');
const token = localStorage.getItem('token');

document.getElementById('message-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = document.getElementById('message-input').value;

  const response = await fetch(`/user/message/creeateMesssage/${conversationId}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: JSON.stringify({ message })
  });

  const result = await response.json();
  if (result.status) {
    socket.emit('chat message', result.data);
    document.getElementById('message-input').value = '';
  }
});

socket.on('new message', (message) => {
  const container = document.getElementById('message-container');
  const msgDiv = document.createElement('div');
  msgDiv.textContent = `${message.senderId}: ${message.message}`;
  container.appendChild(msgDiv);
});
