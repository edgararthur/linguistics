const members = document.querySelector('.members');
const events = document.querySelector('.events')
const option = document.createElement("option");

option.classList.add("custom-option");
const customCountryCodeSelect = document.getElementById("country-code");

events.addEventListener('click', e => {
    console.log("hello world")
    document.querySelector(".event__card").classList.toggle('visibility')
})

members.addEventListener('click', (e) => {
    document.querySelector(".membership__card").classList.toggle('visibility')
    console.log("hello world")
})

fetch('https://restcountries.com/v3.1/all')
.then(response => response.json())
.then(data => {
    data.forEach(country => {
        option.innerHTML = `<p style="{width: 100%}">+${country}</p>`
        // customCountryCodeSelect.appendChild(option);
    })
});

// script.js
const imageContainer = document.querySelector('.hero');
const imageUrls = [
    'images/lag.JPG',
    'images/LAG_2023.jpg',
];

let currentIndex = 0;
let backgroundPosition = 0;

function changeBackgroundImage() {
    currentIndex = (currentIndex + 1) % imageUrls.length;
    imageContainer.style.backgroundImage = `url('${imageUrls[currentIndex]}')`;

    backgroundPosition = 100;
    imageContainer.style.backgroundPosition = `0% ${backgroundPosition}%`;

    const interval = setInterval(() => {
        backgroundPosition--;
        imageContainer.style.backgroundPosition = `0% ${backgroundPosition}%`;
        if (backgroundPosition === 0) {
            clearInterval(interval);
        }
    }, 50);

    // imageContainer.classList.add("")
}

// Initial background image
changeBackgroundImage();
setInterval(changeBackgroundImage, 7000);

const links = document.querySelector('a');
links.addEventListener('click', (e) => {
    console.log("hello world")
})

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

