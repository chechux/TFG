function abrirPopup() {
    history.pushState(null, null, 'crearTabla');
    window.location = 'crearTabla'
    const popup = document.getElementById('popup')
    popup.style.display = 'block';
    document.body.classList.add('fondo-opaco');
}

function cerrarPopup() {

        document.getElementById('popup').style.display = 'none';
        history.back();
        document.body.classList.remove('fondo-opaco');
}