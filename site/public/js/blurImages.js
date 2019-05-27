"use strict"
function blurImage(num){
  console.log("blurring: "+ num);
  $('#image'+num).css({'filter': 'blur(4px)'});
}

function unblurImage(num){
  console.log("unblurring: "+ num);
  $('#image'+num).css({'filter': 'none'});
}
