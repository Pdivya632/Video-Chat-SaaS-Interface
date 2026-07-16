const cad = document.getElementById("call-action-div");
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const roomLink = document.getElementById("roomLink");
const copyButton = document.getElementById("copyButton");


let isAudioOn = true;
let isVideoOn = true;

button1.addEventListener('click', function() {
  isAudioOn = !isAudioOn;
  if (isAudioOn) {
    button1.innerHTML = '<i class="bx bx-microphone"></i>';
  } else {
    button1.innerHTML = '<i class="bx bx-microphone-off"></i>';
  }
});

button2.addEventListener('click', function() {
  isVideoOn = !isVideoOn;
  if (isVideoOn) {
    button2.innerHTML = '<i class="bx bx-video"></i>';
  } else {
    button2.innerHTML = '<i class="bx bx-video-off"></i>';
  }
});



// Generate random room name if needed
if (!location.hash) {
  location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
}
const roomHash = location.hash.substring(1);

// TODO: Replace with your own channel ID
const drone = new ScaleDrone('fGePo1eRCWkGsH6k');
// Room name needs to be prefixed with 'observable-'
const roomName = 'observable-' + roomHash;

// Create link to the current URL with roomHash as the hash value
const link = document.createElement('a');
link.href = `${location.protocol}//${location.host}${location.pathname}#${roomHash}`;
link.textContent = link.href;

// Get the copy div element
const copyDiv = document.querySelector('.copy');

// Update the content of the div with the room name and the link
copyDiv.innerHTML = `Send your URL to a friend to start a video call in room ${roomName}`;
copyDiv.appendChild(document.createElement('br'));
copyDiv.appendChild(link);
// Add an event listener to the copy button
copyButton.addEventListener("click", function () {
  const roomLinkText = link.textContent;
  navigator.clipboard.writeText(roomLinkText).then(function () {
    alert("Link copied to clipboard!");
  }, function () {
    alert("Error copying link to clipboard :(");
  });
});

const configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }]
};
let room;
let pc;


function onSuccess() { };
function onError(error) {
  console.error(error);
};

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  room = drone.subscribe(roomName);
  room.on('open', error => {
    if (error) {
      onError(error);
    }
  });
  // We're connected to the room and received an array of 'members'
  // connected to the room (including us). Signaling server is ready.
  room.on('members', members => {
    if (members.length >= 3) {
      return alert('The room is full');
    }
    console.log('MEMBERS', members);
    // If we are the second user to connect to the room we will be creating the offer
    const isOfferer = members.length === 2;
    startWebRTC(isOfferer);
  });
});

// Send signaling data via Scaledrone
function sendMessage(message) {
  drone.publish({
    room: roomName,
    message
  });
}

function startWebRTC(isOfferer) {
  pc = new RTCPeerConnection(configuration);

  // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
  // message to the other peer through the signaling server
  pc.onicecandidate = event => {
    if (event.candidate) {
      sendMessage({ 'candidate': event.candidate });
    }
  };

  // If user is offerer let the 'negotiationneeded' event create the offer
  if (isOfferer) {
    pc.onnegotiationneeded = () => {
      pc.createOffer().then(localDescCreated).catch(onError);
    }
  }

  // When a remote stream arrives display it in the #remoteVideo element
  pc.onaddstream = event => {
    remoteVideo.srcObject = event.stream;
  };

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  }).then(stream => {
    // Display your local video in #localVideo element
    localVideo.srcObject = stream;
    // Add your stream to be sent to the conneting peer
    pc.addStream(stream);
  }, onError);

  let isAudio = true
  button1.addEventListener("click", function () {
    isAudio = !isAudio
    localVideo.srcObject.getAudioTracks()[0].enabled = isAudio
  });

  let isVideo = true
  button2.addEventListener("click", function () {
    isVideo = !isVideo
    localVideo.srcObject.getVideoTracks()[0].enabled = isVideo
  });

  // Listen to signaling data from Scaledrone
  room.on('data', (message, client) => {
    // Message was sent by us
    if (client.id === drone.clientId) {
      return;
    }

    if (message.sdp) {
      // This is called after receiving an offer or answer from another peer
      pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
        // When receiving an offer lets answer it
        if (pc.remoteDescription.type === 'offer') {
          pc.createAnswer().then(localDescCreated).catch(onError);
        }
      }, onError);
    } else if (message.candidate) {
      // Add the new ICE candidate to our connections remote description
      pc.addIceCandidate(
        new RTCIceCandidate(message.candidate), onSuccess, onError
      );
    }
  });
}

function localDescCreated(desc) {
  pc.setLocalDescription(
    desc,
    () => sendMessage({ 'sdp': pc.localDescription }),
    onError
  );
}
