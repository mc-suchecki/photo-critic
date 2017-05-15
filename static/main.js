document.getElementById("photo-input").addEventListener("change", onPhotoSelect, true);

function onPhotoSelect() {
    var file = document.getElementById("photo-input").files[0];
    var reader = new FileReader();
    reader.onloadend = displayPhoto;
    if (file) {
        reader.readAsDataURL(file);
        assessPhoto(file);
    }

    function displayPhoto() {
        // display the uploaded photo
        var photoElement = document.getElementById("photo");
        photoElement.src = reader.result;
        photoElement.classList.remove("hidden");
        // hide the drag and drop area and the aesthetics score
        document.getElementsByClassName("aspect-ratio-fix")[0].classList.add("hidden");
        document.getElementById("score").classList.add("hidden");
    }
}

function assessPhoto(photo) {
    // display the spinner and 'resizing...' text
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("resizing").classList.remove("hidden");
    // resize the image and send it to the backend to analyze it afterwards
    ImageTools.resize(photo, {width: 480, height: 480}, sendPhotoToBackend);
}

function sendPhotoToBackend(blob, didItResize) {
    // change 'resizing..' text to 'analyzing...'
    document.getElementById("resizing").classList.add("hidden");
    document.getElementById("analyzing").classList.remove("hidden");
    // do the AJAX call to retrieve the score
    var request = new XMLHttpRequest();
    request.open("PUT", "/rate-photo");
    // request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        if (request.status === 200) {
            var result = JSON.parse(request.responseText);
            displayScore(result.score);
        }
    };
    request.send(blob);
}

function displayScore(score) {
    // hide the spinner and show the score
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("score").classList.remove("hidden");
    document.getElementById("score-text").innerText = score + "%";
    // adjust the color of the bar and text
    if (score >= 75) {
        document.getElementById("score-bar").classList.add("progress-bar-success");
        document.getElementById("score-text").classList.add("text-success");
    } else if (score >= 25) {
        document.getElementById("score-bar").classList.add("progress-bar-warning");
        document.getElementById("score-text").classList.add("text-warning");
    } else {
        document.getElementById("score-bar").classList.add("progress-bar-danger");
        document.getElementById("score-text").classList.add("text-danger");
    }
    // adjust the width of the bar
    window.setTimeout(function () {
        document.getElementById("score-bar").style["width"] = score + "%";
    }, 100);
}
