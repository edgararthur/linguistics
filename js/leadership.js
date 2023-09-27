const bar = document.querySelector('.fa-bars');
const close = document.querySelector('.fa-close')

bar.addEventListener('click', (e) => {
    document.querySelector('.links').classList.add('links__visibility');
    bar.style.display = 'none';
    close.style.display = 'block'
})

close.addEventListener('click', (e) => {
    document.querySelector('.links').classList.remove('links__visibility');
    bar.style.display = 'block';
    close.style.display = 'none'
})

document.querySelector('a').addEventListener('click', e => {
    console.log('hello');
})