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

