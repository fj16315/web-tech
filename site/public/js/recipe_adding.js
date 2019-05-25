function addIngredient(){
  let length = document.getElementById("ingredients").getElementsByTagName("li").length + 1;
  let ingredName = "ingredients" + length;
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
  let length = document.getElementById("methods").getElementsByTagName("li").length + 1;
  let methodName = "method" + length;
  $('#methods').append('<li><input type="text" class="form-control" name="' + methodName + '" id="' + methodName + '"/></li>');
}

function removeMethod(){
  if(document.getElementById("methods").getElementsByTagName("li").length > 1){
    console.log("removing!");
    $('#methods li:last').remove();
  }
}
