// 获取并显示屏幕高度
var screenHeight=1024
function getScreenHeight() {
    screenHeight = window.innerHeight;
}

window.addEventListener('load', getScreenHeight);
window.addEventListener('resize', getScreenHeight);

// 区间滚动
var content = document.body;
var initialPosition = window.scrollY;
var targetPosition = [0,1];
var nowPos=0;
function handleScroll(event) {
    // 阻止默认的滚动行为
    event.preventDefault();

    // 获取滚轮滚动的方向
    var delta = event.deltaY;
    if(delta<0&&nowPos>0){
        nowPos-=1;
    }else if(delta>0&&nowPos<targetPosition.length-1){
        nowPos+=1;
    }else{
        return;
    }
    var newPosition = targetPosition[nowPos]*screenHeight;

    // 平滑滚动到新位置
    window.scrollTo({
        top: newPosition,
        behavior: 'smooth'
    });
}
window.addEventListener('wheel', handleScroll, { passive: false });

// 触摸滑动处理
var startY;
document.addEventListener('touchstart', function(e) {
    var touch = e.touches[0];
    startY = touch.clientY;
}, false);
document.addEventListener('touchmove', function(e) {
    var touch = e.touches[0];
    var deltaY = touch.clientY - startY;

    if(deltaY >100&&nowPos>0){
        nowPos-=1;
    }else if(deltaY <-100&&nowPos<targetPosition.length-1){
        nowPos+=1;
    }else{
        return;
    }
    var newPosition = targetPosition[nowPos]*screenHeight;

    // 平滑滚动到新位置
    window.scrollTo({
        top: newPosition,
        behavior: 'smooth'
    });

}, false);