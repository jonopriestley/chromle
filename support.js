const eye = new EyeDropper();
/*  Colour wheel eye dropper */
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('colour-wheel').addEventListener('click', function() {
    eye.open().then(function(result) {
      document.getElementById('colour').innerText = result.sRGBHex;
      document.getElementById('colour-picker-input').value = result.sRGBHex;
      document.querySelector(':root').style.setProperty('--wheel-colour', result.sRGBHex);
    });
  });
});

/* ----------------------------------------------------------- */

/* Key commands  */
document.addEventListener('keyup', function(e) {
  switch (e.key) {
    case 'Escape': // close popup windows with Esc
      app.closeOverlays();
      break;
  }
});
/* ----------------------------------------------------------- */

/* Open tutorial when the window is loaded */
window.onload = function() {
  app.onLoad();
}

window.onresize = function() {
  app.resize();
}

/* ----------------------------------------------------------- */


/* Input slider */
const rangeInput = document.getElementById("lightness");
const output = document.querySelector('.js-range-output');
const root = document.documentElement;

function setLightness() {
  output.value = rangeInput.value + '%';
  root.style.setProperty('--lightness', rangeInput.value);
  setPickerLightness();
}

function setDefaultState() {
  rangeInput.focus();
  setLightness();
}

rangeInput.addEventListener('input', function(){
  output.style.opacity = '100%'; // Set the opacity of the slider percentage display to be visible only when it's in use
  setLightness();
});

document.addEventListener('DOMContentLoaded', function(){
  setDefaultState();
});

// Set the opacity of the slider percentage display to clear when it's not being used
document.addEventListener('click', function() {
  output.style.opacity = '0%';
});

// Set picker when changing slider
function setPickerLightness() {
  const hex = document.getElementById('colour-picker-input').value; // get picker hex
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); // split into rgb hex strings
  let [h, s, l] = app.game.hsl(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)); // convert to integers
  let [r, g, b] = app.game.convertHSLtoRGB(h, s, rangeInput.value / 100); // get rgb of picker except the lightness is from the slider
  document.getElementById('colour-picker-input').value = `#${app.twoDigitHex(r)}${app.twoDigitHex(g)}${app.twoDigitHex(b)}`; // set new picker rgb
}

// Set slider when changing picker
const picker = document.getElementById('colour-picker-input').addEventListener('input', function() {
  const hex = document.getElementById('colour-picker-input').value; // get picker value
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); // split into rgb hex strings
  let [r, g, b] = [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]; // convert to integers
  let l = Math.round ( 100 * ( Math.max(r, g, b) + Math.min(r, g, b) ) / (2 * 255) ); // get lightness
  document.getElementById("lightness").value = l; // set slider value to match picker
  root.style.setProperty('--lightness', l);
});

/* ----------------------------------------------------------- */