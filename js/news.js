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

const consultHead = document.createElement('div')
const consultItem = document.querySelector('.consult__item');

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

fetch('http://127.0.0.1:8000//api/collaborations/')
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

fetch('http://127.0.0.1:8000/api/consultants/')
	.then(response => response.json())
	.then(data => {
		if (data.length > 0) {
			data.forEach(element => {
				const consultHead = document.createElement('div');
				const consultData = `
					<h2>${element.name}</h2>
					<p>${element.type_of_consult}</p>
				`;
				consultHead.innerHTML = consultData;
				consultItem.appendChild(consultHead);

				consultHead.classList.add('collab__head')
			});
		} else {
			const consultHead = document.createElement('div');
			const h3 = `<h3>Sorry, No Consultants Available</h3>`;
			consultHead.innerHTML = h3;
			consultItem.appendChild(consultHead);

			consultItem.classList.remove('conllab__item')

			consultItem.classList.remove('collabo__item')
		}
	})
	.catch(error => {
		return error;
	});



