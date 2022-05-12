async function sendPostRequest(url,data) {
  // console.log("about to send post request");
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

let contButton = document.getElementById('contButton');

contButton.onclick = function(){  
    // console.log("clicked")
    let username = document.getElementById("username").value;
    let url = document.getElementById('tiktok_url').value;
    let nickname = document.getElementById('videoname').value;
    let data = username + ";" + url + ";" + nickname;
    sendPostRequest('/videoData', data)
      .then(function(data) {
        // console.log("Data: ")
        // console.log(data)
        sessionStorage.setItem("form_info",data);
        window.location = "tiktok_submitpage.html";})
      .catch(function(error) {
        console.log("Error occurred:", error);
      });
};