let button = document.getElementById("contButton");
button.addEventListener("click",buttonPress);

let myvid_button = document.getElementById("myvid");
myvid_button.addEventListener("click",myvid_buttonPress);



// given function that sends a post request
async function sendPostRequest(url,data) {
  params = {
    method: 'POST',
    //sets redirection to Json 
    headers: {'Content-Type': 'application/json'},
    body: data };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

function buttonPress() { 
    // Get all the user info.
  console.log("Getting the info from Submit a video")

  let username = document.getElementById("username").value;
  let URL = document.getElementById("tiktok_url").value;
  let nickname = document.getElementById("videoname").value;
  
  let tiktok_data = {"username": username,
                     "url": URL,
                     "nickname": nickname
                    };
  
  let data = JSON.stringify(tiktok_data);

  console.log(data);
  sendPostRequest("/videoData", data)
    //assignment 2 code
  .then( function (response) {
    // console.log("Response recieved", response);
    // sessionStorage.setItem("nickname", nickname);
    window.location = "videoViewer.html";
  })
  .catch( function(err) {
    console.log("POST request error",err);
  });

  
}

function myvid_buttonPress(){
  window.location = "myVideos.html";
}
