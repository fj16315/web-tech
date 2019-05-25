function filterResults(){
  let maxCookTime = 10; //get cooktime value
  let maxPrepTime = 10;//get preptime
  console.log("filtering");
  results = document.getElementById('results').getElementsByTagName("article");
  for(let i = 0; i < results.length; i++){
    console.log(results[i]);
    //get cooktime from article
    let cooktime = $(results[i]).find('#cookTime').text();
    console.log(cooktime);
    if(cooktime > maxCookTime){
      console.log("hiding");
      results[i].style.display="";
    }
    else{
      console.log("showing");
      results[i].style.display="none";
    }
  }
}
