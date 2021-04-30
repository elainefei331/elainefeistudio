
var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyIapJiJE1ttSszk" }).base(
    "appqFAgYah5MLkBgo"
);

const NUM_OF_BUBBLES_ON_SCREEN = 30;

base("netflix").select({}).eachPage(gotPageOfVideos,
    gotAllVideos);

const videos = [];
var videoIndex = 0;

function gotPageOfVideos(records, fetchNextPage) {
    videos.push(...records);
    fetchNextPage();
}

function gotAllVideos(err) {
    if (err) {
        console.error(err);
        return;
    }
    document.querySelector('.container').num = 0;

    for(let i=0; i<NUM_OF_BUBBLES_ON_SCREEN; i++) {
        releaseBubble();
    }

    setInterval(run, 35);
}

function releaseBubble() {
    let video = videos[videoIndex];
    videoIndex++;
    if(videoIndex >= videos.length) videoIndex = 0;
    console.log(videoIndex);

    var container = document.querySelector('.container');
    var num = container.num;


    var videoContainer = document.createElement("div");
    videoContainer.classList.add("video-container");
    var videoMood = document.createElement("div");
    videoMood.classList.add("video-mood");
    videoMood.innerText = video.fields.mood;
    videoContainer.append(videoMood);

    var videoTitle = document.createElement("h2"); 
    videoTitle.classList.add("video-title");      
    videoContainer.append(videoTitle);

    //add description
    var videoDescription = document.createElement("h3");
    videoDescription.classList.add("video-description");
    videoDescription.innerText = video.fields.description;
    videoContainer.append(videoDescription);

    //add url link
    var videoLink = document.createElement("a");
    videoLink.classList.add("video-link");
    videoLink.href = video.fields.link;
    videoLink.innerText = video.fields.title;
    videoTitle.append(videoLink);

    //add bubble moving attributes
    videoContainer.style.position = "absolute";
    var cm = 126;
    videoContainer.style.width = cm + 'px';
    videoContainer.style.height = cm + 'px';
    videoContainer.style.left = rand(0, container.offsetWidth - 126) + 'px';
    videoContainer.style.bottom = rand(0, container.offsetHeight - 126) + 'px';

    //create a speed attribute to div
    videoContainer.speedX = rand(2, 4);
    if (0.5 - Math.random() > 0) {
        videoContainer.speedX *= -1;
    }

    videoContainer.speedY = rand(1, 2);


    //event listen on click to emoji and show info
    videoContainer.addEventListener("click", function () {
        videoContainer.classList.toggle("active");
        videoMood.classList.toggle("active");
        videoTitle.classList.toggle("active");
        videoDescription.classList.toggle("active");
        videoLink.classList.toggle("active");

        if (videoContainer.classList.contains('active')) {
            getBoundaryofVideoContainer(videoContainer);

            videoContainer.removeAttribute('style');
            for (var i = 0; i < getListofBatch()[flag].length; i ++){
                if ( ! getListofBatch()[flag][i].classList.contains('active')){
                    getListofBatch()[flag][i].style.visibility = "hidden";
                }
            }
            var videoContainers = document.getElementsByClassName('video-container');
            for (var i = 0; i < videoContainers.length; i ++){
                var previousVideo = videoContainers[i];
                if ( previousVideo.classList.contains('active') && previousVideo.videoId != videoContainer.videoId){
                    previousVideo.classList.toggle("active");
                    for (var j=0; j < previousVideo.children.length; j++){
                        previousVideo.children[j].classList.toggle('active');
                    }
                    previousVideo.style.visibility = "hidden";
                    previousVideo.style.width = '126px';
                    previousVideo.style.height = '126px';
                    previousVideo.style.position = "absolute";
                    previousVideo.style.left = rand(0, container.offsetWidth - 126) + 'px';
                    previousVideo.style.bottom = '0px';
                }
            }
            flag += 1;
            if (flag >= getListofBatch().length) {
                flag = 0;
            }
        } else {
            videoContainer.style.width = '126px';
            videoContainer.style.height = '126px';
            videoContainer.style.position = "absolute";
            videoContainer.style.left = rand(0, container.offsetWidth - 126) + 'px';
            videoContainer.style.bottom = '0px';
            videoContainer.style.visibility = 'hidden';
            boundary = [];
        }
    })

    videoContainer.style.visibility = "hidden";
    videoContainer.videoId = container.num;

    document.querySelector(".container").append(videoContainer);

    container.num += 1;
}


var boundary = []; 
function getBoundaryofVideoContainer(video){
    var w = 560;
    var l = window.innerWidth/2 - w/2;
    var r = l + w;
    boundary = [l, r];
    console.log(boundary, w, l ,r);
}

function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

var flag = 0;

function run() {
    var videoContainers = document.getElementsByClassName('video-container');
    var container = document.querySelector(".container");
    
    if (videoContainers.length != 0) {
        if (videoContainers.length <= 100) {
            for (var i = 0; i < videoContainers.length; i++) {
                var d = videoContainers[i];
                d.style.visibility = "visible";
                if (!d.classList.contains('active')) {

                    var x = d.offsetLeft + d.speedX;

                    if (boundary.length != 0){
                        var leftBoundary = boundary[0];
                        var rightBoundary = boundary[1];
                        if (d.offsetLeft > leftBoundary && d.offsetLeft < rightBoundary){
                            arrayX = [];
                            arrayX.push(rand(0, leftBoundary - 126) + d.speedX);
                            arrayX.push(rand(rightBoundary,  container.offsetWidth - 126) + d.speedX);
                            x = arrayX[Math.round(Math.random() * arrayX.length)]
                        }
                    }
                    var y = parseFloat(d.style.bottom.substring(0, d.style.bottom.length - 2)) + d.speedY;

                    if (x < 0) {
                        x = 0;
                        d.speedX *= -1;
                    } else if (x > container.offsetWidth - d.offsetWidth) {
                        x = container.offsetWidth - d.offsetWidth;
                        d.speedX *= -1;
                    }

                    if (y <= container.offsetHeight) {
                        y = y + d.speedY;
                    } else {
                        d.remove();
                        releaseBubble();
                    }

                    d.style.left = x + 'px';
                    d.style.bottom = y + 'px';
                }
            }
        }
        else {

            var batchList = getListofBatch();

            for (var i = 0; i < batchList[flag].length; i++) {
                var d = batchList[flag][i];
                d.style.visibility = "visible";
                if (!d.classList.contains('active')) {

                    var x = d.offsetLeft + d.speedX;
                    var y = parseFloat(d.style.bottom.substring(0, d.style.bottom.length - 2)) + d.speedY;

                    if (x < 0) {
                        x = 0;
                        d.speedX *= -1;
                    } else if (x > container.offsetWidth - d.offsetWidth) {
                        x = container.offsetWidth - d.offsetWidth;
                        d.speedX *= -1;
                    }

                    if (y <= container.offsetHeight) {
                        y = y + d.speedY;
                    } else {
                        y = 0;
                        d.style.visibility = "hidden";
                    }

                    d.style.left = x + 'px';
                    d.style.bottom = y + 'px';
                }

            }

        }
    }
}

function getListofBatch() {
    var videoContainers = document.getElementsByClassName('video-container');
    var container = document.querySelector(".container");
    var max_num = videoContainers.length;

    var batchSize = 30;

    x = Math.floor(max_num / batchSize)
    b = new Array()
    for (var i = 0; i < x; i++) {
        v = new Array()
        for (var j = 0; j < batchSize; j++) {
            v[j] = videoContainers[i * batchSize + j];
        }
        b.push(v);
    }
    v = new Array();
    for (var j = 0; j < Math.round((max_num / batchSize - x) * batchSize); j++) {
        v[j] = videoContainers[x * batchSize + j]
    }
    b.push(v);
    return (b);
}
