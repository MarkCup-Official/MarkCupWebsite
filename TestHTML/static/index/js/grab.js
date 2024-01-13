// 获取所有可拖动的元素
var draggableElements = document.querySelectorAll('.draggableBox');

// 遍历每个可拖动元素
draggableElements.forEach(function(element) {
  var offsetX, offsetY;

  // 鼠标按下时触发的函数
  function dragStart(e) {
    e.preventDefault();
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    //element.style.z_index= 3;
  }

  // 鼠标移动时触发的函数
  function dragMove(e) {
    var x = e.clientX - offsetX;
    var y = e.clientY - offsetY;

    // 设置新的位置
    element.style.left = x + 'px';
    element.style.top = y + 'px';
  }

  // 鼠标释放时触发的函数
  function dragEnd() {
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
  }

  // 添加鼠标按下事件监听器
  element.addEventListener('mousedown', dragStart);
});