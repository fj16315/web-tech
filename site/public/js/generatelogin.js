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
      if(this.responseText == "true"){
        console.log("logged in!");
        $(".signup").replaceWith('<li><a href="/profile.html"><span class="glyphicon glyphicon-user"></span>profile</a></li>');
        $(".login").replaceWith('<li><a href="/logout"><span class="glyphicon glyphicon-log-out"></span>logout</a></li>');
        console.log("Should've changed");
      }
      else {
        console.log("not logged in!");
      }
      // document.getElementById("titleUsername").innerHTML = this.responseText;
    }
  };
  xmlhttp.open("GET","isLoggedIn",true);
  xmlhttp.send();
}
