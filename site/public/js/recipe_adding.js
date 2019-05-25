"use strict"

function submitData(){
  console.log("submitting");
  if(isFormEmpty()){
    alert("Please fill in all fields");
  }
  else{
    let title = $('#title').val();
    let difficulty = $('#difficulty').val();
    let cookTime = $('#cookTime').val();
    let prepTime = $('#prepTime').val();
    let serves = $('#serves').val();

    let ingredients = [];
    for(let i = 0; i < document.getElementById("ingredients").getElementsByTagName("li").length; i++){
      ingredients.push({ ingredient: $('#ingredient' + i).val(), quantity: $('#quantity' + i).val()});
    }

    let method = [];
    for(let i = 0; i< document.getElementById("methods").getElementsByTagName("li").length; i++){
      method.push($('#method' + i).val());
    }

    console.log(ingredients);
    console.log(method);

    //Get data, put it in a JSON object
    let recipe = JSON.stringify({Title:title,Rating:difficulty,CookTime:cookTime,PrepTime:prepTime,Serves:serves,Ingredients:ingredients,Steps:method});

    addRecipe(recipe);
  }
}

function isFormEmpty(){
  let isValid = false;
  $('#recipeData :input').each(function() {
    console.log($(this).val());
    console.log(this.type);
    if(this.type !== "submit"){
      if($(this).val() === ""){
        console.log("Empty!");
        isValid = true;
      }
    }
  });
  return isValid;
}

function addIngredient(){
  let length = document.getElementById("ingredients").getElementsByTagName("li").length;
  if(length < 20){
    let ingredName = "ingredient" + length;
    let ingredQuan = "quantity" + length;
    let ingredType = "type" + length;
    console.log(length + ", " + ingredName + ", " + ingredQuan);
    $('#ingredients').append('<li><div class="row"><div class="col-xs-6"><input type="text" class="form-control" id="' + ingredName + '" name="' + ingredName + '"/></div><div class="col-xs-3"><input type="text"  class="form-control" id="' + ingredQuan + '" name="' + ingredQuan + '"/></div><div class="col-xs-3"><select class="form-control" id="' + ingredType + '" name=" ' + ingredType + '"><option value="tsp">Teaspoon(s)</option><option value="tbsp">Tablespoon(s)</option><option value="ml">ml</option><option value="grams">grams</option><option value="items">items</option></select></div></div></li>');
  }
  else{
    alert("Too many ingredients!");
  }
}

function removeIngredient(){
  if(document.getElementById("ingredients").getElementsByTagName("li").length > 1){
    $('#ingredients li:last').remove();
  }
}

function addMethod(){
  let length = document.getElementById("methods").getElementsByTagName("li").length;
  if(length < 20){
    let methodName = "method" + length;
    console.log(methodName);
    $('#methods').append('<li><input type="text" class="form-control" name="' + methodName + '" id="' + methodName + '"/></li>');
  }
  else{
    alert("Too many method steps!");
  }
}

function removeMethod(){
  if(document.getElementById("methods").getElementsByTagName("li").length > 1){
    console.log("removing!");
    $('#methods li:last').remove();
  }
}
