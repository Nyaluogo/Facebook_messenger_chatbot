require("dotenv").config();
import request from "request";

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
console.log(MY_VERIFY_TOKEN);

let test = (req,res) => {
  return res.send("Amosou");
}

let getWebhook = (req,res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = MY_VERIFY_TOKEN

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }

}

let postWebhook = (req, res) => {

  let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
         let webhook_event = entry.messaging[0];
         console.log(webhook_event);


         // Get the sender PSID
         let sender_psid = webhook_event.sender.id;
         console.log('Sender PSID: ' + sender_psid);

         // Check if the event is a message or postback and
         // pass the event to the appropriate handler function
         if (webhook_event.message) {
           handleMessage(sender_psid, webhook_event.message);
         } else if (webhook_event.postback) {
           handlePostback(sender_psid, webhook_event.postback);
         }
      });

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }

}

// Handles messages events
function handleMessage(sender_psid, received_message)
{
  let response;

  // check greeting is here and is confident
 const greeting = firstTrait(received_message.nlp, 'wit$greetings');
 if (greeting && greeting.confidence > 0.8) {
   sendResponse('Chal Nadi!');
 } else {
   // default logic
   // Checks if the message contains text
   if (received_message.text)
   {
     // Create the payload for a basic text message, which
     let bingiman_pic_url = "https://img.itch.zone/aW1nLzM1MzgwMDcuanBn/original/xFSb5J.jpg";
     let makumbusho_pic_url = "https://img.itch.zone/aW1nLzQyNjExODkucG5n/original/%2BWPKWe.png";
     // will be added to the body of our request to the Send API
     response =
     {

       "attachment": {
         "type": "template",
         "payload": {
           "template_type": "generic",
           "elements": [
             {
             "title": "BINGIMAN",
             "subtitle": "BINGIMAN is a twisted First person shooter for windows platform. ",
             "image_url": bingiman_pic_url,
             "default_action": {
                 "type": "web_url",
                 "url": "https://nyabingi.itch.io/bingiman",
                 // "messenger_extensions": TRUE,
                 "webview_height_ratio": "tall"
               },
             "buttons": [
               {
                 "type": "web_url",
                 "url": "https://nyabingi.itch.io/bingiman",
                 "title": "Download"
               },
               {
                 "type": "web_url",
                 "url": "https://www.youtube.com/watch?v=hJVsEws_va8&t=1s",
                 "title": "Trailer"
               }
             ],
           },

           {
           "title": "MAKUMBUSHO",
           "subtitle": "Makumbusho is a virtual museum. ",
           "image_url": makumbusho_pic_url,
           "default_action": {
               "type": "web_url",
               "url": "https://nyabingi.itch.io/makumbusho",
               // "messenger_extensions": TRUE,
               "webview_height_ratio": "tall"
             },
           "buttons": [
             {
               "type": "web_url",
               "url": "https://nyabingi.itch.io/makumbusho",
               "title": "Download"
             },
             {
               "type": "web_url",
               "url": "https://youtu.be/L9K8Toxt68c",
               "title": "Trailer"
             }
           ],
         },
         ]
         }
       }

     }
   }else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  }
 }


  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'bingiman') {
    response = {
      "text": "Thanks!",
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "BINGIMAN",
            "subtitle": "BINGIMAN is a twisted First person shooter inspired by the classic titles like Doom and Quake with a fusion of East African aesthetic. ",
            "image_url": "https://img.itch.zone/aW1nLzM1MzgwMDcuanBn/original/xFSb5J.jpg",
            "buttons": [
              {
                "type": "postback",
                "title": "Download",
                "payload": "downloadBingi",
              },

            ],
          }]
        }
      }

     }
  } else if (payload === 'makumbusho') {
      response = {
        "text": "Thanks!",
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "MAKUMBUSHO",
              "subtitle": "A virtual museum prototype for Andela SDGChallenge. The aim of this project is to make art more accessible to the public during the pandemic as museums are closed by using 3D simulation technology.",
              "image_url": "https://img.itch.zone/aW1nLzQyNjExODkucG5n/original/%2BWPKWe.png",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Download",
                  "payload": "downloadMakumbusho",
                },

              ],
            }]
          }
        }

       }
    }else if (payload === 'fleshAndBone') {
        response = {
          "text": "Thanks!",
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "FLESH AND BONE",
                "subtitle": "A custom deck of cards",
                "image_url": "https://img.itch.zone/aW1nLzQyNjExODkucG5n/original/%2BWPKWe.png",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Download",
                    "payload": "downloadMakumbusho",
                  },

                ],
              }]
            }
          }

         }
      }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v7.0/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

module.exports = {
  test: test,
  getWebhook: getWebhook,
  postWebhook: postWebhook
}
