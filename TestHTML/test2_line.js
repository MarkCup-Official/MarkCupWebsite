

const canvas = document.getElementById('lines');   //canvas引用
const ctx = canvas.getContext('2d');

const stringCount = 30, shadow = 3;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

var canvasRect = canvas.getBoundingClientRect();

function updateCanvasSize() {
    // 获取Canvas元素的位置和大小
    var canvasRect = canvas.getBoundingClientRect();

    // 计算缩放因子
    scale = canvas.width / canvasRect.width;
}
var scale
updateCanvasSize();
window.addEventListener('resize', function () {
    scaleInfo = updateCanvasSize();
});


function DrawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1 , y1 );
    ctx.lineTo(x2 , y2 );
    ctx.stroke();
    ctx.closePath();
}

function DrawBall(x, y, r) {
    ctx.beginPath();
    ctx.arc(x , y, r , 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}


function Frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    strings.forEach(s => {
        s.frame();
    });

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 3*scale;
    strings.forEach(s => {
        let p = s.getString();
        let n = p.length;
        for (let i = 1; i < n; i++) {

            DrawLine(p[i][0] + shadow*scale, p[i][1] + shadow*scale, p[i - 1][0] + shadow*scale, p[i - 1][1] + shadow*scale);

        }
    });

    ctx.strokeStyle = 'rgba(200, 0, 0,1)';
    ctx.lineWidth = 3*scale;
    strings.forEach(s => {
        let p = s.getString();
        let n = p.length;
        for (let i = 1; i < n; i++) {
            DrawLine(p[i][0], p[i][1], p[i - 1][0], p[i - 1][1]);

        }
    });


    // 画线
    /*
    ctx.beginPath();

    var rect = draggableElements[0].getBoundingClientRect();

    for (let i = 1; i < n; i++) {
        var p = rect;
        rect = draggableElements[i].getBoundingClientRect();

        DrawLine(p.left, p.top, rect.left, rect.top, 5, 'rgba(0, 0, 0, 0.1)');
    }

    ctx.closePath();
*/

ctx.fillStyle = "rgba(0, 0, 0,0.2)";
strings.forEach(s => {
    let p = s.getString();
    let n = p.length-1;
    DrawBall(p[0][0]+ shadow*scale,p[0][1]+ shadow*scale,10*scale);
    
    DrawBall(p[n][0]+ shadow*scale,p[n][1]+ shadow*scale,10*scale);
});
ctx.fillStyle = "rgba(80, 80, 80, 1)";
strings.forEach(s => {
    let p = s.getString();
    let n = p.length-1;
    DrawBall(p[0][0],p[0][1],10*scale);
    
    DrawBall(p[n][0],p[n][1],10*scale);
});


    requestAnimationFrame(Frame);
}


class String {
    pos = []
    v = []

    constructor(start, end, count) {
        let n = count;
        this.count = count;

        this.start = start;
        this.end = end;

        let s = start.getBoundingClientRect();
        let e = end.getBoundingClientRect();

        let dx = e.left - s.left, dy = e.top - s.top;

        for (let i = 0; i < n + 2; i++) {
            this.pos.push([(s.left + dx * i / (n + 1))* scale, (s.top + dy * i / (n + 1))*scale]);
            this.v.push([0, 0]);
        }
        this.lastTime = performance.now();

        this.d=dis([0,0],[dx* scale,dy* scale])/(count+1)*1.1;
        console.log(this.d);
    }



    getString() {

        let res = this.pos;
        let s = this.start.getBoundingClientRect();
        let e = this.end.getBoundingClientRect();
        res[0] = [s.left* scale, s.top* scale];
        res[res.length - 1] = [e.left* scale, e.top* scale];

        return res;
    }

    frame(){
        let now =performance.now();
        
        let time = (now - this.lastTime) / 1000;
        
        this.lastTime = now;

        let n = this.count;

        let s = this.start.getBoundingClientRect();
        let e = this.end.getBoundingClientRect();
        this.pos[0] = [s.left* scale, s.top* scale];
        this.pos[this.pos.length - 1] = [e.left* scale, e.top* scale];

        // 重力, 加速度
        for (let i = 1; i <= n; i++) {
            this.v[i][1] += g * time;
        }
        // 应用速度
        for (let i = 1; i <= n; i++) {
            this.pos[i][0] += this.v[i][0] * time;
            this.pos[i][1] += this.v[i][1] * time;
        }

        //拉绳
        for(let _=0;_<3;_++){
            for (let i = 1; i <= n; i++) {
                if(dis(this.pos[i-1],this.pos[i])>this.d){
                    let d=shouldMove(this.pos[i-1],this.pos[i],this.d);
                    //this.v[i][0] +=d[0]*time*10000;
                    //this.v[i][1] +=d[1]*time*10000;
                    this.pos[i]=[this.pos[i-1][0]+d[0],this.pos[i-1][1]+d[1]];
                }
            }
            for (let i = n; i >=1; i--) {
                if(dis(this.pos[i+1],this.pos[i])>this.d){
                    let d=shouldMove(this.pos[i+1],this.pos[i],this.d);
                    //this.v[i][0] +=d[0]*time*10000;
                    //this.v[i][1] +=d[1]*time*10000;
                    this.pos[i]=[this.pos[i+1][0]+d[0],this.pos[i+1][1]+d[1]];
                }
            }
        }

        // 速度阻力
        for (let i = 1; i <= n; i++) {
            this.v[i][0] *= 0.9;
            this.v[i][1] *= 0.9;
        }


    }
}
function dis(a, b) {
    return Math.sqrt(Math.pow((b[0] - a[0]), 2) + Math.pow((b[1] - a[1]), 2));
}

function shouldMove(a, b, r) {
    // 计算向量AB
    const vectorAB = [b[0] - a[0], b[1] - a[1]];

    // 计算向量AB的长度
    const lengthAB = Math.sqrt(vectorAB[0] ** 2 + vectorAB[1] ** 2);

    // 单位化向量AB
    const unitVectorAB = [vectorAB[0] / lengthAB, vectorAB[1] / lengthAB];

    // 将单位化的向量乘以r，得到与原向量方向相同且长度为r的向量
    const resultVector = [unitVectorAB[0] * r, unitVectorAB[1] * r];

    return [resultVector[0] , resultVector[1]];
}


const g = 23333;

// 获取所有可拖动的元素
var stringsele = document.querySelectorAll('.string');

var strings = [];

let n = stringsele.length;
for (let i = 0; i < n; i++) {
    let id = stringsele[i].id;
    let c = id.slice(1, id.length);
    if (id[0] == "s") {
        for (let j = 0; j < n; j++) {
            let id2 = stringsele[j].id;
            let c2 = id2.slice(1, id2.length);
            if (c2 == c && i != j) {
                strings.push(new String(stringsele[i], stringsele[j], stringCount));
            }
        }
    }

}

Frame();