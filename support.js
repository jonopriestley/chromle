
const eye = new EyeDropper();

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('colour-wheel').addEventListener('click', function() {
    eye.open().then(function(result) {
      document.getElementById('colour').innerText = result.sRGBHex;
      document.getElementById('colour-picker-input').value = result.sRGBHex;
      document.querySelector(':root').style.setProperty('--wheel-colour', result.sRGBHex);
    });
  });
});

document.addEventListener('resize', function() {
  let min_dimension = (window.innerWidth < window.innerHeight) ? Math.round(window.innerWidth / 1.5): Math.round(window.innerHeight / 3.5);
  document.querySelector(':root').style.setProperty('--wheel-diameter', `${min_dimension}px`);
});

let min_dimension = (window.innerWidth < window.innerHeight) ? Math.round(window.innerWidth / 1.5): Math.round(window.innerHeight / 3.5);
document.querySelector(':root').style.setProperty('--wheel-diameter', `${min_dimension}px`);

document.addEventListener('input', function() {
  document.getElementById('colour').innerText = document.getElementById('colour-picker-input').value;
});

/* Buttons  */

const buttons = document.getElementsByClassName('button');

// Button mouse down
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('mousedown', event => {
    buttons[i].style.backgroundColor = '#bbb';
  });
}

// Button mouse leave
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('mouseup', event => {
    buttons[i].style.backgroundColor = '#ddd';
  });
}

// Button mouse enter
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('mouseenter', event => {
    buttons[i].style.backgroundColor = '#ddd';
  });
}

// Button mouse leave
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('mouseleave', event => {
      buttons[i].style.backgroundColor = '#fff';
    }
    );
  }

/* ----------------------------------------------------------- */

// Initialise the day
const now = new Date();
const day = Math.floor((now.getTime() - now.getTimezoneOffset() * 60 * 1000) / 86400000) - 19870; // number of days of this website
document.getElementById('day-number').innerText = `Day ${day}`;

const rangeInput = document.getElementById("lightness");
const output = document.querySelector('.js-range-output');
const root = document.documentElement;

function setLightness() {
  output.value = rangeInput.value + '%';
  root.style.setProperty('--lightness', rangeInput.value);
  setPickerLightness();
}

function setPickerLightness() {
  const hex = document.getElementById('colour-picker-input').value;
  let [h, s, l] = hexToHSL(hex);
  l = rangeInput.value / 100;
  document.getElementById('colour-picker-input').value = hslToHex(h, s, l);
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

const picker = document.getElementById('colour-picker-input').addEventListener('input', function() {
  const hex = document.getElementById('colour-picker-input').value;
  const [h, s, l] = hexToHSL(hex);
  document.getElementById("lightness").value = Math.round(100 * l);
});

function mod(n, m) {
  return ((n % m) + m) % m;
}

function hexToHSL(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r, g, b;
  r = parseInt(result[1], 16) / 255;
  g = parseInt(result[2], 16) / 255;
  b = parseInt(result[3], 16) / 255;

  const Cmax = Math.max(r, g, b);
  const Cmin = Math.min(r, g, b);
  const d = Cmax - Cmin;

  const l = (Cmax + Cmin) / 2;
  const s = (d === 0) ? 0 : d / (1 - Math.abs(2 * l - 1));
  
  let h;
  if (d === 0) {
      h = 0;
  } else if (Cmax == r) {
      h = 60 * mod(( (g - b) / d), 6);
  } else if (Cmax == g) {
      h = 60 * (( (b - r) / d) + 2);
  } else if (Cmax == b) {
      h = 60 * (( (r - g) / d) + 4);
  }

  return [h, s, l];
}

function hslToHex(h, s, l) {
  const c = s * ( 1 - Math.abs(2*l - 1) );
  const x = c * (1 - Math.abs(mod(h / 60, 2) - 1) );
  const m = l - c/2;

  const sector = Math.floor( mod(h, 360) / 60 );
  const options = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]];
  let [r, g, b] = options[sector];
  [r, g, b] = [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];

  return `#${twoDigitHex(r)}${twoDigitHex(g)}${twoDigitHex(b)}`;
}

function twoDigitHex(value) {
  value = value.toString(16);
  while (value.length < 2) {
      value = '0'.concat(value);
  }
  return value;
}