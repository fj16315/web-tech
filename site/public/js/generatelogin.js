function changelogin(){
  //Check if it's logged in
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // if it is change the text and links of the HTML
      console.log(this.responseText);
      // document.getElementById("titleUsername").innerHTML = this.responseText;
    }
  };
  xmlhttp.open("GET","isLoggedIn",true);
  xmlhttp.send();


}
