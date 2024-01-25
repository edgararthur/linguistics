// Variables
const members = document.querySelector('.members');
const events = document.querySelector('.events');
const customCountryCodeSelect = document.getElementById("country-code");
const imageContainer = document.querySelector('.desc');
const news = document.querySelector('.news__list');
const links = document.querySelectorAll('a');
const bar = document.querySelector('.fa-bars');
const closeBtn = document.querySelector('.fa-close');
const imageUrls = ['images/lag.JPG', 'images/LAG_2023.jpg'];
let currentIndex = 0;

// Functions
function toggleVisibility(elementSelector) {
	const element = document.querySelector(elementSelector);
	if (element) {
		element.classList.toggle('visibility');
	}
}

function changeBackgroundImage() {
	currentIndex = (currentIndex + 1) % imageUrls.length;
	imageContainer.style.backgroundImage = `url('${imageUrls[currentIndex]}')`;
	let backgroundPosition = 100;

	const interval = setInterval(() => {
		backgroundPosition--;
		imageContainer.style.backgroundPosition = `0% ${backgroundPosition}%`;
		if (backgroundPosition === 0) {
		clearInterval(interval);
		}
	}, 50);
}

function createOptionElement(country) {
	const option = document.createElement("option");
	option.classList.add("custom-option");
	option.innerHTML = `<p style="{width: 100%}">+${country}</p>`;
	return option;
}

// Event Listeners
events.addEventListener('click', () => {
  	toggleVisibility(".event__card");
});

members.addEventListener('click', () => {
  	toggleVisibility(".membership__card");
});

links.forEach(link => {
	link.addEventListener('click', () => {
	});
});

bar.addEventListener('click', () => {
	document.querySelector('.links').classList.add('links__visibility');
	bar.style.display = 'none';
	closeBtn.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
	document.querySelector('.links').classList.remove('links__visibility');
	bar.style.display = 'block';
	closeBtn.style.display = 'none';
});

// Initial background image
changeBackgroundImage();
setInterval(changeBackgroundImage, 8000);

// Fetch API for News
fetch('https://linguisticsghana.azurewebsites.net/api/news/')
	.then(response => response.json())
	.then(data => {
		data.forEach(element => {
			const newItem = document.createElement('div');
			newItem.classList.add('news__item');
			const image = `<img src="${element.image}" alt=""></img>`
			const h3 = `<h3>${element.content}</h3>`

			setTimeout(() => {
				newItem.innerHTML = image + h3
				news.appendChild(newItem)
			}, 5000);
		});
		// Trigger animation when element is added
		setTimeout(() => {
			news.classList.add('slide-in');
		}, 5000);
	})
	.catch(error => {
	console.error('Error fetching news:', error);
});
