// Add this inside the 'DOMContentLoaded' event listener
document.addEventListener('DOMContentLoaded', () => {
  console.log('StudyFlow website is loaded and ready!');
  
  // Login form submission logic
  const loginForm = document.querySelector('.auth-form');
  if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();

          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          try {
              // Send login request to the backend
              const response = await fetch('http://localhost:3000/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password }),
              });

              const data = await response.json();

              if (response.ok) {
                  // Save the token in localStorage
                  localStorage.setItem('token', data.token);
                  alert('Login successful! Redirecting...');
                  window.location.href = 'protected.html'; // Replace with your protected route/page
              } else {
                  alert(`Login failed: ${data.message}`);
              }
          } catch (error) {
              console.error('Error during login:', error);
              alert('Something went wrong. Please try again.');
          }
      });
  }

  // Check protected route (e.g., a "Dashboard" page)
  const token = localStorage.getItem('token');
  if (token) {
      fetch('http://localhost:3000/api/resources/protected', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
      })
          .then((res) => res.json())
          .then((data) => {
              if (data.message === 'You have accessed a protected route!') {
                  console.log('Access granted to the protected route.');
              } else {
                  alert('Failed to access the protected route.');
              }
          })
          .catch((error) => {
              console.error('Error accessing the protected route:', error);
          });
  }
});
