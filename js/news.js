const members = document.querySelector('.members');
const events = document.querySelector('.events');
const customCountryCodeSelect = document.getElementById("country-code");
const imageContainer = document.querySelector('.desc');
const news = document.querySelector('.news__list');
const links = document.querySelectorAll('a');
const bar = document.querySelector('.fa-bars');
const closeBtn = document.querySelector('.fa-close');

const collabHead = document.createElement('div')
const collabItem = document.querySelector('.collab__item');

const imageUrls = ['images/lag.JPG', 'images/LAG_2023.jpg'];
let currentIndex = 0;

// Event Listeners
events.addEventListener('click', () => {
	toggleVisibility(".event__card");
});

members.addEventListener('click', () => {
	toggleVisibility(".membership__card");
});

links.forEach(link => {
  link.addEventListener('click', () => {
	  console.log("hello world");
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

fetch('https://linguisticsghana.azurewebsites.net/api/collaborations/')
	.then(response => response.json())
	.then(data => {
		if (data.length > 0) {
			data.forEach(element => {
				const collabHead = document.createElement('div');
				const collabData = `
					<h2>${element.title}</h2>
					<p>${element.description}</p>
					<a href='${element.link}'>${element.link}</a>
					<h4>${element.team}</h4>
				`;
				collabHead.innerHTML = collabData;
				collabItem.appendChild(collabHead);

				collabHead.classList.add('collab__head')
			});
		} else {
			const collabHead = document.createElement('div');
			const h3 = `<h3>Sorry, No Collaborations Available</h3>`;
			collabHead.innerHTML = h3;
			collabItem.appendChild(collabHead);

			collabItem.classList.remove('collab__item')

			collabItem.classList.remove('collabo__item')
		}
	})
	.catch(error => {
		return error;
	});





