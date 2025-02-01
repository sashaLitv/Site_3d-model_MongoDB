function showCurrentDate(){
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    let formattedDay = `${day}-${month}-${year}`;
    document.getElementById("planning-day").innerText = `Date: ${formattedDay}`;
}
showCurrentDate();