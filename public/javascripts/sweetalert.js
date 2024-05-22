

// sweet alert para el register


document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
  
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      if (result.redirect === "/login") {
        Swal.fire({
          icon: 'warning',
          title: 'Edad insuficiente',
          text: result.message,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.href = result.redirect;
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Registrado correctamente',
          text: result.message,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.href = result.redirect;
        });
      }
    })
  });


//sweet alert para el login

  document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'logueado correctamente',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.href = result.redirectUrl;
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Usuario o Contraseña incorrecta',
          text: 'Por favor intentalo de nuevo',
        }).then(() => {
          window.location.href = '/';
        });
      }
  });