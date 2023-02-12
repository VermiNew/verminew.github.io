// Informacja:
function alertmessage() {
  alert("Uwaga! Strona jest w trakcie prac, wszystko może ulec zmianie.<br>Obecna wersja strony: 0.333");
}

// Przekierowanie (timer):
var time = 2.50;
var intervalId;

function startTimer() {
  intervalId = setInterval(function () {
    time -= 0.01;
    document.getElementById("timer").innerHTML = time.toFixed(2) + " sekundy";
    if (time <= 0) {
      clearInterval(intervalId);
    }
  }, 10);
}

// Przekierowanie:
function reload() {
  setTimeout(function () {
    window.location.href = "main.html";
  }, 2500);
}

// Wywołanie funkcji:
setTimeout(function () {
  alertmessage();
  startTimer();
  reload();
}, 833);