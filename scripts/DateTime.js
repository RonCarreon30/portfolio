// --- TIME & DATE DISPLAY ---
const timeEl = document.getElementById("time");
const mobileTimeEl = document.getElementById("mobile-time");
const dateEl = document.getElementById("date");

function updateTime() {
    const now = new Date();

    // Philippines timezone offset: UTC+8
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const philippineTime = new Date(utc + 8 * 3600000);

    // Format time hh:mm:ss AM/PM for desktop
    let hours = philippineTime.getHours();
    const minutes = philippineTime.getMinutes();
    const seconds = philippineTime.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const timeStr = `PHT | ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;

    // Format time for mobile (without seconds)
    const mobileTimeStr = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm} | PHT`;

    if (timeEl) timeEl.textContent = timeStr;
    if (mobileTimeEl) mobileTimeEl.textContent = mobileTimeStr;

    // Date format: JUNE 08, 2025
    const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
    ];
    const monthName = months[philippineTime.getMonth()];
    const day = philippineTime.getDate().toString().padStart(2, "0");
    const year = philippineTime.getFullYear();

    const dateStr = `${monthName} ${day}, ${year}`;

    // Update both desktop and mobile date elements
    if (dateEl) dateEl.textContent = dateStr;
    const dateMobileEl = document.getElementById("date-mobile");
    if (dateMobileEl) dateMobileEl.textContent = dateStr;
}

updateTime();
setInterval(updateTime, 1000);