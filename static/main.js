document.getElementById("photo-input").addEventListener("change", readURL, true);

function readURL() {
    var file = document.getElementById("photo-input").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        // display the photo
        var photoElement = document.getElementById("photo");
        photoElement.src = reader.result;
        photoElement.classList.remove("hidden");
        // hide the drag and drop area and the aesthetics score
        document.getElementsByClassName("aspect-ratio-fix")[0].classList.add("hidden");
        document.getElementById("score").classList.add("hidden");
        // display the spinner
        document.getElementById("spinner").classList.remove("hidden");
        // do the AJAX call to retrieve the score
        var request = new XMLHttpRequest();
        request.open("PUT", "/rate-photo");
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = function () {
            if (request.status === 200) {
                var result = JSON.parse(request.responseText);
                console.log(result.score);
                document.getElementById("spinner").classList.add("hidden");
                document.getElementById("score").classList.remove("hidden");
                document.getElementById("score-bar").style["width"] = result.score + "%";
                document.getElementById("score-text").innerText = result.score + "%";
                if (result.score >= 75) {
                    document.getElementById("score-bar").classList.add("progress-bar-success");
                    document.getElementById("score-text").classList.add("text-success");
                } else if (result.score >= 25) {
                    document.getElementById("score-bar").classList.add("progress-bar-warning");
                    document.getElementById("score-text").classList.add("text-warning");
                } else {
                    document.getElementById("score-bar").classList.add("progress-bar-danger");
                    document.getElementById("score-text").classList.add("text-danger");
                }
            } else {
                console.log("Error!");
            }
        };
        request.send(JSON.stringify({photo: reader.result}));
    };
    if (file) {
        reader.readAsDataURL(file);
    } else {
    }
}