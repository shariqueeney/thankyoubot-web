const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  //console.log('req is ' + JSON.stringify(req.body));
  const original = req.body.text;

  // check for @name and bold it if exists
  /* if (original.indexOf('@') !== -1) {
    var messageBody = original.split(' ');
    for (var i = 0; i < messageBody.length; i++) {
      if (messageBody[i].includes('@')) {
        thankYouName = messageBody[i];
      }
    }
  } */

  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin
    .database()
    .ref('/messages')
    .push({
      original: original,
      status: '',
      submitter: req.body.user_name,
      //thank_you_name: thankYouName,
    })
    .then(snapshot => {
      res.send(req.body.user_name + ' your thank you message has been received!');
    });
});
