document.addEventListener("DOMContentLoaded", initDatePicker);

function initDatePicker() {
    const dateInput = document.getElementById("due_date");
    const calendarIcon = document.getElementById("calendarIcon");

    loadSavedDate();

    calendarIcon.addEventListener("click", function (event) {
        event.preventDefault();
        dateInput.showPicker();
    });

    dateInput.addEventListener("change", function () {
        saveSelectedDate(dateInput.value);
    });
}

function saveSelectedDate(selectedDate) {
    localStorage.setItem("selectedDate", selectedDate);
    updateDisplayedDate(selectedDate);
}

function loadSavedDate() {
    const savedDate = localStorage.getItem("selectedDate");
    if (savedDate) {
        document.getElementById("due_date").value = savedDate;
        updateDisplayedDate(savedDate);
    } else {
        showCurrentDate();
    }
}

function updateDisplayedDate(dateString) {
    const formattedDate = formatDate(dateString);
    document.getElementById("planning-day").innerText = `Date: ${formattedDate}`;
}

function showCurrentDate() {
    let today = new Date();
    let formattedToday = formatDate(today.toISOString().split("T")[0]);
    document.getElementById("planning-day").innerText = `Date: ${formattedToday}`;
}

function formatDate(dateString) {
    let [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
}