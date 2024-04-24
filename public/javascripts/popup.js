const openl = document.getElementById("openl")
const modal_containerl = document.getElementById("popup_containerl")
const close = document.getElementById("close")


openl.addEventListener('click', () =>{
    modal_containerl.classList.add('show')
})

close.addEventListener('click', () =>{
    modal_containerl.classList.remove('show')
})
