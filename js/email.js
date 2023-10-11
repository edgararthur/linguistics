import { hideClientId, hideApiId, hideFromAddress } from '../config.js';

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

const form = document.querySelector('form');

const clientId = hideClientId;
const apiId = hideApiId;
const fromAddress = hideFromAddress

const scopes = ['https://www.googleapis.com/auth/gmail.send']

const handleEmail = (senderName, senderEmail, messageReceived) => {
	Email.send({
		Host: "smtp.gmail.com",
		Username: "Edward Arthur",
		Password: "breakfast@9",
		To: "bysschearthur123@gmail.com",
		From: senderEmail,
		Subject: "Message from LAG official Website",
		Body: messageReceived
	}).then(
		message => alert("message sent")
	)
}

form.addEventListener('submit', (e) => {
	e.preventDefault();

// Access form data and store it in variables
	const name = form.elements["username"].value;
	const email = form.elements["email"].value;
	const message = form.elements["message"].value;

	// sendEmail(name, email, message);
	handleEmail(name, email, message)
})

const handleSignIn = () => {
	gapi.load('client:auth2', initClient);
}

// {
//   "enableAutoReply": false,
//   "responseSubject": "",
//   "restrictToContacts": false
// }

// Function to send an email using the Gmail API
// Function to send an email using the Gmail API
async function sendEmail(userName, userEmail, userMessage) {
	try {
			// Ensure the Gmail API is loaded and initialized
			await initClient();
	
			const message = {
					to: hideFromAddress,
					subject: `Message from LAG Website. ${userName}`,
					message: `${userMessage}`,
			};
	
			// Send the email
			const response = await gapi.client.gmail.users.messages.send({
					userId: 'me',
					resource: {
					raw: btoa(createEmail(message, userEmail)),
					},
			});
	
			console.log(response);
	} catch (error) {
			console.error('Error sending email:', error);
	}
}
	

// Function to create a properly formatted email message
function createEmail(message, fromAddress) {
		const emailContent = [
			`From: ${fromAddress}`,
			`To: ${message.to}`,
			'Content-Type: text/plain; charset="UTF-8"',
			'MIME-Version: 1.0',
			`Subject: ${message.subject}`,
			'',
			message.message,
		].join('\n');
		return emailContent;
}
	
	// Initialize the Gmail API client
async function initClient() {
	try {
		// Load the Google API Client Library
		await new Promise((resolve) => gapi.load('client:auth2', resolve));

		// Initialize the client library and set up the API key, clientId, etc.
		await gapi.client.init({
			apiKey: hideApiId,
			clientId: hideClientId,
			discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
			scope: 'https://www.googleapis.com/auth/gmail.send',
		});

		// Listen for sign-in state changes
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
	} catch (error) {
		console.error('Error initializing Gmail API client:', error);
	}
}
	
	// Function to handle sign-in status changes
function updateSigninStatus(isSignedIn) {
	// Handle sign-in status changes if needed
}