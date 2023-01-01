events.addEventListener('click', e => {
    document.querySelector(".event__card").classList.toggle('visibility')
})

members.addEventListener('click', (e) => {
    document.querySelector(".membership__card").classList.toggle('visibility')
})