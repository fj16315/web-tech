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

        let a = JSON.parse(this.responseText);
        console.log(a);
        //Get json object from this this.response.jsonobject
        //foreach(recipe in response );
        //$('searchResultsTitle').replaceWith('');
        //Get all the elements and put them in a search result
        $('#loading').replaceWith('<div id="notLoading" class="col-xs-12 col-sm-6 col-md-12"><h2>Result for ' + str + '</h2><div id="results"><ul id="results"></ul></div></div>');
        //replace the loading bar with these results
        if(a.titles.length == 0){
          console.log('Bad');
          $('#results').append('<li><p>No results!</p</li>');
        }
        else{
          $('#results').append('<li><article class="search-result row"><div class="col-xs-12 col-sm-12 col-md-4"><a href="#" title="lorem-Ipsum" class="thumbnail"><img src="imgs/logos/logo.png" alt="Placeholder" ></a></div><div class="col-xs-12 col-sm-12 col-md-8"><ul class="meta-search"><h3><a href="/recipe_template.html?rID=1">' + a.titles[0] + '</a></h3><li><i class="glyphicon glyphicon-time"></i><span>a time?</span></li></ul></div><span class="clearfix borda"></span></aritcle></li>');
        }
        //Ingredients?
        //'<article class="search-result row"><div class="col-xs-12 col-sm-12 col-md-4"><a href="#" title="lorem-Ipsum" class="thumbnail"><img src="imgs/logos/logo.png" alt="Placeholder" ></a></div><div class="col-xs-12 col-sm-12 col-md-8"><ul class="meta-search"><h3><a>' + str + '</a></h3><li><i class="glyphicon glyphicon-time"></i><span>a time?</span></li></ul></div><span class="clearfix borda"></span></aritcle>'
        //Method?
      }
    };
    xmlhttp.open("POST","getSearchResults" + "?search=" + str + "&" + "vegan=true",true);
    xmlhttp.send();
  }
}

function search(){
  console.log("you searched!");
  console.log($("#search").val());
  loadRecipeDetails($("#search").val());
}
