select Ingredient, Quantity from Recipe, Recipe_Ingredient, Ingredients
where Recipe.IdR = Recipe_Ingredient.IdR
and Ingredients.IdI = Recipe_Ingredient.IdI
and Recipe.IdU = "1";

select OrderNo, Step from Recipe, Steps
where Recipe.IdR = Steps.IdR
and Recipe.IdU = "1";
