var name = "Tyler";
var message = "Good evening, {name}."

window.onload = function() {
  document.onkeydown = addKeyToArray;
  loadBG();
  updateGreeting();
  updateClock();
  setInterval(updateClock, 100);
}

// Loads the background from reddit
function loadBG(count) {
  count = count || 5;
  // get the top count amount pictures from /r/EarthPorn from the past 24 hours
  reddit.top('EarthPorn').t('day').limit(count).fetch(function(res) {
    // res contains JSON parsed response from Reddit
    var img = null;
    var posts = res.data.children;
    for (var i = 0; i < posts.length && img == null; i++) {
      var url = posts[i].data.url;
      var dims = posts[i].data.title.match(/\d+ ?x ?\d+/);  // get the dimensions
      if (dims.length > 0) {
        var dimsSplit = dims[0].split("x");
        var width = parseInt(dimsSplit[0]);
        var height = parseInt(dimsSplit[1]);
        if (width >= 1920 && height >= 1080) {
          if (url.match(/.*.(jpg|png)$/)) {
            img = posts[i];
          } else if (url.match(/.*imgur.com\/\w+/)) {
            img = posts[i];
            posts[i].data.url += ".jpg";
          }
        }
      }
    }
    if (img == null) {
      loadBG(count + 5);
    } else {
      setBG(img);
    }
  });
}
function setBG(img) {
  document.body.style.backgroundImage = "url('" + img.data.url + "')";
  // TODO: make a link to the post
}

function updateGreeting() {
  document.getElementById("greeting").innerHTML = message.replace("{name}", name);
}

function updateClock() {
  var date = new Date();
  document.getElementById("clock").innerHTML =
      (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) + ":" +
      (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
}

var keys = [];
var pass = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13]; // ;)
function addKeyToArray(e) {
  if (e.keyCode == 38 && keys.length != 1) {  // start the sequence over
    keys = [38];
  } else {
    keys.push(e.keyCode);
    if (checkCode()) {
      new Audio('audio.mp3').play();
    }
  }
}
function checkCode() {
  if (keys.length == pass.length) {
    for (var i = 0; i < pass.length; i++) {
      if (keys[i] != pass[i]) {
        return false;
      }
    }
    return true;
  }
}
