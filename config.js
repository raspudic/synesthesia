var seedRandom = require('seed-random');
var palettes = require('./lib/color-palettes.json');
var createRandomRange = require('./lib/random-range');





module.exports = function (seed) {
  if (typeof seed === 'undefined') {
    seed = String(Math.floor(Math.random() * 1000000));
  }

  var randomFunc = seedRandom(seed);
  var random = createRandomRange(randomFunc);

  return {
    // rendering options
    random: randomFunc,
    seedName: 1337,
    pointilism: 0.08,
    noiseScalar: [ 0.000001, 0.0002 ],
    globalAlpha: 0.5,
    startArea: 0.8,
    maxRadius: 5,
    lineStyle: 'round',
    interval: 0.004,
    count: 2000,
    steps: 1000,
    endlessBrowser: true, // Whether to endlessly step in browser
    /*
      random: randomFunc,
    seedName: 320309,
    pointilism: 0.05,
    noiseScalar: [ random(0.000001, 0.000001), random(0.0002, 0.004) ],
    globalAlpha: 0.5,
    startArea: 0.8,
    maxRadius: 20,
    lineStyle: random(1) > 0.5 ? 'round' : 'square',
    interval: 0.001,
    count: 400,
    steps: 1000,
    endlessBrowser: false, // Whether to endlessly step in browser
    
    */
    

    // background image that drives the algorithm
    debugLuma: false,
    backgroundScale: 0.4,
    backgorundFille: 'black',

    // browser/node options
    pixelRatio: 1,
    width: 1280 * 2,
    height: 720 * 2,
    //palette: palettes[0], //arrayShuffle(["#121212","#3c824e","#3a3536","#3a3536","#be5141","#12674a"]),

    // node only options
    asVideoFrames: false,
    filename: 'render',
    outputDir: 'output'
  };

  function getPalette () {
    var paletteColors = palettes[Math.floor(random() * palettes.length)];
    return arrayShuffle(paletteColors);
  }

  function arrayShuffle (arr) {
    var rand;
    var tmp;
    var len = arr.length;
    var ret = arr.slice();

    while (len) {
      rand = Math.floor(random(1) * len--);
      tmp = ret[len];
      ret[len] = ret[rand];
      ret[rand] = tmp;
    }

    return ret;
  }
};
