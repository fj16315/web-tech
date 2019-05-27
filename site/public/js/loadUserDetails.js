function loadUserProfile() {

  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      a = JSON.parse(this.responseText);
      console.log(a);

      document.getElementById("titleUsername").innerHTML = a.username;
      document.getElementById("recipeNum").innerHTML = "Recipes: " + a.recipe_count;

    }
  };
  xmlhttp.open("GET","GetUserProfile",true);
  xmlhttp.send();
}
