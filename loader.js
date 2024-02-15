document.addEventListener("DOMContentLoaded", function () {
  // Function to check if the specified class is present in the HTML
  function isDurationDisabled() {
    return document.body.classList.contains("u-disable-duration");
  }

  // Check if the 'u-disable-duration' class is present
  if (isDurationDisabled()) {
    console.log(
      "Duration is disabled. Waiting for the class to be removed before starting the timeout."
    );

    // Check periodically if the class is removed
    var checkClassInterval = setInterval(function () {
      if (!isDurationDisabled()) {
        console.log("Duration class removed. Starting the timeout now.");

        // Fakes the loading setting a timeout
        setTimeout(function () {
          document.body.classList.add("loaded");
        }, 500);

        // Clear the interval since we don't need to check anymore
        clearInterval(checkClassInterval);
      }
    }, 100);
  } else {
    console.log("Duration class is not present.");
  }
});
