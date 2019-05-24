function loadRecipeDetails(str) {
  console.log("loading Recipe");
  console.log(str);
  if(str == ""){
    $('#notLoading').replaceWith('<h1 id="notLoading">Search for something!</h1>');
  }
  else{
    $('#notLoading').replaceWith('<div id="loading"></div>');
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

        //Get all the elements and put them in a search result
        $('#loading').replaceWith('<div id="notLoading" class="col-xs-12 col-sm-6 col-md-12"><h2>Result for ' + str + '</h2><div id="results"></div></div>');
        //replace the results with no results!
        if(a.titles.length == 0){
          $('#results').append('<p>No results!</p>');
        }
        else{
          //foreach(recipe in response );
          for(let i = 0; i<a.titles.length; i++){
          $('#results').append('<article class="search-result row"><div class="col-xs-12 col-sm-12 col-md-4"><a href="' + '/recipe_template.html?rID=1' + '" title="' + a.titles[i] + '" class="thumbnail"><img src="imgs/logos/logo.png" alt="' + a.titles[i] + '" ></a></div><div class="col-xs-12 col-sm-12 col-md-8"><ul class="meta-search"><h3><a href="/recipe_template.html?rID=1">' + a.titles[i] + '</a></h3><li><i class="glyphicon glyphicon-time"></i><span>a time?</span></li></ul></div><span class="clearfix borda"></span></aritcle>');
          }
        }
      }
    };
    xmlhttp.open("POST","getSearchResults" + "?search=" + str, true);
    xmlhttp.send();
  }
}

function search(){
  console.log("you searched!");
  console.log($("#search").val());
  loadRecipeDetails($("#search").val());
}
