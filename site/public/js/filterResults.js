function filterResults(){
  let userCookTime = $('#cookTimeFilter').val(); //get cooktime value
  let userPrepTime = $('#prepTimeFilter').val();//get preptime
  if(userCookTime == ""){
    userCookTime = 100000;
  }
  if(userPrepTime==""){
    userPrepTime = 100000;
  }
  console.log("filtering");
  results = document.getElementById('results').getElementsByTagName("article");
  for(let i = 0; i < results.length; i++){
    // console.log(results[i]);
    //get cooktime from article
    let recipeCookTime = parseInt($(results[i]).find('#cookTime').text());
    let recipePrepTime = parseInt($(results[i]).find('#prepTime').text());
    if(recipeCookTime <= userCookTime){
        if(recipePrepTime <= userPrepTime){
          console.log("showing");
          $(results[i]).show();
      }
      else {
        console.log("hiding");
        $(results[i]).hide();
        // console.log(results[i]);
      }
    }
    else{
      console.log("hiding");
      $(results[i]).hide();
      // console.log(results[i]);
    }
  }
}
