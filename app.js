const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

/***********************************************************************/

mailchimp.setConfig({
  apiKey: "32fdb75dddd794de97a79de7cc52a827-us14",
  server: "us14",
});
const listId = "72c6d840e7";
var subscribingUser = {
  firstName: "",
  lastName: "",
  email: ""
};

async function run(res) {
  try {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    res.sendFile(__dirname + "/success.html");
  } catch (e) {
    res.sendFile(__dirname + "/failure.html");
  }
}

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});
app.post("/",function(req,res){
  console.log(req.body);
  console.log("/*************************************/");
  console.log(res.body);
  subscribingUser.firstName = req.body.firstName;
  subscribingUser.lastName = req.body.lastName;
  subscribingUser.email = req.body.email;

  if(req.body.checkbox === "Checkbox"){
    console.log("Checkbox detected.");
  }

  run(res);
});


app.post("/success",function(req,res){
  res.redirect("/");
});


app.post("/failure",function(req,res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});
