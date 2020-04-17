// This class handles the computer impressions:
// Loading and setting up face-api.js and audio-meter,
// as well as piping it to all the right places.
console.log('load expression');

class Expression {
    constructor() {
        this.webcamEl;
        this.emojiEl;
        this.state = 0;
        this.faceDetected = false;

        this.loadModels();
    }

    // Loads all Faceapi models 
    loadModels() {
        console.log('Load models');
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(chrome.runtime.getURL('models')),
            faceapi.nets.faceExpressionNet.loadFromUri(chrome.runtime.getURL('models'))
        ]).then(() => {
            console.log('loaded!')
            this.state++;
        })
    }

    // Prompt the user for Webcam and Microphone access
    requestUserMedia(webcamEl) {
        console.log(webcamEl);
        
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 360, height: 280 } // Small video pls! 
        }).then((mediaStream) => {
            console.log('get media');

            // Pipe the video stream into the <video> webcam element 
            webcamEl.srcObject = mediaStream;
            this.webcamEl = webcamEl;

            // After the webcam has started playing, start the face detection loop
            // and kick off the audio measurement loop
            webcamEl.addEventListener('play', () => {
                setInterval(() => { this.getWebcamImpression() }, 500);
            });

            this.state++;

        }).catch(error => alert('Getting camera access failed: \n' + error));
    }

    // Tries to find a face and facial expression
    async getWebcamImpression() {
        console.log(this.emojiEl);
        let emoji = '';
        
        const detections = await faceapi.detectAllFaces(this.webcamEl, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()

        if (detections[0]) {

            // Get the facial expression with the highest certainty
            let expression = detections[0].expressions.asSortedArray()[0].expression;
            
            switch (expression) {
                case 'happy':
                    emoji = '😂'
                    break;
                case 'neutral':
                    emoji = '🙂';
                    break;
                case 'angry':
                    emoji = '😡';
                    break;
                case 'sad':
                    emoji = '😢';
                    break;
                case 'disgusted':
                    emoji = '😫';
                    break;
                case 'surprised':
                    emoji = '😯';
                    break;
                case 'fearful':
                    emoji = '😨';
                    break;
                default:
                    emoji = '😶'
                    break;
            }
            
        }
        
        return setTimeout(() => this.emojiEl.innerHTML = emoji === '' ? '😶' : emoji, 2000);
    }
}