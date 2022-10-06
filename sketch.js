// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let posePara = {
  architecture: 'MobileNetV1',
  imageScaleFactor: 0.3,
  outputStride: 16,
  flipHorizontal: true,
  minConfidence: 0.5,
  maxPoseDetections: 1,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: 'multiple',
  inputResolution: 513,
  multiplier: 0.75,
  quantBytes: 2,
};

//game controllers
let ready;
let timerHolder = [];
let lastPush;
let intervalToPush;
let points;
let missed;

function setup() {
  createCanvas(640, 480);
  ready = false;
  intervalToPush = 3000;
  missed = 0;
  points = 0;

  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, posePara, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function(results) {
    poses = results;
    //console.log(poses);
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select("#status").html("Model Loaded");
  //timer object
  timerHolder.push(new Timer(random(3000, 5000)));
  lastPush = millis();
  ready = true;
}

function draw() {
  //flip the camera horizontally
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();

  //get body parts
  let mx, my;
  if(poses.length>0){
    let pose = poses[0].pose;
    let nose = pose.nose;
    fill(255);
    ellipse(nose.x, nose.y, 30, 30);
    mx = nose.x;
    my = nose.y;
  }else{
    mx = -100;
    my = -100;
  }

  //game content
  if(ready == true){
    //add new timer
    if(millis()-lastPush >= intervalToPush){
      timerHolder.push(new Timer(random(3000, 5000)));
      lastPush = millis();
      intervalToPush -= 1 ;
    }
    //timer update
    for(let i=timerHolder.length-1; i>=0; i--){
      if(timerHolder[i].update() == true){
        timerHolder[i].display();
        let point = timerHolder[i].checkTouch(mx, my);
        if(point >= 0){
          points += point;
          timerHolder.splice(i, 1);
        }
      }else{
        timerHolder.splice(i, 1);
        missed ++;
      }
    }
    //draw ui
    fill(255);
    noStroke();
    textSize(12);
    textAlign(LEFT, BASELINE);
    text("MISSED: " + missed, 20, 40);
    text("POINTS: " + points, 20, 60);
  }else{
    fill(0, 200);
    rect(0, 0, width, height);
  }

  if(missed >= 5){
    ready = false;
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}