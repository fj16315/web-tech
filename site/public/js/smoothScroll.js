function smoothScrollReset(){
  window.scroll({ top: 0, left: 0, behavior: 'smooth'});
}

function smoothScrollAbout(){
  document.getElementById('about').scrollIntoView({
  behavior: 'smooth'
});
}
