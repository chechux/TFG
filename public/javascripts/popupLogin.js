function abrirPopup() {
    history.pushState(null, null, 'popupLogin');
    window.location = 'popupLogin'
    const popup = document.getElementById('popup')
    popup.style.display = 'block';
    document.body.classList.add('fondo-opaco')
}

function cerrarPopup() {

        document.getElementById('popup').style.display = 'none';
        history.back();
        document.body.classList.remove('fondo-opaco')
}



function abrirPopupR() {
    history.pushState(null, null, 'popupRegister');
    window.location = 'popupRegister'
    const popup = document.getElementById('popup2')
    popup.style.display = 'block';
    document.body.classList.add('fondo-opaco')
}

function cerrarPopupR() {

        document.getElementById('popup2').style.display = 'none';
        history.back();
        document.body.classList.remove('fondo-opaco')
}

