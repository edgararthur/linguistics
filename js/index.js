// Variables
const members = document.querySelector('.members');
const events = document.querySelector('.events');
const customCountryCodeSelect = document.getElementById("country-code");
const imageContainer = document.querySelector('.desc');

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

	imageContainer.classList.add('slide-in')

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

const newsListItem = document.querySelector('.news__list__item');

// Fetch API for News
const news = document.querySelector('.news__body');
fetch('https://linguisticsghana.azurewebsites.net/api/news/')
	.then(response => response.json())
	.then(data => {
		data.forEach(element => {

			const date = new Date(element.pub_date).toDateString()

			const type = element.type

			const newsItem = document.createElement('div');
			newsItem.classList.add('news__item');
			const newsValue = `
				<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
					<div class="p-4 md:p-6">
						<div class="grid gap-4">

							<div class="space-y-2">
								<div class="flex items-center justify-between news__title">
									<h2 class="text-2xl">
										${element.title}
									</h2>
									<p>${element.type}</p>
								</div>
							</div>
								<img src="${element.image}" alt="" class="news__image" />
								<p class="news__content">
								${element.content}
								</p>
							<div>
							</div>
						</div>
					</div>
				<div class="date__more">
					<p class="date">${date}</p>
					<a class="font-medium underline hover:no-underline" href="#">
						Read More
					</a>
				</div>
			</div>
			`
			// const image = `<img src="${element.image}" alt=""></img>`
			// const newsType = `<h2>${element.content}</h2>`;
			// const h3 = `<h3>${element.content}</h3>`;
			// newsItem.classList.add('slide-in');

			setTimeout(() => {
				newsItem.innerHTML = newsValue
				news.append(newsItem)
			}, 5000);
		});
		// Trigger animation when element is added
		setTimeout(() => {
			// newsItem.classList.add('slide-in');
		}, 5000);
	})
	.catch(error => {
	console.error('Error fetching news:', error);
});
