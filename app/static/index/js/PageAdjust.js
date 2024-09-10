var show=true;
var now="h";

function adjustLayout() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspectRatio_now = width / height;

    if(aspectRatio_now>1.1&&now!="h"){
        // 横屏模式
        now="h"
        var element = document.getElementById('logo');
        element.classList.replace('logo_v', 'logo');
        element = document.getElementById('head_box');
        element.classList.replace('head_box_v', 'head_box');
        element.style.height="";
        show=true;
    }
    
    if(aspectRatio_now<1.1&&now!="v"){
        // 竖屏模式
        now="v"
        aspectRatio=aspectRatio_now;
        var element = document.getElementById('logo');
        element.classList.replace('logo', 'logo_v');
        element = document.getElementById('head_box');
        element.classList.replace('head_box', 'head_box_v');
        element.style.height="60px";
        show=false;
    }
}

// 页面加载时和窗口大小改变时调整布局
window.addEventListener('load', adjustLayout);
window.addEventListener('resize', adjustLayout);


// 竖屏菜单
function ShowOrHide() {
    if(now=="v"){
        var element = document.getElementById('head_box');
        if(show){
            element.style.height="60px";
        }else{
            if(isPhone){
                element.style.height="100px";
            }else{
                element.style.height="120px";
            }
        }
        show=!show;
    }
}

//获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
var info = navigator.userAgent;
var isPhone = /mobile/i.test(info);
window.addEventListener('load', Phone);
function Phone(){
    console.log(isPhone);
    if(isPhone){
        var elements = document.getElementsByClassName("head_button");
    for (var i = 0; i < elements.length; i++) {
        var childElement = elements[i].children[0];
        childElement.style.fontSize="10px";
    }
    }
}