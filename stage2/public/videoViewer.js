// This viewer takes a TikTok video URL and displays it in a nice magenta box, and gives it a reload button in case you want to watch it again. 

let myVideos = document.getElementById("continue");
myVideos.addEventListener("click",contentButton);


//function that sends a get a request
async function sendGetRequest(url){
  params = {
    method: 'GET',
    //sets redirection to Json 
    headers: {'Content-Type': 'application/json'}
    };
  console.log("about to send get request");
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
};

//Get request to get the most recent video sent
console.log("reached the get request");
sendGetRequest("/getMostRecent")
  .then( function (response){
    //do something with the response, should be video URL
    myJson = JSON.parse(response);
    let tiktokurl = myJson.url;
   
    console.log("Response is:", tiktokurl);

    //Call the addVideo function that is below
    let divElmt = document.getElementById("tiktokDiv");
    let textElmt = document.getElementById("videoName");
    let reloadButton = document.getElementById("reload");
    //fills in p for nickname of video
    textElmt.textContent = tiktokname;

      // add the blockquote element that TikTok wants to load the video into 
    console.log("Adding video");
    addVideo(tiktokurl, divElmt);
    
    reloadButton.addEventListener("click", function(){
      reloadVideo(tiktokurl, divElmt)
    });

    // on start-up, load the videos
    loadTheVideos();
    
  })
  .catch( function(err) {
    console.log("GET request error",err);
  });


// Add the blockquote element that tiktok will load the video into
async function addVideo(tiktokurl,divElmt) {

  let videoNumber = tiktokurl.split("video/")[1];

  let block = document.createElement('blockquote');
  block.className = "tiktok-embed";
  block.cite = tiktokurl;
  // have to be formal for attribute with dashes
  block.setAttribute("data-video-id",videoNumber);
  block.style = "width: 325px; height: 563px;"

  let section = document.createElement('section');
  block.appendChild(section);
  
  divElmt.appendChild(block);
}

// Ye olde JSONP trick; to run the script, attach it to the body
function loadTheVideos() {
  body = document.body;
  script = newTikTokScript();
  body.appendChild(script);
}

// makes a script node which loads the TikTok embed script
function newTikTokScript() {
  let script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js"
  script.id = "tiktokScript"
  return script;
}

// the reload button; takes out the blockquote and the scripts, and puts it all back in again.
// the browser thinks it's a new video and reloads it
function reloadVideo(tiktokurl, divElmt) {
  
  // get the two blockquotes
  let blockquotes = document.getElementsByClassName("tiktok-embed");

  // and remove the indicated one
    block = blockquotes[0];
    console.log("block",block);
    let parent = block.parentNode;
    parent.removeChild(block);

  // remove both the script we put in and the
  // one tiktok adds in
  let script1 = document.getElementById("tiktokScript");
  let script2 = script.nextElementSibling;
  console.log(script2);
  let body = document.body; 
  body.removeChild(script1);
  body.removeChild(script2);

  addVideo(tiktokurl,divElmt);
  loadTheVideos();
}

//Rediects to myVideos content
function contentButton(){
  window.location = "/myVideos.html";
}