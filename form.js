document.getElementById('sign-up-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Gather form data
  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('password', document.getElementById('password').value);
  formData.append('numberPlate', document.getElementById('numberPlate').value);
  formData.append('licenseFile', document.getElementById('licenseFile').files[0]);

  try {
    console.log('Sending form data to the server...');
    const response = await fetch('http://localhost:3000/submit-form', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.text();
      console.log('Server response:', result);
      alert('Sign up successful: ' + result);
    } else {
      const errorText = await response.text();
      console.error('Server error:', errorText);
      alert('Error during sign up: ' + errorText);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('An error occurred during sign up');
  }
});
