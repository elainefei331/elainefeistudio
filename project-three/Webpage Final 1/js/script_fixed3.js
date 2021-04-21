//load airtable lib and call it airtable//
var Airtable = require("airtable");

// use the airtable library to get a variable that represents one of our bases
var base = new Airtable({ apiKey: "keyIapJiJE1ttSszk" }).base(
    "appqFAgYah5MLkBgo"
);


//get collectioin base and select all record, specify functions that receive data//
base("netflix").select({}).eachPage(gotPageOfVideos,
    gotAllVideos);

const videos = [];

function gotPageOfVideos(records, fetchNextPage) {
    videos.push(...records);
    fetchNextPage();
}

function gotAllVideos(err) {
    if (err) {
        console.error(err);
        return;
    }

    showVideos();
    setInterval(run, 38);

}

function showVideos() {
    console.log("showVideos()");
    document.querySelector('.container').num = 0;

    videos.forEach((video) => {

        var container = document.querySelector('.container');
        var num = container.num;

        if (num < 100) {

            //create new container of video
            var videoContainer = document.createElement("div");
            videoContainer.classList.add("video-container");
            // document.querySelector('.container').id = parseInt(document.querySelector(".container").id) + 1;
            // videoContainer.id = "video" + parseInt(document.querySelector(".container").id);

            //add emoji
            var videoMood = document.createElement("div");
            videoMood.classList.add("video-mood");
            videoMood.innerText = video.fields.mood;
            videoContainer.append(videoMood);

            //add title
            var videoTitle = document.createElement("h2"); // <h2></h2>
            videoTitle.classList.add("video-title");      //<h2 class='video-title'> </h2>
            // videoTitle.innerText = video.fields.title;    // <h2 class='video-title'> innerText </h2>
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

            // var str = ".video-title";
            // var result = str.link(videoLink);

            //add bubble moving attributes
            videoContainer.style.position = "absolute";
            var cm = 126;
            videoContainer.style.width = cm + 'px';
            videoContainer.style.height = cm + 'px';
            videoContainer.style.left = rand(0, container.offsetWidth - 126) + 'px';
            videoContainer.style.bottom = rand(0, container.offsetHeight - 126) + 'px';

            //create a speed attribute to div
            videoContainer.speedX = rand(1, 3);
            if (0.5 - Math.random() > 0) {
                videoContainer.speedX *= -1;
            }

            videoContainer.speedY = rand(0.5, 2);


            //event listen on click to emoji and show info
            videoContainer.addEventListener("click", function () {
                videoContainer.classList.toggle("active");
                videoMood.classList.toggle("active");
                videoTitle.classList.toggle("active");
                videoDescription.classList.toggle("active");
                videoLink.classList.toggle("active");

                //when this video transformed from small to big
                if (videoContainer.classList.contains('active')) {
                    //to-do function. 
                    getBoundaryofVideoContainer(videoContainer);

                    videoContainer.removeAttribute('style');
                    //hide current screen's video except the big one
                    for (var i = 0; i < getListofBatch()[flag].length; i ++){
                        if ( ! getListofBatch()[flag][i].classList.contains('active')){
                            getListofBatch()[flag][i].style.visibility = "hidden";
                        }
                    }
                    //loop through all video bubbles, check if new small bubble are clicked,
                    //shift all current videos to next page, and remove the big one 
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
                            // boundary = [];
                        }
                    }
                    flag += 1;
                    if (flag >= getListofBatch().length) {
                        flag = 0;
                    }
                } else {
                    ////when this video transformed from small to big
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
        }

        container.num += 1;
    });
}

var boundary = []; //x, x+w: left, right
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
                        y = 0;
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

//helper function, 
//不会被 main, init
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
            // videoContainers[i * batchSize + j].style.bottom = i *  (container.offsetHeight) * -1 + 'px';
            v[j] = videoContainers[i * batchSize + j];
        }
        b.push(v);
    }
    v = new Array();
    for (var j = 0; j < Math.round((max_num / batchSize - x) * batchSize); j++) {
        // videoContainers[i * batchSize + j].style.bottom = (x + 1) *  (container.offsetHeight) * -1 + 'px';
        v[j] = videoContainers[x * batchSize + j]
    }
    b.push(v);
    return (b);
}
