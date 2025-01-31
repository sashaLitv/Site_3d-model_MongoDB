function showPreloader() {
    document.getElementById("loader-container").style.display = "block";  
}
  
function hidePreloader() {
    document.getElementById("loader-container").style.display = "none"; 
}
  
export { showPreloader, hidePreloader};