var mydiv = document.getElementById("mydiv");
var mydiv1 = document.getElementById("mydiv1");
var button = document.getElementById("btn");

var starttime;

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (f) {
    return setTimeout(f, 1000 / 60);
  }; // simulate calling code 60

window.cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  function (requestID) {
    clearTimeout(requestID);
  }; //fall back

function moveit(timestamp, el, dist, duration) {
  //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date:
  var timestamp = timestamp || new Date().getTime();
  var runtime = timestamp - starttime;
  var progress = runtime / duration;
  progress = Math.min(progress, 1);
  el.style.left = (dist * progress).toFixed(2) + "px";
  if (runtime < duration) {
    // if duration not met yet
    requestAnimationFrame(function (timestamp) {
      // call requestAnimationFrame again with parameters
      moveit(timestamp, el, dist, duration);
    });
  }
}

function otherExample() {
  console.log("stack [1]");
  setTimeout(() => console.log("macro [2]"), 0);
  setTimeout(() => console.log("macro [3]"), 1);

  const p = Promise.resolve();
  for (let i = 0; i < 3; i++)
    p.then(() => {
      setTimeout(() => {
        console.log("stack [4]");
        setTimeout(() => console.log("macro [5]"), 0);
        p.then(() => console.log("micro [6]"));
      }, 0);
      console.log("stack [7]");
    });

  console.log("stack [8]");
}

requestAnimationFrame(function (timestamp) {
  starttime = timestamp || new Date().getTime(); //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date
  moveit(timestamp, mydiv, 500, 2000); // 400px over 1 second
});

otherExample();

button.addEventListener("click", () => {
  //This works because first and second style updates are in separate style calculations
  // Normally this doesn't work as intended because: https://vimeo.com/254947206, https://www.youtube.com/watch?v=cCOL7MC4Pl0.

  // First
  mydiv1.style.transform = "translateX(1000px)";

  // Second
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mydiv1.style.transition = "transform 1s ease-in-out";
      mydiv1.style.transform = "translateX(500px)";
    });
  });
});
