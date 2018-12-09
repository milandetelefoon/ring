var express = require('express');
var router = express.Router();
const accountSid = 'AC91d0f271d9f94026c82891daeb2c5b8a';
const authToken = '632ee95f77b2384e0fc2c2819db8420b';
const client = require('twilio')(accountSid, authToken);
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const {Wit, log} = require('node-wit');
const clientWit = new Wit({accessToken: 'EXUFVOSDFZFKMHDTJFWDWKJZ7S6E3YZG'});
const _ = require('underscore');
const db = require('monk')('mongodb://milanpasschier:detering1@ds119395.mlab.com:19395/ring');
const users = db.get('users');
var PhoneNumber = require('awesome-phonenumber');

/* GET home page. */
router.get('/', function(req, res, next) {
  
users.find({id: 'test'}).then((docs) => {
  
  docs.forEach(function(element) {
client.calls
  .create({
     url: 'https://milan-milandetelefoon623808.codeanyapp.com/outbound',
     to: element.phone_number,
     from: '+31852250154'})
  .then(call => console.log(call.sid))
  .done();

client.messages
  .create({
    body: 'Milan Passchier is gevallen. Dit is de locatie waar hij is gevallen https://goo.gl/maps/iWx1D8vsmuP2',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:' + element.phone_number
  })
  .then(message => console.log(message.sid))
  .done();
});

  
  
  
});
  
  res.render('index', { title: 'Express' });
});

router.post('/incoming', function(req, res, next) {
  
client.messages
  .create({
    body: 'Ik ben gebeld!',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+31634948646'
  })
  .then(message => console.log(message.sid))
  .done();

    const twiml = new VoiceResponse();

    twiml.say({
    voice: 'woman',
    language: 'nl-NL'
}, 'Jij wilt je ideeën echt realiseren. Binnen organisaties of in een eigen onderneming. Je bent ondernemend, nieuwsgierig en creatief. Je durft andere keuzes te maken. Jij hebt een brede blik op de wereld. Je wilt duurzame waarde creëren door innovatie. Dan is de opleiding Business Innovation iets voor jou.');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  
});

router.post('/outbound', function(req, res, next) {

    const twiml = new VoiceResponse();

    twiml.say({
    voice: 'woman',
    language: 'nl-NL'
}, 'Milan Passchier is gevallen bij Avans Hogeschool. De exacte locatie is verzonden via WhatsApp.');
const gather = twiml.gather({
    action: '/shawn',
    method: 'GET'
});
gather.say({
    voice: 'woman',
    language: 'nl-NL'
}, 'Druk op 1 om dit bericht nog eens te beluisteren en sluit af met een hekje.');
twiml.say('We hebben geen input ontvangen. Tot ziens.');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  
});

router.get('/shawn', function(req, res, next) {
  
const twiml = new VoiceResponse();
twiml.say({
    voice: 'woman',
    language: 'nl-NL'
}, 'Milan Passchier is gevallen bij Avans Hogeschool. De exacte locatie is verzonden via WhatsApp. Tot ziens.');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  
  });

router.post('/incoming/whatsapp', function(req, res, next) {
  
var message = req.body.Body;
var sender = req.body.From;
  
clientWit.message(req.body.Body, {})
.then((data) => {
  
  
    if (_.isEmpty(data.entities)) {

      client.messages
        .create({
          body: "Ik kan je bericht '" + message + "' nog niet begrijpen.",
          from: 'whatsapp:+14155238886',
          to: sender
        })
        .then(message => console.log(message.sid))
        .done();
      
    } else {
      
    if (typeof data.entities.contact !== 'undefined' && typeof data.entities.phone_number !== 'undefined') {
      
      users.findOne({contact: data.entities.contact['0'].value}, 'contact').then((doc) => {
       
        if (doc) {
          
          client.messages
            .create({
              body: data.entities.contact['0'].value + " is al toegevoegd als hulpverlener.",
              from: 'whatsapp:+14155238886',
              to: sender
            })
            .then(message => console.log(message.sid))
            .done();
          
        } else {
          
          var pn = new PhoneNumber(data.entities.phone_number['0'].value, 'NL');
          
          users.insert({id: 'test', contact: data.entities.contact['0'].value, phone_number: pn.a.number.e164});
          
          client.messages
            .create({
              body: data.entities.contact['0'].value + " is als hulpverlener toegevoegd met het telefoonnummer " + pn.a.number.e164 + ". Laat " + data.entities.contact['0'].value + " een WhatsApp-bericht sturen naar +14155238886 met de code 'join lemon-leopard' om de WhatsApp-alarmeringen te activeren.",
              from: 'whatsapp:+14155238886',
              to: sender
            })
            .then(message => console.log(message.sid))
            .done();
          
            var p1 = new Promise(function(resolve, reject) {
              resolve(users.count({id: 'test'}));
            });
                      p1.then(
                // Just log the message and a value
                function(val) {
                      client.messages
                        .create({
                          body: 'Er zijn nu ' + val + ' hulpverleners toegevoegd.',
                          from: 'whatsapp:+14155238886',
                          to: sender
                        })
                        .then(message => console.log(message.sid))
                        .done();
                });
          
        }
        
      })
        
    } else if (typeof data.entities.contact !== 'undefined') {
      
      if (data.entities.contact['0'].value === "hulpverleners" || data.entities.contact['0'].value === "Hulpverleners") {
        
        client.messages
          .create({
            body: "Dit zijn de hulpverleners",
            from: 'whatsapp:+14155238886',
            to: sender
          })
          .then(message => console.log(message.sid))
          .done();
        
  
users.find({id: 'test'}).then((docs) => {
  
  docs.forEach(function(element) {
    
    console.log(element);

client.messages
  .create({
    body: element.contact + ' ' + element.phone_number,
    from: 'whatsapp:+14155238886',
    to: sender
  })
  .then(message => console.log(message.sid))
  .done();
});

  
  
  
});
        
      } else {
        
        client.messages
          .create({
            body: "Ik kan je bericht '" + message + "' nog niet begrijpen.",
            from: 'whatsapp:+14155238886',
            to: sender
          })
          .then(message => console.log(message.sid))
          .done();
        
      }
      
    } else {
      
      client.messages
        .create({
          body: "Ik kan je bericht '" + message + "' nog niet begrijpen.",
          from: 'whatsapp:+14155238886',
          to: sender
        })
        .then(message => console.log(message.sid))
        .done();
      
    }
    
    }
  
  
  
    
  
})
.catch(console.error);
  
});

module.exports = router;
