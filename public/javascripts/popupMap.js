document.addEventListener('DOMContentLoaded', function () {
    const openPopupButton = document.getElementById('abrir');
    const closePopupButton = document.getElementById('close');
    const popup = document.getElementById('container-map');
    const overlay = document.getElementById('overlay');


    openPopupButton.addEventListener('click', function () {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    });

    closePopupButton.addEventListener('click', function () {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    });

    // Cierra el popup si el usuario hace clic fuera del popup
    overlay.addEventListener('click', function () {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    });

});