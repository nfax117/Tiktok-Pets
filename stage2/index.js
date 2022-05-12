//There is no starter code for TikTokPets-2, but you can copy either your code, or the solution we distribute, for TikTokPets-1 here to get started.
"use strict"
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");
// gets data out of HTTP request body and attaches it to the request object
const bodyParser = require('body-parser');
//set up the database
const db = require('./sqlWrap');
// create object to interface with express
const app = express();
// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})
app.use(bodyParser.json());
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myVideos.html");
});

//Version old Code

app.post("/videoData", async (req, res) => {
  console.log("sending Response post video data");
  //recieve the data from the button.js post request and parse it out, check if we can upload it to the DB, if so then we do
  console.log("It contained this string:",req.body);

  await upload_database(req.body);
  return res.send('received POST');
});

app.post("/deleteEntry", async (req, res) => {
  console.log("sending Response post deleteEntry");
  await delete_from_database(req.body.row);
  return res.send('received POST');
});

//Selecting the most recent added video. 
app.get("/getMostRecent", async (req,res) => {
  // let cmd = "SELECT LAST * FROM VideoTable;";
  let cmd = "SELECT * FROM VideoTable WHERE flag=1;";
  let last_entry = await get_from_database(cmd);
  
  console.log("Sending back most recent url:", last_entry);
  res.json(last_entry);
});


//Getting a list of videos in the database
app.get("/getList", async (req,res) => {
  console.log("GET request for list of videos")
  let vid_list = await dumpTable();
  console.log("Database List:", vid_list)
  res.json(vid_list);
});



// Need to add response if page not found!
app.use(function(req, res) {
  console.log("send 404 response")
  res.status(404); res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});

//********Data Base Operations********
//Function to get insert data
async function upload_database(tiktok_data) {

  const tableContents = await dumpTable();
  console.log(tableContents.length);
  
  if (tableContents.length < 8) {
    console.log("Room in the database")

    let sql  = "UPDATE VideoTable SET flag=0 WHERE flag=1;";
    await db.run(sql);
    
    console.log("Uploading data to database,", 8-tableContents.length, "left now.");
    sql = "insert into VideoTable (userid, url, nickname, flag) values (?,?,?,TRUE);";
    //console.log("username",tiktok_data.username);
    await db.run(sql, [tiktok_data.username, tiktok_data.url, tiktok_data.nickname]);  
  }

  else {
    console.log("Database is full");
    alert("Database full, can only add 8 videos!");
  }
  
};

//Function to get from database
async function get_from_database(cmd){
  try {
    let result = await db.get(cmd);
    return result;
  }
  catch (error) {
    console.log("Error", error)
    return null;
  }
};

//Function to get all contents out of database, should me max 8 rows
async function dumpTable() {
  const sql = "select * from VideoTable"
  
  let result = await db.all(sql)
  return result;
}

//function that will delete contents from the database given position (position is the spot it is on the my videos page)
async function delete_from_database(position){
  try{
    let cmd = "DELETE FROM VideoTable WHERE rowid = ?;";
    await db.run(cmd, [position]);
    await db.run("VACUUM;");
  }
  catch(error){
    console.log("Error", error)
    return null;
  }
};
