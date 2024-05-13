document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const edad = parseInt(document.getElementById('edad').value);
    const username = document.getElementById("username".value)
    if (isNaN(edad) || edad < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingresa una edad válida.',
            confirmButtonText: 'Entendido'
        })
    } else {
        if (edad >= 18) {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso!',
                text: '¡Bienvenido!',username,
                confirmButtonText: 'Entendido'
            }).then(() => {
                window.location.href = '/main';
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes ser mayor de edad para iniciar sesión.',
                confirmButtonText: 'Entendido'
            })
        }
    }
})