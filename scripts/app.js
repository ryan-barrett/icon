document.addEventListener('DOMContentLoaded', function() {
  initCamera();
});

function initCamera() {
  const constraints = {
    video: true
  };

  let currentDevice = {
    deviceId: ''
  };

  const video = document.querySelector('video');

  navigator.mediaDevices
    .enumerateDevices()
    .then(gotDevices)
    .then(getStream);

  function gotDevices(deviceInfos) {
    let cameras = [];
    deviceInfos.forEach(device => {
      if (device.kind === 'videoinput') {
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

  const screenshotButton = document.querySelector('#screenshot-button');

  const canvas = document.createElement('canvas');

  function handleSuccess(stream) {
    screenshotButton.disabled = false;
    video.srcObject = stream;
  }

  function gotStream(stream) {
    window.stream = stream; // make stream available to console
    video.srcObject = stream;
  }

  function handleError(error) {
    console.log('Error: ', error);
  }
  setListeners(screenshotButton, video, canvas);
  screenshotButton.disabled = false;
}

function setListeners(screenshotButton, video, canvas) {
  screenshotButton.onclick = video.onclick = function() {
    clearVideo();
    const loader = document.createElement('div');
    loader.classList.add('loader');
    const contentContainer = document.querySelector('.content-container');
    contentContainer.appendChild(loader);

    // Other browsers will fall back to image/png
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    //create and customize new img element
    const newImg = document.createElement('img');
    newImg.src = canvas.toDataURL('image/webp');

    const getMatches = throttled(5000, () => {
      fetch('https://icon-server.herokuapp.com/searchForProduct', {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ payload: newImg.src })
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          const loader = document.querySelector('.loader');
          loader.remove();
          displayResults(data);
        })
        .catch(err => {
          alert(err);
        });
    });
    getMatches();
  };
}

function displayResults(results) {
  const container = document.querySelector('.content-container');
  const resultsList = document.createElement('div');
  resultsList.classList.add('grid-container');
  results.forEach(item => {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('grid-item');
    resultDiv.innerHTML = `${item.description}`;
    resultsList.appendChild(resultDiv);
  });
  container.appendChild(resultsList);
  const buttonContainer = document.querySelector('.button-container');
  const resetButton = document.createElement('button');
  resetButton.innerText = 'Reset';
  resetButton.id = 'screenshot-button';
  resetButton.onclick = () => location.reload();
  buttonContainer.appendChild(resetButton);
}

function clearVideo() {
  const mainContent = document.querySelector('.main-content');
  mainContent.remove();
  const screenshotButton = document.querySelector('#screenshot-button');
  screenshotButton.remove();
}

//throttle frontend requests
function throttled(delay, fn) {
  let lastCall = 0;
  return function (...args) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}
