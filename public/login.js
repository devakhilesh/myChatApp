document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/user/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const result = await response.json();
    if (result.status) {
      localStorage.setItem('token', result.token);
      alert(result.message);
      window.location.href = '/conversations.html';
    } else {
      alert(result.message);
    }
  });
  