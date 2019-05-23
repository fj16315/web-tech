function loadRecipeDetails() {

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
      document.getElementById("name").innerHTML = this.responseText;
      document.getElementById("difficluty").innerHTML = this.responseText;
      document.getElementById("cookingTime").innerHTML = this.responseText;
      //Ingredients?

      //Method?
    }
  };
  xmlhttp.open("GET","GetUsername",true);
  xmlhttp.send();
}
