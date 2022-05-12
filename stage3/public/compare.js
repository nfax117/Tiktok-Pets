let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
} // for loop

//Heart the video
let heart1 = heartButtons[0];
let heart2 = heartButtons[1];
heart1.addEventListener("click", function() {
  console.log("clicked the left heart");
  heart1.classList.remove("unloved");
  heart1.firstChild.classList.add("fas");
  heart2.classList.add("unloved");
  heart2.firstChild.classList.add("far");
})
heart2.addEventListener("click", function() {
  console.log("clicked the right heart");
  heart2.classList.remove("unloved");
  heart2.firstChild.classList.add("fas");
  heart1.classList.add("unloved");
  heart1.firstChild.classList.add("far");
})


//Uncommment to see what is in the database
// sendGetRequest("/getList")
//   .then( function (response){
//     //do something with the response, should be video URL
//     listJson = JSON.parse(response);
//     console.log("List Request response is:", listJson);
//   })
//   .catch( function(err) {
//     console.log("GET request error",err);
//   });


//Global variable for row id of two displayed tiktoks
let tiktok_rowid = [0, 0];

sendGetRequest("/getTwoVideos")
  .then(function(response){
    console.log("Sending get two vid request");
    myJson = JSON.parse(response);
    let tiktokurls = [myJson[0].url, myJson[1].url];
    let tiktoknames = [myJson[0].nickname, myJson[1].nickname];
    tiktok_rowid = [myJson[0].rowIdNum, myJson[1].rowIdNum];

    let textElmt = document.getElementsByClassName("videoName");

    console.log("Tiktok Urls:", tiktokurls);
  
    //adds the nickname to bottom of video
    textElmt[0].textContent = tiktoknames[0]
    textElmt[1].textContent = tiktoknames[1]
    
    for (let i=0; i<2; i++) {
      addVideo(tiktokurls[i],videoElmts[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();

  })
  .catch( function(err) {
    console.log("GET request error",err);
  });
  


//When the next button gets clicked
let nextButton = document.getElementById("nextbutton");
nextButton.addEventListener("click", async function() {
  console.log("clicked next");
  let data = await get_liked_vid();  //get the object data about stats
  // data = JSON.stringify(data);
  console.log("Data Object:", data);
  
  sendPostRequest("/insertPref", data)
    .then( function(response) {

      if (response === "continue") {
        document.location.reload(true);
      }
      else {
        window.location = "winner.html";
      }
    })
    .catch( function(err) {
      console.log("POST request error",err);
    });
  
});


async function get_rowid_list() {
  const sql = "select rowid from VideoTable;"
  let result = await db.all(sql);
  console.log("Row Ids:", result);
  return result;
}


async function get_liked_vid() {

  let liked = 0;
  let disliked = 0;
  
  if (heart1.classList.contains("unloved")) {  //the right tiktok is liked
    liked = tiktok_rowid[1];
    disliked = tiktok_rowid[0];
  }
  else {
    liked = tiktok_rowid[0];
    disliked = tiktok_rowid[1];
  }

  return {"better": liked, "worse": disliked};
}




// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.

// for (let i=0; i<2; i++) {
//       addVideo(urls[i],videoElmts[i]);
//     }
//     // load the videos after the names are pasted in! 
//     loadTheVideos();