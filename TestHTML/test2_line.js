/**
 * 创建日期: 2024/1/12
 * 作者: MarkCup
 * 介绍:
 * html绳子代码
 * 在html中使用<div class="string" data-id="sx" data-len="1.1"></div>创建起点
 * 使用<div class="string" id="ex"></div>创建终点
 * 其中x为一个数字, 起点终点需要一一对应
 * length意味着绳子将比起点到终点的距离长几倍, 如1代表绳子初始时绷紧
 */

const canvas = document.getElementById('lines');   //canvas引用
const ctx = canvas.getContext('2d');

const stringCount = 30; //每一条绳子包含的节点数量
const shadow = 3;       //绳子的影子距离

canvas.width = 1920;
canvas.height = 1080;

var scale;              // 画布缩放因数

const g = 23333;        // 绳子重力加速度

// 计算画布缩放因数
function updateCanvasSize() {
    var canvasRect = canvas.getBoundingClientRect();
    scale = canvas.width / canvasRect.width;
}

// 计算画布因数, 并在每次重新缩放后重新计算
updateCanvasSize();
window.addEventListener('resize', function () {
    scaleInfo = updateCanvasSize();
});

// 在画布上画一条线
function DrawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

// 在画布上画一个圆
function DrawBall(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

// 每帧更新
function Frame() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 运行绳子
    strings.forEach(s => {
        console.log(s);
        s.frame();
    });

    // 画绳子影子
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    strings.forEach(s => {
        ctx.lineWidth = s.width;
        let p = s.getString();
        let n = p.length;
        for (let i = 1; i < n; i++) {
            DrawLine(p[i][0] + shadow * scale, p[i][1] + shadow * scale,
                 p[i - 1][0] + shadow * scale, p[i - 1][1] + shadow * scale);
        }
    });

    // 画绳子
    strings.forEach(s => {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        let p = s.getString();
        let n = p.length;
        for (let i = 1; i < n; i++) {
            DrawLine(p[i][0], p[i][1], p[i - 1][0], p[i - 1][1]);
        }
    });

    // 画钉子影子
    ctx.fillStyle = "rgba(0, 0, 0,0.2)";
    strings.forEach(s => {
        let p = s.getString();
        let n = p.length - 1;
        DrawBall(p[0][0] + shadow * scale, p[0][1] + shadow * scale, s.size);
        DrawBall(p[n][0] + shadow * scale, p[n][1] + shadow * scale, s.size);
    });

    // 画钉子
    ctx.fillStyle = "rgba(80, 80, 80, 1)";
    strings.forEach(s => {
        let p = s.getString();
        let n = p.length - 1;
        DrawBall(p[0][0], p[0][1], s.size);
        DrawBall(p[n][0], p[n][1], s.size);
    });

    // 添加下一帧的调用
    requestAnimationFrame(Frame);
}

// 一条绳子
class String {

    // 初始化
    constructor(start, end, count, length, width, color, size) {
        this.pos = []
        this.v = []

        this.count = count;

        this.start = start;
        this.end = end;

        this.width = width;
        this.color = color;
        this.size = size;

        let s = start.getBoundingClientRect();
        let e = end.getBoundingClientRect();

        this.lastTime = performance.now();

        // 平均生成绳子节点位置
        let dx = e.left - s.left, dy = e.top - s.top;
        for (let i = 0; i < this.count + 2; i++) {
            this.pos.push([(s.left + dx * i / (this.count + 1)) * scale, (s.top + dy * i / (this.count + 1)) * scale]);
            this.v.push([0, 0]);
        }
        this.d = this.dis([0, 0], [dx * scale, dy * scale]) / (count + 1) * length;

        // 让绳子动一会
        for (let i = 0; i < 233; i++) {
            this.frame(true);
        }
    }

    // 获取绳子当前所有节点
    getString() {
        let res = this.pos;
        let s = this.start.getBoundingClientRect();
        let e = this.end.getBoundingClientRect();
        res[0] = [s.left * scale, s.top * scale];
        res[res.length - 1] = [e.left * scale, e.top * scale];

        return res;
    }

    // 更新一帧的物理运动
    frame(force = false) {
        let time = 0;
        if (force) {
            time = 0.01;
        } else {
            // 获取当前时间
            let now = performance.now();
            time = (now - this.lastTime) / 1000;
            this.lastTime = now;
        }

        // 更新头尾节点位置
        let s = this.start.getBoundingClientRect();
        let e = this.end.getBoundingClientRect();
        this.pos[0] = [s.left * scale, s.top * scale];
        this.pos[this.pos.length - 1] = [e.left * scale, e.top * scale];

        // 重力, 加速度
        for (let i = 1; i <= this.count; i++) {
            this.v[i][1] += g * time;
        }

        // 应用速度
        for (let i = 1; i <= this.count; i++) {
            this.pos[i][0] += this.v[i][0] * time;
            this.pos[i][1] += this.v[i][1] * time;
        }

        //拉绳
        for (let _ = 0; _ < 3; _++) {
            for (let i = 1; i <= this.count; i++) {
                if (this.dis(this.pos[i - 1], this.pos[i]) > this.d) {
                    let d = this.shouldMove(this.pos[i - 1], this.pos[i], this.d);
                    //this.v[i][0] +=d[0]*time*10000; //惯性, 会有奇怪的bug, 弃用
                    //this.v[i][1] +=d[1]*time*10000;
                    //this.v[i][1] =0;
                    this.pos[i] = [this.pos[i - 1][0] + d[0], this.pos[i - 1][1] + d[1]];
                }
            }
            for (let i = this.count; i >= 1; i--) {
                if (this.dis(this.pos[i + 1], this.pos[i]) > this.d) {
                    let d = this.shouldMove(this.pos[i + 1], this.pos[i], this.d);
                    //this.v[i][0] +=d[0]*time*10000;
                    //this.v[i][1] +=d[1]*time*10000;
                    //this.v[i][1] =0;
                    this.pos[i] = [this.pos[i + 1][0] + d[0], this.pos[i + 1][1] + d[1]];
                }
            }
        }

        // 速度阻力
        for (let i = 1; i <= this.count; i++) {
            this.v[i][0] *= 0.95;
            this.v[i][1] *= 0.95;
        }
    }

    // 计算两点距离([x,y],[x,y])->[x,y]
    dis(a, b) {
        return Math.sqrt(Math.pow((b[0] - a[0]), 2) + Math.pow((b[1] - a[1]), 2));
    }

    // 计算每一个绳子节点需要被拉扯的距离([x,y],[x,y],distance)->[x,y]
    shouldMove(a, b, r) {
        const vectorAB = [b[0] - a[0], b[1] - a[1]];
        const lengthAB = Math.sqrt(vectorAB[0] ** 2 + vectorAB[1] ** 2);
        const unitVectorAB = [vectorAB[0] / lengthAB, vectorAB[1] / lengthAB];
        const resultVector = [unitVectorAB[0] * r, unitVectorAB[1] * r];
        return [resultVector[0], resultVector[1]];
    }
}

// 获取所有绳子节点, 并实例化绳子
var stringsele = document.querySelectorAll('.string');
var strings = [];
let n = stringsele.length;
for (let i = 0; i < n; i++) {
    let id = stringsele[i].dataset.id;
    let c = id.slice(1, id.length);
    if (id[0] == "s") {
        for (let j = 0; j < n; j++) {
            let id2 = stringsele[j].dataset.id;
            let c2 = id2.slice(1, id2.length);
            if (c2 == c && i != j) {
                strings.push(new String(stringsele[i], stringsele[j], stringCount,
                    parseFloat(stringsele[i].dataset.len),
                    parseFloat(stringsele[i].dataset.width),
                    stringsele[i].dataset.color,
                    parseFloat(stringsele[i].dataset.size)));
            }
        }
    }

}

// 开始动画
Frame();