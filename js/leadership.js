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

})

const positionDiv = document.createElement('div');

fetch('https://linguisticsghana.azurewebsites.net/api/leadership/')
	.then(response => response.json())
	.then(data => {
		if (data.length > 0) {
			const execDiv = document.querySelector(".exec");

			// Create a container for past executives
			const pastExecContainer = document.createElement("div");
			pastExecContainer.classList.add("past__exec");

			// Keep track of past years to avoid creating multiple containers for the same year
			const pastYears = new Set();

			data.forEach(element => {
				const positionDiv = document.createElement("div");
				positionDiv.classList.add("prez", "cardo");

				const dataDisplay = `
					<h3>${element.postion}</h3>
					<img src="${element.image}" alt="">
					<h4>${element.name}</h4>
				`;

				positionDiv.innerHTML = dataDisplay;

				// Check if the date part of the element's date is the current or previous year
				const elementYear = new Date(element.year).getFullYear();
				if (elementYear === new Date().getFullYear()) {
					execDiv.appendChild(positionDiv);
				} else if (elementYear === new Date().getFullYear() - 1) {
					const prevYearDiv = document.querySelector(".prev-year");
					if (!prevYearDiv) {
						const prevYearContainer = document.createElement("div");
						prevYearContainer.classList.add("prev-year");
						execDiv.appendChild(prevYearContainer);
					}
					document.querySelector(".past__commitee").appendChild(positionDiv);
				} else {
					// Check if a container for the past year already exists
					if (!pastYears.has(elementYear)) {
						const pastYearContainer = document.createElement("div");
						pastYearContainer.classList.add("past__year");
						pastYearContainer.innerHTML = `<h2>Past Executive ${elementYear}</h2>`;
						pastExecContainer.appendChild(pastYearContainer);
						pastYears.add(elementYear);
					}

					// Append the positionDiv to the specific past year container
					document.querySelector(`.past__year[data-year="${elementYear}"]`).appendChild(positionDiv);
				}
			});

			// Append the pastExecContainer to the execDiv
			execDiv.appendChild(pastExecContainer);
		}
		console.log(data);
	})
	.catch(error => {
		console.log(error)
	});