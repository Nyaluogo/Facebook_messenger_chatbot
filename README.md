# Facebook_messenger_chatbot

#Requirements:
Node
Heroku server
Facebook page

<nl></nl>
  <h2>How to Install</h2>
  <ul>
    <li>Step 1: Install node on your computer</li>
    <li>Step 2: Download all the files in this repository.</li>
    <li>Step 3: Go to src/controllers/chatbotController.js</li>
  <p> Edit chatbotController.js</p>

  </ul>
  
  
<code>
  // Handles messages events
function handleMessage(sender_psid, received_message)
{
  let response;


  // Checks if the message contains text
  if (received_message.text)
  {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    
    //replace with your urls
    let bingiman_pic_url = "https://img.itch.zone/aW1nLzM1MzgwMDcuanBn/original/xFSb5J.jpg";
    let makumbusho_pic_url = "https://img.itch.zone/aW1nLzQyNjExODkucG5n/original/%2BWPKWe.png";
    
    response =
    {

      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
            "title": "BINGIMAN",//replace with your title
            "subtitle": "BINGIMAN is a twisted First person shooter for windows platform. ",//replace with your subtitle
            "image_url": bingiman_pic_url,
            "default_action": {
                "type": "web_url",
                "url": "https://nyabingi.itch.io/bingiman",//replace with your url
                // "messenger_extensions": TRUE,
                "webview_height_ratio": "tall"
              },
            "buttons": [
              {
                "type": "web_url",
                "url": "https://nyabingi.itch.io/bingiman",//replace with your url
                "title": "Download"//replace with your call to action
              },
              {
                "type": "web_url",
                "url": "https://www.youtube.com/watch?v=hJVsEws_va8&t=1s",//replace with your url
                "title": "Trailer"//replace with your title
              }
            ],
          },

          {
          "title": "MAKUMBUSHO",//replace with your title
          "subtitle": "Makumbusho is a virtual museum. ",//replace with your subtitle
          "image_url": makumbusho_pic_url,
          "default_action": {
              "type": "web_url",
              "url": "https://nyabingi.itch.io/makumbusho",//replace with your url
              // "messenger_extensions": TRUE,
              "webview_height_ratio": "tall"
            },
          "buttons": [
            {
              "type": "web_url",
              "url": "https://nyabingi.itch.io/makumbusho",//replace with your url
              "title": "Download"//replace with your call to action
            },
            {
              "type": "web_url",
              "url": "https://youtu.be/L9K8Toxt68c",//replace with your url
              "title": "Trailer"//replace with your title
            }
          ],
        },
        ]
        }
      }

    }
  } else if (received_message.attachments) {
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

  // Send the response message
  callSendAPI(sender_psid, response);
}

</code>
