# voice-cert-demo
Nexmo Demo Project

Create an application on the Nexmo portal. 

Generate a private key and download it. 

Place the private key in the root directory. 

Take note of the application_id.

Update the .env file. 
Insert values for 
  API_KEY, 
  API_SECRET,
  APPLICATION_ID, 
  VIRTUAL_NUMBER,
  TO_NUMBER. 

Install npm modules (from the root of the project)

npm install

To start the server (from the rootthis project)

node ivr.js

Run ngrok application. Listen to port 3000

ngrok http 3000


Update the webhook url in your account setting for the above application.

EVENT URL

https://187d1c44.ngrok.io/webhooks/events

ANSWER URL

https://187d1c44.ngrok.io/webhooks/answer



After the application start 

**** Hearing the current time and date ****

1) Dial to your VIRTUAL.NUMBER that you have stored in the .env file.


**** Being transferred to another number that you own with a “we are now connecting you to an agent who will be able to help you” message ****

1) Press 1 to be redirected to the TO_NUMBER that you have stored in the .env file.

**** Listening to an audio file of your choice ****

1) Dial to your VIRTUAL.NUMBER that you have stored in the .env file.

2) Press 4 to hear a sample mp3 audio file.
