const client_id = ""
const api_key = ""

const form = document.querySelector('form');

const scopes = ['https://www.googleapis.com/auth/gmail.send']

form.addEventListener('submit', (e) => {
    e.preventDefault();

  // Access form data and store it in variables
    const name = form.elements["username"].value;
    const email = form.elements["email"].value;
    const message = form.elements["message"].value;

    // Now, you can work with the form data as needed
    // console.log(name, email, message);
})

const handleSignIn = () => {
    gapi.load('client:auth2', initClient);
}

const initClient = () => {
    gapi.client.init({
        apiKey: api_key,
        clientId: client_id,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
        scope: scopes.join(' '),
    }).then(() => {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

// Function to send an email using the Gmail API
function sendEmail(formData) {
    const message = {
        to: 'recipient@example.com',
        subject: 'Your Subject',
        message: 'Your message content',
    };

    const fromAddress = 'bysschearthur123@gmail.com';
  
    gapi.client.gmail.users.messages.send({
        userId: 'test@gmail.com',
        resource: {
            raw: btoa(createEmail(message)),
        },
    }).then((response) => {
        console.log(response);
    });
}
  
// Function to create a properly formatted email message
const createEmail = (message) => {
    const emailContent = [
        `From: ${fromAddress}`
        `To: ${message.to}`,
        'Content-Type: text/plain; charset="UTF-8"',
        'MIME-Version: 1.0',
        `Subject: ${message.subject}`,
        '',
        message.message,
    ].join('\n');
    return emailContent;
}