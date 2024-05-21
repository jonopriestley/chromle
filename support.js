
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('colour-wheel').addEventListener('click', function() {
        (new EyeDropper()).open().then(function(result) {
            document.getElementById('wheel-colour').innerText = result.sRGBHex;
            document.querySelector(':root').style.setProperty('--wheel-colour', result.sRGBHex);
        });
    });
});


const buttons = document.getElementsByClassName('button');

// Button mouse down
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('mousedown', event => {
    buttons[i].style.backgroundColor = '#bbb';
  }
  );
}

// Button mouse leave
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('mouseenter', event => {
      buttons[i].style.backgroundColor = '#ddd';
    }
    );
  }

// Button mouse leave
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('mouseleave', event => {
      buttons[i].style.backgroundColor = '#fff';
    }
    );
  }



// calc(#ff0000 * var(--lightness) / 100 * 100%)

// radial-gradient(white, transparent 75%),

// Initialise the day
const now = new Date();
const day = Math.floor((now.getTime() - now.getTimezoneOffset() * 60 * 1000) / 86400000) - 19863; // number of days of this website
document.getElementById('day-number').innerText = `Day ${day}`;

const rangeInput = document.getElementById("lightness");
const output = document.querySelector('.js-range-output');
const root = document.documentElement;

function setLightness() {
    output.value = rangeInput.value + '%';
    root.style.setProperty('--lightness', rangeInput.value);
}

function setDefaultState() {
    rangeInput.focus();
    setLightness();
}

rangeInput.addEventListener('input', function(){
    output.style.opacity = '100%'; // Set the opacity of the slider percentage display to fully opaque when it's in use
    setLightness();
});

document.addEventListener('DOMContentLoaded', function(){
    setDefaultState();
});

// Set the opacity of the slider percentage display to clear when it's not being used
document.addEventListener('click', function() {
    output.style.opacity = '0%';
});