const constraints = {
  video: true
};

const video = document.querySelector("video");

navigator.mediaDevices.getUserMedia(constraints).then(stream => {
  video.srcObject = stream;
});

const captureVideoButton = document.querySelector("#screenshot.capture-button");
const screenshotButton = document.querySelector("#screenshot-button");
// const img = document.querySelector("#screenshot-target");

const canvas = document.createElement("canvas");

screenshotButton.onclick = video.onclick = function() {
  //clear any previous screenshots
  const screenshotContainer = document.querySelector("#screenshot-container");
  if (screenshotContainer.firstChild !== null) {
    screenshotContainer.firstChild.remove();
  }

  // Other browsers will fall back to image/png
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  //create and customize new img element
  const newImg = document.createElement("img");
  newImg.classList.add("main-content", "main-button");
  screenshotContainer.appendChild(newImg);

  newImg.src = canvas.toDataURL("image/webp");
};

function handleSuccess(stream) {
  screenshotButton.disabled = false;
  video.srcObject = stream;
}
