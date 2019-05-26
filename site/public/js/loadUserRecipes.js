function loadUserRecipes(){
  $('#notloading').replaceWith('<div id="loading"></div>')
  //Click recipes tag, get this request
  console.log("loading users recipes");

  //Make the request, load the results
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //for length generate each article and put it in an element

      //Get json object from this this.response.jsonobject
      let a = JSON.parse(this.responseText);
      console.log(a);

      //update saving term
      $('#loading').replaceWith('<div id="notloading" class="col-xs-12"><ul id="results"></ul></div>');
      //Get all the elements and put them in a search result

      //replace the results with no results!
      if(a.length == 0){
        $('#results').append('<p>No results!</p>');
      }
      else{
        //foreach(recipe in response );
        for(let i = 0; i<a.length; i++){
        // $('#results').append('<h1> Wow! </h1>');
        $('#results').append('<li><article class="search-result row"><div class="col-xs-12 col-sm-4"><a href="' + '/recipe_template?IdR=1' + '" title="' + a[i].title + '" class="thumbnail"><img src="imgs/logos/logo.png" alt="' + a[i].title + '" /></a></div><div class="col-xs-6 col-xs-4"><ul class="meta-search"><h3><a href="/recipe_template?IdR=1">' + a[i].title + '</a></h3><li><i class="glyphicon glyphicon-time"><span>a time?</span></i></li></ul></div><div class="col-xs-6 col-sm-4"><button class="btn btn-danger" onclick="removeRecipe(' + " 'input!'"  + ');">Remove!</button></div><span class="clearfix borda"></span></article></li>');
        }
      }
    }
  };
  xmlhttp.open("POST","getUserResults", true);
  xmlhttp.send();
}

function removeRecipe(rId){
  if(confirm("Are you sure you want to delete: " + rId)){
    console.log("deleted: " + rId);
    //Make the request, load the results
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("POST","DeleteRecipe", true);
    xmlhttp.send();
  }
  else{
    console.log("cancelled deletion of: " + rId);
  }
}
