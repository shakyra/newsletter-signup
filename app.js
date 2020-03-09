const express = require("express");
const request = require("request");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public")); // allows static files to be used
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName; // name of input
  const lastName = req.body.lName;
  const email = req.body.email;

  //console.log(firstName, lastName, email);  the form in signup.html needs an action and method in order to be posted/logged

  var data = {
    members: [
      { //parameter keys and values from mailchimp
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us19.api.mailchimp.com/3.0/lists/645378c5c5"; // endpoints are at mailchimp.com/developer
  const options = { //find options keys and values in the node.js docs + mailchimp.com/developer
    method: "POST",
    auth: "shakyra:3bebdd15fe675706c57cb5bfc6923cb5-us19"
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");;
    } else {
      res.sendFile(__dirname + "/failure.html");;
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/"); // redirect failure button to sign up page
});

app.listen(3000, function() {
  console.log("Listening on port 3000!")
});

//API Key
//3bebdd15fe675706c57cb5bfc6923cb5-us19

//Audience id
//645378c5c5