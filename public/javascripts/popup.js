const openl = document.getElementById("openl")
const openr = document.getElementById("openr")

const modal_containerl = document.getElementById("popup_containerl")
const modal_containerr = document.getElementById("popup_containerr")

const close = document.getElementById("close")
const closer = document.getElementById("closer")

openl.addEventListener('click', () =>{
    modal_containerl.classList.add('show')
})

close.addEventListener('click', () =>{
    modal_containerl.classList.remove('show')
})



openr.addEventListener('click', () =>{
    modal_containerr.classList.add('show')
})

closer.addEventListener('click', () =>{
    modal_containerr.classList.remove('show')
})