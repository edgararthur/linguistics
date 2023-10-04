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

    sendEmail(name, email, message);
})

const handleSignIn = () => {
    gapi.load('client:auth2', initClient);
}

// {
//   "enableAutoReply": false,
//   "responseSubject": "",
//   "restrictToContacts": false
// }

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
function sendEmail(userName, userEmail, userMessage) {
    const message = {
        to: `${fromAddress}`,
        subject: `Message from LAG Website. ${userName}`,
        message: `${userMessage}`,
    };

    const fromAddress = 'bysschearthur123@gmail.com';
  
    gapi.client.gmail.users.messages.send({
        userId: 'me',
        resource: {
            raw: btoa(createEmail(message, userEmail)),
        },
    }).then((response) => {
        console.log(response);
    });
}
  
// Function to create a properly formatted email message
const createEmail = (message, fromAddress) => {
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