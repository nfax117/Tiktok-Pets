x//add onclick for redirecting to submit video page
let addNewButton = document.getElementById("addnew");
addNewButton.onclick = function(){
  window.location = "tiktokpets.html";
};

let clear1 = document.getElementById("clear1");
let clear2 = document.getElementById("clear2");
let clear3 = document.getElementById("clear3");
let clear4 = document.getElementById("clear4");
let clear5 = document.getElementById("clear5");
let clear6 = document.getElementById("clear6");
let clear7 = document.getElementById("clear7");
let clear8 = document.getElementById("clear8");

//add event listeners that call delete entry and give it the corresponding row
clear1.addEventListener("click",function(){
  deleteEntry(1);
});
clear2.addEventListener("click",function(){
  deleteEntry(2);
});                  
clear3.addEventListener("click",function(){
  deleteEntry(3);
});
clear4.addEventListener("click",function(){
  deleteEntry(4);
});
clear5.addEventListener("click",function(){
  deleteEntry(5);
});
clear6.addEventListener("click",function(){
  deleteEntry(6);
});
clear7.addEventListener("click",function(){
  deleteEntry(7);
});
clear8.addEventListener("click",function(){
  deleteEntry(8);
});



let playGameButton = document.getElementById("playgame");

//Get request to get the list of vids
console.log("reached the get list request");
sendGetRequest("/getList")
  .then( function (response){
    //do something with the response, should be video URL
    listJson = JSON.parse(response);
    console.log("List Request response is:", listJson);

    //Change the button color and function depending if the list is full or not
    if (listJson.length >= 8){
      let addnew = document.getElementById("addnew");
      addnew.disabled = true;
      addnew.style.background = "rgba(238, 29, 82, 0.33)";
      alert("Database full, can only add 8 videos!");

    }
    else {
      let playgame = document.getElementById("playgame");
      playgame.style.background = "rgba(238, 29, 82, 0.33)";
      playgame.disabled = true;
    }
    
    for(i = 1; i < listJson.length+1; i++){
      let text = document.getElementById("upvid"+i);
      text.value = listJson[i-1].nickname;
      text.style.border = "thin solid rgba(0,0,0,0.3)";
    }
  })
  .catch( function(err) {
    console.log("GET request error",err);
  });

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
};


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

async function deleteEntry(rowNum){
  //delete row entry based on input order
  let rowJson = {"row": rowNum};
  let data = JSON.stringify(rowJson);
  
  sendPostRequest("/deleteEntry", data)
    .then( function (response) {
      //make a refresh
      location.reload();
    })
    .catch( function(err) {
      console.log("POST request error",err);
    });
}