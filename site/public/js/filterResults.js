function filterResults(){
  let maxCookTime = $('#cookTimeFilter').val(); //get cooktime value
  let maxPrepTime = $('#prepTimeFilter').val();//get preptime
  console.log("filtering");
  results = document.getElementById('results').getElementsByTagName("article");
  for(let i = 0; i < results.length; i++){
    console.log(results[i]);
    //get cooktime from article
    let cooktime = parseInt($(results[i]).find('#cookTime').text());
    if(cooktime > maxCookTime){
      console.log("hiding");
      $(results[i]).hide();
      console.log(results[i]);
    }
    else{
      console.log("showing");
      $(results[i]).show();
    }
  }
}
