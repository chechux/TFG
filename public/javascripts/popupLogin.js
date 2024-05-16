document.addEventListener('DOMContentLoaded', function () {
    const openPopupButton = document.getElementById('login');
    const closePopupButton = document.getElementById('close');
    const popup = document.getElementById('popup');
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


document.addEventListener('DOMContentLoaded', function () {
    const openPopupButtonr = document.getElementById('register');
    const closePopupButtonr = document.getElementById('closer');
    const popup2 = document.getElementById('popup2');
    const overlay2 = document.getElementById('overlay');

    

    openPopupButtonr.addEventListener('click', function () {
        popup2.style.display = 'block';
        overlay2.style.display = 'block';
    });

    closePopupButtonr.addEventListener('click', function () {
        popup2.style.display = 'none';
        overlay2.style.display = 'none';
    });

    // Cierra el popup si el usuario hace clic fuera del popup
    overlay2.addEventListener('click', function () {
        popup2.style.display = 'none';
        overlay2.style.display = 'none';
    });
});


