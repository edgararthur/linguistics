const members = document.querySelector('.members');
const events = document.querySelector('.events')
const option = document.createElement("option");
option.classList.add("custom-option");
const customCountryCodeSelect = document.getElementById("country-code");

// members.addEventListener('click', e => {
//     document.querySelector(".event__card").classList.toggle('visibility')
// })

events.addEventListener('click', e => {
    document.querySelector(".event__card").classList.toggle('visibility')
})

fetch('https://restcountries.com/v3.1/all')
.then(response => response.json())
.then(data => {
    data.map(country => {
        console.log(country)
        option.innerHTML = `<p style="{width: 100%}">+${country.ccn3}</p>`
        customCountryCodeSelect.append(option);
    })
});

// script.js
const imageContainer = document.querySelector('.image-container');
const imageUrls = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg'
];

let currentIndex = 0;

function changeBackgroundImage() {
    currentIndex = (currentIndex + 1) % imageUrls.length;
    imageContainer.style.backgroundImage = `url('${imageUrls[currentIndex]}')`;
}

// Initial background image
changeBackgroundImage();
setInterval(changeBackgroundImage, 5000); // Change background every 5 seconds


