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

}

function showVideos() {
  console.log("showVideos()");
  document.querySelector('.container').num = 0;

  videos.forEach((video) => {

    var container = document.querySelector('.container');
    var num = container.num;

    if (num < 20) {

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
      var videoTitle = document.createElement("h2");
      videoTitle.classList.add("video-title");
      videoTitle.innerText = video.fields.title;
      videoContainer.append(videoTitle);

      //add description
      var videoDescription = document.createElement("h3");
      videoDescription.classList.add("video-description");
      videoDescription.innerText = video.fields.description;
      videoContainer.append(videoDescription);

      //add url link
      var videoLink = document.createElement("h3");
      videoLink.classList.add("video-link");
      videoLink.innerText = video.fields.link;
      videoContainer.append(videoLink);

      //add bubble moving attributes
      videoContainer.style.position = "absolute";
      var cm = 126;
      videoContainer.style.width = cm + 'px';
      videoContainer.style.height = cm + 'px';
      videoContainer.style.left = rand(0, container.offsetWidth - 126) + 'px';
      videoContainer.style.bottom = rand(0, container.offsetHeight - 126) + 'px';

      //create a speed attribute to div
      videoContainer.speedX = rand(2,4);
      if (0.5 - Math.random() > 0) {
        videoContainer.speedX *= -1;
      }

      videoContainer.speedY = rand(1,2);


      //event listen on click to emoji and show info
      videoContainer.addEventListener("click", function () {
        videoContainer.classList.toggle("active");
        videoMood.classList.toggle("active");
        videoTitle.classList.toggle("active");
        videoDescription.classList.toggle("active");
        videoLink.classList.toggle("active");

        if (videoContainer.classList.contains('active')) {
          videoContainer.removeAttribute('style');
        } else {
          videoContainer.style.width = '126px';
          videoContainer.style.height = '126px';
          videoContainer.style.position = "absolute";
          videoContainer.style.left = rand(0, container.offsetWidth - 126) + 'px';
          videoContainer.style.bottom = rand(0, container.offsetHeight - 126) + 'px';
        }
      })



      document.querySelector(".container").append(videoContainer);
    }

    container.num += 1;
  });
}

function rand(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function Marquee() {
  var videoContainers = document.getElementsByClassName('video-container');
  var container = document.querySelector(".container");

  if (videoContainers.length != 0) {
    if (videoContainers.length <= 60) {
      for (var i = 0; i < videoContainers.length; i++) {
        var d = videoContainers[i];
        // d.style.visibility = "visible";
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
          }

          d.style.left = x + 'px';
          d.style.bottom = y + 'px';
        }

      }
    }
  }
}

setInterval(Marquee, 35);