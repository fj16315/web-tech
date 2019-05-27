function loadUserRecipes(){
  $('#notloading').replaceWith('<div id="loading"></div>');
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
        $('#results').append('<li><article class="search-result row"><div class="col-sm-6 col-xs-12"><ul class="meta-search"><h3><a href="/recipe_template?IdR=' + a[i].IdR + '">' + a[i].title + '</a></h3><span>Cook time: <i class="glyphicon glyphicon-time"></i> <a id="cookTime">' + a[i].cookTime  + '</a> | </span><span> Prep time: <i class="glyphicon glyphicon-time"></i> <a id="prepTime">' + a[i].prepTime  + '</a></span></ul></div><div class="col-xs-12 col-sm-6"><form><button class="btn btn-danger" onclick="removeRecipe(' + a[i].IdR + ');">Remove!</button></form></div><span class="clearfix borda"></span></article></li>');
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
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Blep");
      }
    };
    let id = JSON.stringify({IdR:rId});
    xmlhttp.open("POST","deleteRecipe", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(id);
  }
  else{
    console.log("cancelled deletion of: " + rId);
  }
}
