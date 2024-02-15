document.addEventListener("DOMContentLoaded", function () {
  // Check if the cookie is set to determine whether to show the popup
  var popupStatus = getCookie("popupStatus");

  // If the popup status is not set or it's not closed, show the popup
  if (!popupStatus || popupStatus !== "closed") {
    showPopup();
  }
});

function showPopup() {
  var popup = document.getElementById("darkModePopup");
  popup.style.display = "block";

  // Add a click event listener to close the popup when clicked outside
  document.addEventListener("click", closePopupOnClick);
}

function closePopup() {
  var popup = document.getElementById("darkModePopup");
  popup.style.animation = "slideUp 0.5s ease-in-out";

  setTimeout(function () {
    popup.style.display = "none";
    popup.style.animation = "";
  }, 500);

  // Set the cookie to remember that the popup has been closed
  setCookie("popupStatus", "closed", 1); // 1 day expiration

  // Remove the click event listener after closing the popup
  document.removeEventListener("click", closePopupOnClick);

  // Log a message to the console indicating that the popup has been closed
  console.log("Popup closed. Cookie set to 'closed'. Event listener removed.");
}

function closePopupOnClick(event) {
  var popup = document.getElementById("darkModePopup");
  var popupButton = document.querySelector(".popup-button");

  // If the click is outside the popup and not on the popup button, close the popup
  if (
    event.target !== popup &&
    !popup.contains(event.target) &&
    event.target !== popupButton
  ) {
    closePopup();
  }
}

// Function to set a cookie
function setCookie(name, value, days) {
  // Remove old cookies with the same name
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Set the new cookie
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";

  // Log a message to the console indicating that the cookie has been set
  console.log("Cookie set:", name, "=", value);
}

// Function to get the value of a cookie by name
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
