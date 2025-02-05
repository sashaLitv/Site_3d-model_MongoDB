document.getElementById("open-modal").addEventListener("click", function() {
    document.querySelector(".modal").classList.remove("hidden");
});
document.getElementById("close-modal").addEventListener("click", function() {
    document.querySelector(".modal").classList.add("hidden");
});