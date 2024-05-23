
class Colour {

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.checkRGB();

        this.rgb = [r, g, b];

        this.hsl = this.hsl();

        this.max_dist = this.maxEuclidDistance();

        this.lab = this.LabD65();

        this.hex = `#${this.twoDigitHex(r)}${this.twoDigitHex(g)}${this.twoDigitHex(b)}`;
    }

    checkRGB() {
        if (this.r < 0 || this.r > 255) {
            throw Error(`Illegal red value ${this.r}`);  
        }
        
        if (this.g < 0 || this.g > 255) {
            throw Error(`Illegal green value ${this.g}`);
        }
            
        if (this.b < 0 || this.b > 255) {
            throw Error(`Illegal blue value ${this.b}`);
        }
        
    }

    isSameColour(other_colour) {
        return (this.r === other_colour.r && this.g === other_colour.g && this.b === other_colour.b);
    }
    
    getRGB() {
        return this.rgb;
    }
    
    twoDigitHex(value) {
        value = value.toString(16);
        while (value.length < 2) {
            value = '0'.concat(value);
        }
        return value;
    }

    maxEuclidDistance() {
        const dr = Math.max(255 - this.r, this.r);
        const dg = Math.max(255 - this.g, this.g);
        const db = Math.max(255 - this.b, this.b);

        return Math.sqrt(dr * dr + dg * dg + db * db);
    }

    euclidDistance(other_colour) {
        let d2 = Math.pow(this.r - other_colour.r, 2) + Math.pow(this.g - other_colour.g, 2) + Math.pow(this.b - other_colour.b, 2);
        return Math.sqrt(d2);
    }

    LabD65Old() {

        // according to https://www.quora.com/What-is-mathematical-relation-between-RGB-to-LAB-image-space
        const m_old = [[0.412453, 0.357580, 0.180423],
                    [0.212671, 0.715160, 0.072169],
                    [0.019334, 0.119193, 0.950227]];
        
        // https://en.wikipedia.org/wiki/SRGB gives inverse of m.
        // m_inv = |  3.2406255  -1.5372080  -0.4986286  |
        //         | -0.9689307   1.8757561   0.0415175  |
        //         |  0.0557101  -0.2040211   1.0569959  |
        // Invert to get the matrix below
        // Redifine by https://stackoverflow.com/questions/13405956/convert-an-image-rgb-lab-with-python in line with https://en.wikipedia.org/wiki/Standard_illuminant#Illuminant_series_D
        const m = [[0.4124, 0.3576, 0.1805],
                    [0.2126, 0.7152, 0.0722],
                    [0.0193, 0.1192, 0.9505]];

        const Xn = m[0][0] + m[0][1] + m[0][2];
        const Yn = m[1][0] + m[1][1] + m[1][2];
        const Zn = m[2][0] + m[2][1] + m[2][2];

        const x = (m[0][0] * this.r + m[0][1] * this.g + m[0][2] * this.b) / 255;
        const y = (m[1][0] * this.r + m[1][1] * this.g + m[1][2] * this.b) / 255;
        const z = (m[2][0] * this.r + m[2][1] * this.g + m[2][2] * this.b) / 255;

        const fY = this.f(y/Yn);

        const L = 116 * fY - 16;
        const a = 500 * ( this.f(x/Xn) - fY );
        const b = 200 * ( fY - this.f(z/Zn) );

        //const lab = [L, a, b];
        //console.log([L, a, b]);

        return [L, a, b];
    }

    f(t) {
        const d = 6 / 29;
        if (t > Math.pow(d, 3)) {
            return Math.cbrt(t);
        }
        return 1/3 * t * Math.pow(d, -2) + 4 / 29;
    }

    LabD65() {
        let r = this.r / 255;
        let g = this.g / 255;
        let b = this.b / 255;

        // assume sRGB
        r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
        g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
        b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

        const m = [[0.41239079926595, 0.35758433938387, 0.18048078840183],
                    [0.21263900587151, 0.71516867876775, 0.072192315360733],
                    [0.019330818715591, 0.11919477979462, 0.95053215224966]];
        
        let x = (r * m[0][0] + g * m[0][1] + b * m[0][2]) * 100;
        let y = (r * m[1][0] + g * m[1][1] + b * m[1][2]) * 100;
        let z = (r * m[2][0] + g * m[2][1] + b * m[2][2]) * 100;

        x /= 95.047;
        y /= 100;
        z /= 108.883;

        x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

        let l1 = (116 * y) - 16;
        let a1 = 500 * (x - y);
        let b1 = 200 * (y - z);

        return [l1, a1, b1];
    }

    Lab76Distance(other_colour) {
        "Returns the Lab euclidian distance between two RGB colours."
        let d2 = Math.pow(this.lab[0] - other_colour.lab[0], 2) + Math.pow(this.lab[1] - other_colour.lab[1], 2) + Math.pow(this.lab[2] - other_colour.lab[2], 2);
        return Math.sqrt(d2);
    }

    Lab94Distance(other_colour) {
        const kL = 1; // graphic arts
        const kC = 1;
        const kH = 1;

        const k1 = 0.045;
        const k2 = 0.015;

        const L1 = this.lab[0];
        const a1 = this.lab[1];
        const b1 = this.lab[2];

        const L2 = other_colour.lab[0];
        const a2 = other_colour.lab[1];
        const b2 = other_colour.lab[2];

        const dL = L1 - L2;
        const C1 = Math.sqrt( a1 * a1 + b1 * b1 );
        const C2 = Math.sqrt( a2 * a2 + b2 * b2 );
        const dCab = C1 - C2;

        const da = a1 - a2;
        const db = b1 - b2;
        const dHab = Math.sqrt(da * da + db * db - dCab * dCab);

        const sL = 1
        const sC = 1 + k1 * C1;
        const sH = 1 + k2 * C1;

        let dE94 = (dL / (kL * sL))  ** 2 + (dCab / (kC * sC))  ** 2 + (dHab / (kH * sH))  ** 2 

        dE94 = Math.sqrt(dE94);

        return dE94;
    }

    Lab00Distance(other_colour) {
        const d2r = Math.PI / 180; // degrees to radians (for trig functions)
        const r2d = 180 / Math.PI; // radians to degrees (for inverse trig functions)

        const kL = 1;
        const kC = 1;
        const kH = 1;

        let L1 = this.lab[0];
        let a1 = this.lab[1];
        let b1 = this.lab[2];

        let L2 = other_colour.lab[0];
        let a2 = other_colour.lab[1];
        let b2 = other_colour.lab[2];

        let dL_dash = L2 - L1;
        let L_bar = ( L1 + L2 ) / 2;

        let C1 = Math.sqrt(a1 * a1 + b1 * b1);
        let C2 = Math.sqrt(a2 * a2 + b2 * b2);
        let C_bar = ( C1 + C2 ) / 2;

        let a_dash1 = a1 + 0.5 * a1 * ( 1 - Math.sqrt( C_bar**7 / (C_bar**7 + 25**7) ) );
        let a_dash2 = a2 + 0.5 * a2 * ( 1 - Math.sqrt( C_bar**7 / (C_bar**7 + 25**7) ) );

        let C_dash1 = Math.sqrt( a_dash1 * a_dash1 + b1 * b1 );
        let C_dash2 = Math.sqrt( a_dash2 * a_dash2 + b2 * b2 );
        let dC_dash = C_dash2 - C_dash1;
        let C_dash_bar = ( C_dash1 + C_dash2 ) / 2;

        let h_dash1 = (((Math.atan2(b1, a_dash1) * r2d) % 360) + 360) % 360;
        let h_dash2 = (((Math.atan2(b2, a_dash2) * r2d) % 360) + 360) % 360;
        let dh_dash = h_dash2 - h_dash1;

        if (Math.abs(h_dash1 - h_dash2) > 180 && h_dash2 <= h_dash1) {
            dh_dash += 360;
        } else if (Math.abs(h_dash1 - h_dash2) > 180 && h_dash2 > h_dash1) {
            dh_dash -= 360;
        }

        if (C_dash1 === 0 || C_dash2 === 0) {
            dh_dash = 0;
            h_dash1 = 0;
            h_dash2 = 0;
        }
        
        let dH_Dash = 2 * Math.sqrt(C_dash1 * C_dash2) * Math.sin(d2r * dh_dash / 2);

        let H_dash_bar = (h_dash1 + h_dash2) / 2;
        if (Math.abs(h_dash1 - h_dash2) > 180 && (h_dash1 + h_dash2 < 360)) {
            H_dash_bar += 180;
        } else if (Math.abs(h_dash1 - h_dash2) > 180 && (h_dash1 + h_dash2 >= 360)) {
            H_dash_bar -= 180;
        }

        let t = 1 - 0.17 * Math.cos((H_dash_bar - 30) * d2r) + 0.24 * Math.cos(2 * H_dash_bar * d2r) + 0.32 * Math.cos((3 * H_dash_bar + 6) * d2r) - 0.20 * Math.cos((4 * H_dash_bar - 63) * d2r);

        let sC = 1 + 0.045 * C_dash_bar;
        let sH = 1 + 0.015 * C_dash_bar * t;
        let l50_2 = (L_bar - 50) * (L_bar - 50);
        let sL = 1 + 0.015 * l50_2 / Math.sqrt( 20 + l50_2 );

        let rT = -2 * Math.sqrt( C_dash_bar**7 / (C_dash_bar**7 + 25**7) ) * Math.sin(d2r * 60 * Math.exp(-1 * Math.pow((H_dash_bar - 275) / 25, 2)) );

        let dE00 = (dL_dash / (kL * sL)) ** 2 + (dC_dash / (kC * sC)) ** 2 + (dH_Dash / (kH * sH)) ** 2 + rT * dC_dash * dH_Dash / (kC * sC * kH * sH);
        
        dE00 = Math.sqrt(dE00);

        return dE00;
    }

    hsl() {
        let r = this.r / 255;
        let g = this.g / 255;
        let b = this.b / 255;

        let Cmax = Math.max(r, g, b);
        let Cmin = Math.min(r, g, b);
        let d = Cmax - Cmin;

        let l = (Cmax + Cmin) / 2;
        let s = (d === 0) ? 0 : d / (1 - Math.abs(2 * l - 1));
        
        let h;
        if (d === 0) {
            h = 0;
        } else if (Cmax == r) {
            h = 60 * this.mod(( (g - b) / d), 6);
        } else if (Cmax == g) {
            h = 60 * (( (b - r) / d) + 2);
        } else if (Cmax == b) {
            h = 60 * (( (r - g) / d) + 4);
        }

        return [h, s, l];
    }

    mod(n, m) {
        return ((n % m) + m) % m;
    }
}

class Game {

    constructor(answer) {
        this.answer = answer;
        document.querySelector(':root').style.setProperty('--answer', this.answer.hex);

        this.previous_guesses = {};
        this.current_guess = null;
        this.won = false;
        this.num_guesses = 0;
        this.decimal_places = 2;
        this.style = 'lab';

        this.best_guess = null;
        this.best_score = 0;

        this.mode = 'easy';
        this.jnd = 2;
    }

    win() {
        this.won = true;

        if (this.num_guesses > 1) {
            document.getElementById('win').innerText = `Correct in ${this.num_guesses} guesses!`;
        } else {
            document.getElementById('win').innerText = "Correct in 1 guess!";
        }

        document.querySelector(':root').style.setProperty('--primary-bg', this.answer.hex);

        // Change colour
        let white_dist = this.answer.Lab00Distance(new Colour(0xff, 0xff, 0xff));
        let black_dist = this.answer.Lab00Distance(new Colour(0x22, 0x22, 0x22));
        //if (this.answer.hsl[2] <= 0.6 ) {
        if (white_dist >= black_dist) {
            document.querySelector(':root').style.setProperty('--colour', '#ffffff');
        } else {
            document.querySelector(':root').style.setProperty('--colour', '#222222');
            document.getElementById('logo').src = "images/Chromle-dark.png";
        }

        // Get/set secondary-bg colour
        let hsl = this.answer.hsl;
        let l = (hsl[2] > 0.5) ? (hsl[2] - 0.06) : (hsl[2] + 0.06);
        let [r, g, b] = this.convertHSLtoRGB(hsl[0], hsl[1], l);
        document.querySelector(':root').style.setProperty('--secondary-bg', new Colour(r, g, b).hex);

        // Make slider 160 degrees offset from the answer
        let new_hue = Math.round((hsl[0] + 90) % 360);
        let [r2, g2, b2] = this.convertHSLtoRGB(new_hue, 0.952, 1 - l);
        document.querySelector(':root').style.setProperty('--colour-slider', `rgba(${r2}, ${g2}, ${b2}, 0.75)`);
    }

    makeGuess(guess) {
        // Do nothing if the game is won
        if (this.won) {
            return;
        }

        // Get guess
        this.current_guess = guess;
        console.log(this.current_guess.rgb);
        this.num_guesses += 1;

        // Get guess score
        this.current_score = this.getScore();

        // Display current guess
        document.getElementById("score").innerText = Math.round(this.current_score * 100) / 100; // rounded to 2dp

        if (this.current_score > this.best_score) {
            this.best_guess = this.current_guess;
            this.best_score = this.current_score;
            document.getElementById("best-guess").innerText = `${this.current_guess.r}, ${this.current_guess.g}, ${this.current_guess.b}`;
            document.getElementById("best-guess-score").innerText = Math.round(this.current_score * 100) / 100;
            document.querySelector(':root').style.setProperty('--best-guess', this.current_guess.hex);
        }

        // Check if it's correct
        let correct = this.isCorrectGuess();
        if (correct) { // not technically needed to be done this way but it's good code practice
            this.win();
            return;
        }

        // Add current guess to previous guesses list
        this.previous_guesses[this.current_score] = this.current_guess;

        // If the guess is within the boundary you still win.
        if (this.current_score > 100 - this.jnd) {
            this.win();
            document.getElementById('win').innerText += `\nYou guessed within the noticable boundary of the answer.\nThe answer was ${this.answer.r}, ${this.answer.g}, ${this.answer.b}.`;
        }
        
    }
    
    getGuessDistance() {
        if (this.style === 'lab') {
            return this.answer.Lab00Distance(this.current_guess); // used to use Lab76Distance
        }
        return this.answer.euclidDistance(this.current_guess);
    }

    getScore() {
        const dist = this.getGuessDistance();

        if (this.style === 'lab') {
            return 100 - dist;
        }
        
        return 100 - (100 * dist / this.answer.max_dist);
    }

    isCorrectGuess() {
        return this.answer.isSameColour(this.current_guess);
    }

    mod(n, m) {
        return ((n % m) + m) % m;
    }

    convertHSLtoRGB(h, s, l) {
        let c = s * ( 1 - Math.abs(2*l - 1) );
        let x = c * (1 - Math.abs(this.mod(h / 60, 2) - 1) );
        let m = l - c/2;

        let sector = Math.floor( this.mod(h, 360) / 60 );

        let options = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]];

        let [r, g, b] = options[sector];

        [r, g, b] = [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
        
        return [r, g, b];

    }
}


class App {

    constructor() {
        const now = new Date();
        const day = Math.floor((now.getTime() - now.getTimezoneOffset() * 60 * 1000) / 86400000); // number of days since 01/01/1970
        const prng = this.pseudoRNGSeeded(day); // seeded pseudo random number generator function

        this.answer = new Colour(Math.floor(256 * prng()), Math.floor(256 * prng()), Math.floor(256 * prng()));
        //this.answer = new Colour(0xfb, 0xdd, 0x7e); // for testing how colordle finds colour difference from "wheat"
        //this.answer = new Colour(0x24, 0x90, 0x8e); // 0x24, 0xdd, 0x7e, 
        this.game = new Game(this.answer);

    }

    toggleMode() {
        if (this.game.mode === 'easy') {
            this.game.mode = 'hard';
            this.game.jnd = 0;
            document.getElementById('mode-button').innerText = 'Mode: Hard';
        } else {
            this.game.mode = 'easy';
            this.game.jnd = 2;
            document.getElementById('mode-button').innerText = 'Mode: Easy';

            if (this.game.best_score > 100 - this.game.jnd) {
                this.game.win();
                document.getElementById('win').innerText += ` You guessed within the noticable boundary of the answer. The answer was ${this.answer.rgb}.`;
            }
        }
    }

    pseudoRNGSeeded(a) {
        return function() {
          a |= 0;
          a = a + 0x9e3779b9 | 0;
          let t = a ^ a >>> 16;
          t = Math.imul(t, 0x21f0aaad);
          t = t ^ t >>> 15;
          t = Math.imul(t, 0x735a2d97);
          return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
         }
    }

    guess() {
        let guess = document.getElementById("colour-picker-input").value;
        document.getElementById('colour').innerText = guess;
        let r = parseInt(guess.slice(1, 3), 16);
        let g = parseInt(guess.slice(3, 5), 16);
        let b = parseInt(guess.slice(5), 16);
        this.game.makeGuess(new Colour(r, g, b));
    }



    // conic-gradient(from 90deg, #e43f00, #e70d86, #6b0efd, #09adff, #55cc3b, #fae410, #e43f00)
    // radial-gradient(white, transparent 80%),

    // background single colour black - white depending on slider
    // multiply by colour wheel
    // TODO --> how the heck do you make a colour wheel? function that makes an instance of the wheel ony needs to be run once with L = 50.
}

let app = new App();
