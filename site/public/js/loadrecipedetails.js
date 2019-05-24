function loadRecipeDetails() {
  // if(str == ""){
  //   $('.loading').replaceWith('<h1 class=notLoading>Search for something!</h1>');
  // }
  // else{
    $('.notLoading').replaceWith('<div class=loading></div>');
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        //for length generate each article and put it in an element

        //Get all the elements and put them in a search result

        //replace the loading bar with these results
        $('.loading').replaceWith('<h1 class=notLoading>result for: a thing' +'</h1>');

        //Ingredients?

        //Method?
      }
    };
    xmlhttp.open("POST","getSearchResults" + "?q=test" + "&" + "vegan=true",true);
    xmlhttp.send();
  // }
}
