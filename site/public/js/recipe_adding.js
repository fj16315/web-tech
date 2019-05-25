"use strict"

function submitData(){
  console.log("submitting");

  let title = $('#title').val();
  let difficulty = $('#difficulty').val();
  let cookTime = $('#cookTime').val();
  let prepTime = $('#prepTime').val();

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
  let c = {
    title: title,
    difficulty: difficulty,
    cookTime: cookTime,
    prepTime: prepTime,
    ingredients: ingredients,
    method: method
  };
  console.log(c);
}

function addIngredient(){
  let length = document.getElementById("ingredients").getElementsByTagName("li").length;
  let ingredName = "ingredient" + length;
  let ingredQuan = "quantity" + length;
  console.log(length + ", " + ingredName + ", " + ingredQuan);
  $('#ingredients').append('<li><div class="row"><div class="col-xs-8"><input type="text" class="form-control" id="' + ingredName + '" name="' + ingredName + '"/></div><div class="col-xs-4"><input type="text"  class="form-control" id="' + ingredQuan + '" name="' + ingredQuan + '"/></div></div></li>');
}

function removeIngredient(){
  if(document.getElementById("ingredients").getElementsByTagName("li").length > 1){
    $('#ingredients li:last').remove();
  }
}

function addMethod(){
  let length = document.getElementById("methods").getElementsByTagName("li").length;
  let methodName = "method" + length;
  console.log(methodName);
  $('#methods').append('<li><input type="text" class="form-control" name="' + methodName + '" id="' + methodName + '"/></li>');
}

function removeMethod(){
  if(document.getElementById("methods").getElementsByTagName("li").length > 1){
    console.log("removing!");
    $('#methods li:last').remove();
  }
}
