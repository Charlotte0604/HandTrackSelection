const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let toggleButton = document.getElementById('toggleButton');
toggleButton.disabled = true;
let updatenote = document.getElementById('updatenote');

const modelParams = {
    flipHorizontal: false,
    maxNumBoxes: 2,
    iouThreshold: 0.5,      
    scoreThreshold: 0.6,  
    }

let isVideo = false;    
let model = null; 

toggleButton.addEventListener('click', function(){
    toggleVideo();
});

function toggleVideo(){
    if(!isVideo){
        updatenote.innerText = "Video started. Now tracking will be activated.";
        startVideo();
    }
     else{
        updatenote.innerText = "Video stopped.";
        handTrack.stopVideo(video);
        isVideo = false;
    }
}

function startVideo(){
    handTrack.startVideo(video).then(function(status){
        if(status){
            updatenote.innerText = "Video started. Now tracking will be activated.";
            isVideo = true;
            runDetection();
        }
        else{
            updatenote.innerText = "Please enable video";
        }
    });
}

function runDetection(){
    model.detect(video).then(predictions => {
        model.renderPredictions(predictions, canvas, context, video);
        if(isVideo){
            requestAnimationFrame(runDetection);
        }
    });
}

handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
    updatenote.innerText = "Loaded Model!";
    toggleButton.disabled = false;
})