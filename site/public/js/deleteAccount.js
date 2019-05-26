function deleteAccount(){
  if (confirm("are you sure you want to delete your account? This will also delete all of your recipes!")){
    console.log("account deleted!");
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Gubbins");
      }
    };
    xmlhttp.open("POST","deleteUser",true);
    xmlhttp.send();
  }
  else{
    console.log("Canceled account deletion");
  }
}
