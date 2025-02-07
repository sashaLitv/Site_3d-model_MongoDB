document.addEventListener("DOMContentLoaded", initDatePicker);

function initDatePicker() {
    const dateInput = document.getElementById("due-date");
    const calendarIcon = document.getElementById("calendar-icon");
    const allTasksIcon = document.getElementById("all-tasks-icon");

    loadSavedDate();

    calendarIcon.addEventListener("click", function (event) {
        event.preventDefault();
        dateInput.showPicker();
    });

    dateInput.addEventListener("change", function () {
        saveSelectedDate(dateInput.value);
        location.reload(); 
    });

    allTasksIcon.addEventListener("click", function (event) {
        event.preventDefault();
        clearSelectedDate();
        location.reload(); 
    });
}

function saveSelectedDate(selectedDate) {
    localStorage.setItem("selectedDate", selectedDate);
    updateDisplayedDate(selectedDate);
}

function loadSavedDate() {
    const savedDate = localStorage.getItem("selectedDate");
    if (savedDate) {
        updateDisplayedDate(savedDate);
        document.getElementById("due-date").value = savedDate !== "-" ? savedDate : "";
    } else {
        showCurrentDate();
    }
}

function updateDisplayedDate(dateString) {
    const formattedDate = dateString === "-" ? "-" : formatDate(dateString);
    document.getElementById("planning-date").innerText = formattedDate;
}

function showCurrentDate() {
    let today = new Date();
    let formattedToday = formatDate(today.toISOString().split("T")[0]);
    document.getElementById("planning-date").innerText = formattedToday;
}

function clearSelectedDate() {
    localStorage.setItem("selectedDate", "-");
    updateDisplayedDate("-");
}

function formatDate(dateString) {
    let [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}