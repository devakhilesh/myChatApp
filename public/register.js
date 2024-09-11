document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/user/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
  
    const result = await response.json();
    if (result.status) {
      alert(result.message);
      window.location.href = '/login.html';
    } else {
      alert(result.message);
    }
  });
  