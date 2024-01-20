function Start() {
    ctxBG.strokeStyle = "rgba(0,0,0,0.1)";
    ctxBG.lineWidth = lineWidth;

    ctxBG.fillStyle = '#f0f0f0';
    ctxBG.fillRect(0, 0, canvasWidth, canvasHeight);

    let width=canvasWidth/lineCount;
    for(let x=0;x<lineCount;x++){
        ctxBG.beginPath();
        ctxBG.moveTo(x*width, 0);
        ctxBG.lineTo(x*width,canvasHeight);
        ctxBG.stroke();
        ctxBG.closePath();
    }
    for(let x=0;x*width<=canvasHeight;x++){
        ctxBG.beginPath();
        ctxBG.moveTo(0, x*width);
        ctxBG.lineTo(canvasWidth,x*width);
        ctxBG.stroke();
        ctxBG.closePath();
    }
}

const canvasBG = document.getElementById('background');   //canvas引用
const ctxBG = canvasBG.getContext('2d');



var canvasWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var canvasHeight = 1.8*canvasWidth//window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;  // 长宽像素设置

canvasBG.width = canvasWidth;
canvasBG.height = canvasHeight;

const lineWidth=3;
const lineCount=40;

var isFrameUpdate = true;

Start();