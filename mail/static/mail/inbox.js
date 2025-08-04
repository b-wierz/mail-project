document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  const submitForm = document.getElementById('compose-form');

  submitForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let sendRecipients = document.querySelector('#compose-recipients').value;

    let sendSubject = document.querySelector('#compose-subject').value;

    let sendBody = document.querySelector('#compose-body').value;

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: sendRecipients,
        subject: sendSubject,
        body: sendBody,
        archived: false
      })
    })
    .then(response => response.json())
    .then(result => {
      load_mailbox('sent');
    });
  
  })
  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === 'inbox') {
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      displayInbox(emails);
    });
  };

  if (mailbox === 'sent') {
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
      displaySent(emails);
    });
  };

  if (mailbox === 'archive') {
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
      displayArchive(emails);
    });
  };
}

function displayInbox(emails) {

  // Show the email and hide other views
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  const inboxContainer = document.getElementById('emails-view');

  emails.forEach(email => {

    if (email.archived === true) {
      return;
    };

    const emailDiv = document.createElement('div');
    emailDiv.classList.add('mailbox-view');
    emailDiv.dataset.id = email.id;

    if (email.read === true) {
      emailDiv.style.backgroundColor = 'lightgray';
    };

    emailDiv.addEventListener('click', () => {
      fetch(`/emails/${email.id}`)
      .then(response => response.json())
      .then(email => {
        displayEmail(email);
      });
    });

    const timeElement = document.createElement('p');
    timeElement.textContent = email.timestamp;

    const senderElement = document.createElement('p');
    senderElement.textContent = 'From: ' + email.sender;

    const subjectElement = document.createElement('p');
    subjectElement.textContent = 'Subject: ' + email.subject;

    //const bodyElement = document.createElement('p');
    //bodyElement.id = 'single-line'
    //bodyElement.textContent = email.body;

    emailDiv.appendChild(timeElement);
    emailDiv.appendChild(senderElement);
    emailDiv.appendChild(subjectElement);
    //emailDiv.appendChild(bodyElement);
    inboxContainer.appendChild(emailDiv);

  });

}

function displaySent(emails) {

  // Show the email and hide other views
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  console.log('loading sent');

  const sentEmailContainer = document.getElementById('emails-view');

  emails.forEach(email => {
    
    const sentEmailDiv = document.createElement('div');
    sentEmailDiv.classList.add('mailbox-view');
    sentEmailDiv.dataset.id = email.id;

    sentEmailDiv.addEventListener('click', () => {
      fetch(`/emails/${email.id}`)
      .then(response => response.json())
      .then(email => {
        displayEmail(email);
      });
    });
    
    const timeElement = document.createElement('p');
    timeElement.textContent = email.timestamp;

    const recipientsElement = document.createElement('p');
    recipientsElement.textContent = 'To: ' + email.recipients;

    const subjectElement = document.createElement('p');
    subjectElement.textContent = 'Subject: ' + email.subject;

    //const bodyElement = document.createElement('p');
    //bodyElement.id = 'single-line'
    //bodyElement.textContent = email.body;

    sentEmailDiv.appendChild(timeElement);
    sentEmailDiv.appendChild(subjectElement);
    sentEmailDiv.appendChild(recipientsElement);
    //sentEmailDiv.appendChild(bodyElement);
    sentEmailContainer.appendChild(sentEmailDiv);
  });

}

function displayArchive(emails) {

  // Show the email and hide other views
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  const archiveContainer = document.getElementById('emails-view');

  emails.forEach(email => {

    const emailDiv = document.createElement('div');
    emailDiv.classList.add('mailbox-view');
    emailDiv.dataset.id = email.id;

    emailDiv.addEventListener('click', () => {
      fetch(`/emails/${email.id}`)
      .then(response => response.json())
      .then(email => {
        displayEmail(email);
      });
    });
    
    const timeElement = document.createElement('p');
    timeElement.textContent = email.timestamp;

    const senderElement = document.createElement('p');
    senderElement.textContent = 'From: ' + email.sender;

    const subjectElement = document.createElement('p');
    subjectElement.textContent = 'Subject: ' + email.subject;

    //const bodyElement = document.createElement('p');
    //bodyElement.id = 'single-line'
    //bodyElement.textContent = email.body;

    emailDiv.appendChild(timeElement);
    emailDiv.appendChild(senderElement);
    emailDiv.appendChild(subjectElement);
    //emailDiv.appendChild(bodyElement);
    archiveContainer.appendChild(emailDiv);

  });

}

function displayEmail(email) {

  // Show the email and hide other views
  document.querySelector('#single-email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Mark as read
  if (email.read === false) {
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true    
      })
    })
    //email.archived = true; 
    email.read = true;
  };

  const emailContainer = document.getElementById('single-email-view');
  emailContainer.innerHTML = '';  
  
  const subjectElement = document.createElement('h5');
  subjectElement.textContent = 'Subject: ' + email.subject;

  const senderElement = document.createElement('p');
  senderElement.textContent = 'From: ' + email.sender;

  const timeElement = document.createElement('p');
  timeElement.textContent = email.timestamp;

  const bodyElement = document.createElement('p');
  bodyElement.textContent = email.body;

  const archiveToggleBtn = document.createElement('button');
  if (email.archived === true) {
    archiveToggleBtn.textContent = 'UNARCHIVE';
  } else {
    archiveToggleBtn.textContent = 'ARCHIVE';
  };

  archiveToggleBtn.addEventListener('click', () => {

    if (email.archived === false) {  
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: true    
        })
      })
      .then(() => load_mailbox('inbox'));
      //.then(emails => {
      //  email.archived = true
      //  fetch('/emails/inbox')
      //  .then(response => response.json())
      //  .then(emails => {
      //    displayInbox(emails);
      //  })
      //})

    } else {  // If archived: true
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: false    
        })
      })
      .then(() => load_mailbox('inbox'));
      //.then(emails => {
      //  email.archived = false
      //  fetch('/emails/inbox')
      //  .then(response => response.json())
      //  .then(emails => {
      //    displayInbox(emails);
      //  })
      //}); 
    };
  });


  const replyBtn = document.createElement('button');
  replyBtn.textContent = 'REPLY';
  replyBtn.addEventListener('click', () => composeReply(email));

  emailContainer.appendChild(subjectElement);
  emailContainer.appendChild(senderElement);
  emailContainer.appendChild(timeElement);
  emailContainer.appendChild(bodyElement);
  emailContainer.appendChild(archiveToggleBtn);

  const user = document.querySelector('h2').innerHTML;
  if (user !== email.sender) {
    emailContainer.appendChild(replyBtn);
  };

}

function composeReply(email) {
  
  // Show compose view and hide other views
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Prefill composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = 'Re: ' + email.subject;
  document.querySelector('#compose-body').value = 'On ' + email.timestamp + ' ' + email.sender + ' wrote: ' + email.body;

  const submitForm = document.getElementById('compose-form');

  submitForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let sendRecipients = document.querySelector('#compose-recipients').value;
    console.log(sendRecipients); // DEBUG

    let sendSubject = document.querySelector('#compose-subject').value;
    console.log(sendSubject); // DEBUG

    let sendBody = document.querySelector('#compose-body').value;
    console.log(sendBody); // DEBUG

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: sendRecipients,
        subject: sendSubject,
        body: sendBody
      })
    })
    .then(response => response.json())
    .then(result => {
      load_mailbox('sent');
    });
  
  })
  
}