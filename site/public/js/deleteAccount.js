function deleteAccount(){
  if (confirm("are you sure you want to delete your account? This will also delete all of your recipes!")){
    console.log("account deleted!")
  }
  else{
    console.log("Canceled account deletion");
  }
}
