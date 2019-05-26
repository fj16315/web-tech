function filterResults(){
  let maxCookTime = parseInt(10); //get cooktime value
  let maxPrepTime = parseInt(20);//get preptime
  console.log("filtering");
  results = document.getElementById('results').getElementsByTagName("article");
  for(let i = 0; i < results.length; i++){
    console.log(results[i]);
    //get cooktime from article
    let cooktime = parseInt($(results[i]).find('#cookTime').text());
    if(cooktime > 10){
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
