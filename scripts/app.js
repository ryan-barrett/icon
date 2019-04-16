const initCamera = () => {
  const constraints = {
    video: true
  };

  let currentDevice = {
    deviceId: ""
  };

  const video = document.querySelector("video");

  navigator.mediaDevices
    .enumerateDevices()
    .then(gotDevices)
    .then(getStream);

  function gotDevices(deviceInfos) {
    let cameras = [];
    deviceInfos.forEach(device => {
      if (device.kind === "videoinput") {
        cameras.push(device);
      }
    });
    if (cameras.length > 1) {
      currentDevice = cameras[1].deviceId;
      getStream();
    } else {
      currentDevice = cameras[0].deviceId;
      getStream();
    }
  }

  function getStream() {
    if (window.stream) {
      window.stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }

    const otherConstraints = {
      video: {
        deviceId: { exact: currentDevice }
      }
    };

    navigator.mediaDevices
      .getUserMedia(otherConstraints)
      .then(gotStream)
      .catch(handleError);
  }

  const screenshotButton = document.querySelector("#screenshot-button");

  const canvas = document.createElement("canvas");

  function handleSuccess(stream) {
    screenshotButton.disabled = false;
    video.srcObject = stream;
  }

  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    video.srcObject = stream;
  }

  function handleError(error) {
    console.log("Error: ", error);
  }

  const setListeners = () => {
    screenshotButton.onclick = video.onclick = function() {
      // Other browsers will fall back to image/png
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      //create and customize new img element
      const newImg = document.createElement("img");
      newImg.src = canvas.toDataURL("image/webp");

      fetch("https://icon-server.herokuapp.com/searchForProduct", {
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ payload: newImg.src })
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          alert(err);
        });
    };
  };
  setListeners();
};
initCamera();
