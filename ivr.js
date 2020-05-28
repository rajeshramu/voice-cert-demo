require('dotenv').config();
const Nexmo = require('nexmo');
const app = require('express')();
const bodyParser = require('body-parser')
const origin_phone_number = process.env.VIRTUAL_NUMBER;
const sales_office_number = process.env.TO_NUMBER;
const moment = require('moment');
app.use(bodyParser.json())

var uuid ="";

//Add extra code that you create in this exercise here! 	
moment().format('dddd')
	
moment().format('MMMM Do YYYY')
	
moment().format('h:mm:ss')
const onInboundCall = (request, response) => {

    const ncco = [
        {
          action: 'talk',
          text: `Hello, welcome to the demo! Today's date is ${moment().format('MMMM Do YYYY')}, it's a ${moment().format('dddd')} and the time now is ${moment().format('h:mm:ss')}.
           To speak with an agent, press 1. For Customer support officer press 2. For the main office, press 3. To hear a preselected audio file, press 4. Followed by a HASH key.`,
          bargeIn: true
        },
        {
            action: 'input',
            eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/dtmf`],
            timeOut: 15,
            maxDigits: 1,
            submitOnHash: true
        }
      ]
      console.log(request.query.uuid)
      uuid = request.query.uuid;
      response.json(ncco)
}


const onInput = (request, response) => {
    const dtmf = request.body.dtmf
    var ncco;

    switch(dtmf){
        case "1":
            ncco = [
                {
                action: 'talk',
                text: `We are now connecting you to an agent who will be able to help up.`
                },
                {
                    action: 'connect',
                    from: origin_phone_number,
                    endpoint: 
                    [
                        {
                          "type": "phone",
                          "number": sales_office_number
                        }
                    ]

                }
            ]
            response.json(ncco)
            break;
        case "2":
            ncco = 
            [
                {
                    action: 'talk',
                    text: 'You have asked to speak with customer service, please input your 5 digit account number followed by the HASH key.',
                    bargeIn: true
                },
                {
                    action: 'input',
                    eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/accountInput`],
                    timeOut: 20,
                    maxDigits: 5,
                    submitOnHash: true
                }
            ]
            response.json(ncco)
            break;
        case "3":
            ncco =
            [
                {
                    action: 'talk',
                    text: 'You have asked to speak with the main office. Unfortunately no one from the main office is currently available. Please leave a message after the tone.'
                },
                {
                    action: 'record',
                    beepStart: true,
                    eventUrl: [`${request.protocol}://${request.get('host')}/webhooks/recordingFinished`],
                    endOnSilence: 3
                }
            ]
            response.json(ncco)
            break;
        case "4":
            ncco =
            [
                {
                    action: 'talk',
                    text: 'You have selected number 4. We will play you a MP3 tone.'
                },
                {
                    action: "stream",
                    streamUrl: ["https://nexmo-community.github.io/ncco-examples/assets/voice_api_audio_streaming.mp3"]
                }
            ]
            response.json(ncco)
            break;
        default:
            ncco = [
                {
                    action: 'talk',
                    text: 'Sorry I did not catch your input please try again bye'
                }
            ];
            response.json(ncco);
            break;
    }
}

const onEvent =(request, response) =>{
    response.status(200).send();
}

const onAccountInput =(request, response) =>{
    const dtmf = request.body.dtmf
    const input = dtmf.split('').join(' ');
    const ncco = 
    [
        {
            action: 'talk',
            text: 'Your account number is: ' + input + ' your case has been added and is being actively triaged. You will be contacted with an update to your case in 24 hours'
        }
    ];
    response.json(ncco);
    response.status(200).send();
  }


const nexmo = new Nexmo({
apiKey: process.env.API_KEY,
apiSecret: process.env.API_SECRET,
applicationId: process.env.APPLICATION_ID,
privateKey: process.env.PRIVATE_KEY_PATH
})
  

const onRecordingFinished = (request, response) =>{
    console.log(request.body.recording_url)
    nexmo.files.save(request.body.recording_url,'test.mp3',(err, res) => {
        if(err) { console.error(err); }
        else {
            console.log(res);
        }
        });

    response.status(200).send();
}

app
  .get('/webhooks/answer', onInboundCall)
  .post('/webhooks/dtmf', onInput)
  .post('/webhooks/events', onEvent)
  .post('/webhooks/accountInput', onAccountInput)
  .post('/webhooks/recordingFinished', onRecordingFinished)

app.listen(3000)