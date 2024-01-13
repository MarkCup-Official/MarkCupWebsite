function Start() {
    ctxBG.strokeStyle = '#f0f0f0';
    ctxBG.lineWidth = lineWidth;

    let width=canvasWidth/lineCount;
    for(let x=0;x<lineCount;x++){
        ctxBG.beginPath();
        ctxBG.moveTo(x*width, 0);
        ctxBG.lineTo(x*width,canvasHeight);
        ctxBG.stroke();
        ctxBG.closePath();
    }
    for(let x=0;x<lineCount;x++){
        ctxBG.beginPath();
        ctxBG.moveTo(0, x*width);
        ctxBG.lineTo(canvasWidth,x*width);
        ctxBG.stroke();
        ctxBG.closePath();
    }
}

const canvasBG = document.getElementById('background');   //canvas引用
const ctxBG = canvasBG.getContext('2d');



const canvasHeight = 1080, canvasWidth = 1920;  // 长宽像素设置
canvasBG.width = canvasWidth;
canvasBG.height = canvasHeight;

const lineWidth=2;
const lineCount=40;

var isFrameUpdate = true;

Start();