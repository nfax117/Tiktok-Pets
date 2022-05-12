//set text to html element holding success message
const text = document.getElementById("video_nickname");

//extract our form info from local storage
let info = sessionStorage.getItem("form_info");

//split the sent post data by ";"
let data_array = info.split(";");

let nickname = data_array[2];

//replace the text "Bob the supercat" from html with nickname variable
let msg = text.textContent;
msg = msg.replace("Bob the supercat", nickname);
text.textContent = msg;

//When the continue button is clicked, return to main webpage
let contButton = document.getElementById('contButton');
contButton.onclick = function(){  
    console.log("clicked");
    window.location = "tiktok_webpage.html";
};