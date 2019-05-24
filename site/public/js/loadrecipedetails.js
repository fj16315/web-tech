function loadRecipeDetails(str) {
  console.log("loading Recipe");
  console.log(str);
  if(str == ""){
    $('#notLoading').replaceWith('<h1 class="notLoading">Search for something!</h1>');
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
        console.log(this.responseText);
        //for length generate each article and put it in an element

        //Get json object from this this.response.jsonobject
        //foreach(recipe in response );
        //this.title;

        //Get all the elements and put them in a search result
        $('#loading').replaceWith('<div id="notLoading" class="col-xs-12 col-sm-6 col-md-12"></div>');

        //replace the loading bar with these results
        // $('#notLoading').add('<>');
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
