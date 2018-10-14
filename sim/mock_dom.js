const jsdom = require('jsdom')
const { Canvas } = require('canvas-prebuilt')
const { JSDOM } = jsdom

const { window } = new JSDOM('<!DOCTYPE html><html><body><div id="game"></div></body></html>', {
  // To run the scripts in the html file
  runScripts: "dangerously",
  // Also load supported external resources
  resources: "usable",
  // So requestAnimatinFrame events fire
  pretendToBeVisual: true
})

global.document = window.document;
global.window = window;
window.setTimeout = function(callback) {
  setImmediate(callback)
} 
global.Canvas = Canvas;
global.Image = window.Image;
global.window.CanvasRenderingContext2D = 'context2d';
global.window.Element = undefined;
global.navigator = {
  userAgent: 'FakeUserAgent'
};

global.window.scrollTo = () => {};
global.window.focus = () => {};

window.HTMLCanvasElement.prototype.getContext = () => {
  return {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: function(x, y, w, h) {
      return  {
        data: new Array(w*h*4)
      };
    },
    putImageData: () => {},
    createImageData: function(){ return []},
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: function(){
      return { width: 0 };
    },
    transform: () => {},
    rect: () => {},
    clip: () => {},
  };
};
