let data = {}; // Global object to hold results from the loadJSON call
let albums = []; // Global array to hold all album objects

// Put any asynchronous data loading in preload to complete before "setup" is run
function preload() {
  data = loadJSON("assets/albums.json");

  albumCover = loadImage("assets/images/album1.png");
  song = loadSound("assets/audio/file.mp3");
  song2 = loadSound("assets/audio/file2.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadData();
  imageMode(CENTER);
}

function draw() {
  background(255);

  // Display all albums
  for (let i = 0; i < albums.length; i++) {
    albums[i].display();
    albums[i].rollover(mouseX, mouseY);
  }

  for (let x = 25; x < width - 25; x += 25) {
    for (let y = 25; y < height - 25; y += 25) {
      let distance = dist(x, y, mouseX, mouseY);

      let mappedDistance = map(distance, 0, width, 0, 25);

      noFill();
      ellipse(x, y, mappedDistance);
    }
  }
  push();
  // Label directions at bottom
  textAlign(LEFT);
  fill(0);
  text("Click to add albums.", 10, height - 10);
  pop();
  push();
  textAlign(RIGHT);
  fill(0);
  text("Kendrink. Damn.", width - 10, height - 10);
  pop();
}

// Albums class
class Album {
  constructor(x, y, diameter, label, whichAlbum) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.radius = diameter / 2;
    this.label = label;
    this.whichAlbum = whichAlbum;

    this.over = false;
  }

  // Check if mouse is over the albums
  rollover(px, py) {
    let d = dist(px, py, this.x, this.y);
    this.over = d < this.radius;
  }

  // Display the album
  display() {
    stroke(0);
    strokeWeight(0.8);
    noFill();

    let imageAlbum = albumCover;

    image(
      imageAlbum,
      this.x,
      this.y,
      this.diameter,
      (imageAlbum.height * this.diameter) / imageAlbum.width
    );
    if (this.over) {
      textAlign(CENTER);
      text(this.label, this.x, this.y + this.radius + 20);
    }
  }
}

function playSong() {
  song.play();
}
function pauseSong() {
  song.pause();
}

// Convert saved album data into album Objects
function loadData() {
  let albumData = data["albums"];
  for (let i = 0; i < albumData.length; i++) {
    // Get each object in the array
    let album = albumData[i];
    // Get a position object
    let x = random(0, windowWidth);
    let y = random(0, windowHeight);

    // Get diameter and label
    let diameter = random(50, 220);
    let label = album["label"];

    // Choose the album
    let whichAlbum = album["whichAlbum"];

    // Put object in array
    albums.push(new Album(x, y, diameter, label, whichAlbum));
  }
}

// Create a new album each time the mouse is clicked.
function mousePressed() {
  // Add diameter and label to album
  let diameter = random(50, 220);
  let whichAlbum = int(random(1, 9));
  let label = albums[whichAlbum].label;

  // Append the new JSON album object to the array
  albums.push(new Album(mouseX, mouseY, diameter, label, whichAlbum));

  // Prune album Count if there are too many
  if (albums.length > 9) {
    albums.shift(); // remove first item from array
  }

  if (song.isPlaying() == true) {
    // .isPlaying() returns a boolean
    song.pause();
    song2.play();
  } else {
    song.play(); // playback will resume from the pause position
    song2.pause();
  }
}
