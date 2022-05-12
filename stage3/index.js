'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

//Get all items in database
app.get("/getList", async (req,res) => {
  console.log("GET request for list of videos")
  let vid_list = await dumpTable();
  console.log("Database List:", vid_list)
  res.json(vid_list);
});

///get request for getTwoVideos
app.get("/getTwoVideos", async function(req, res) {
  try {
    let randint1 = getRandomInt(8);
    let randint2 = getRandomInt(8);
    while (randint1 == randint2){  //To make sure both numbers aren't the same
      randint2 = getRandomInt(8);
    }
    console.log("getting two videos", randint1, randint2);    
    
    let vid1 = await get_from_database(randint1);
    let vid2 = await get_from_database(randint2);
    let array = [vid1, vid2];
    array = JSON.stringify(array);

    console.log("sending back two vids:", array);
    res.json(array);
  }
  catch(err) {
    res.status(500).send(err);
  }
});


app.post("/insertPref", async (req, res) => {
  console.log("sending Response post insertPref");
  console.log("Contained Data:", req.body);

  const tableContents = await dumpPrefTable();
  console.log(tableContents.length);
  
  if (tableContents.length < 15) {
    console.log("Uploading stats to prefTable,", 15-tableContents.length, "prefs left now.");
    await upload_preftable(req.body);
    res.send("continue");
  }

  else {
    console.log("There are 15 preferences already");
    res.send("pick winner");
  }

});


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8,false);

  let data = await get_from_database_rowid(winner);

  // you'll need to send back a more meaningful response here.
  console.log("Sending back:", data);
  res.json(data);
  } catch(err) {
    res.status(500).send(err);
  }
});


// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});


async function get_from_database_rowid(rowid){
  try {
    let cmd = "SELECT * FROM VideoTable WHERE rowIdNum=?;";
    let result = await db.get(cmd, [rowid]);
    return result;
  }
  catch (error) {
    console.log("Error", error)
    return null;
  }
};


async function get_from_database(position){
  try{
    //this command gets the position in the database, not the rowid
    let cmd = "SELECT * FROM VideoTable ORDER BY rowid LIMIT ?,1";
   
    let result = await db.get(cmd, [position]);
    return result;
  }
  catch(error){
    console.log("Error", error)
    return null;
  }
};

async function dumpTable() {
  const sql = "select * from VideoTable"
  
  let result = await db.all(sql);
  return result;
};

async function dumpPrefTable() {
  const sql = "select * from PrefTable"
  
  let result = await db.all(sql);
  return result;
};


async function upload_preftable(stats) {
  
  let sql = "insert into PrefTable (better, worse) values (?, ?);";
  await db.run(sql, [stats.better, stats.worse]);
  console.log(stats.better, stats.worse);
};