/**
* @function 
* @description textarea, input事件监听
* @return void
* @author iiijr
*/
function eventListen() {
  let targetNode = document.querySelector("body");
  const remarkStartTime = Date.now();
  const actionArr = new Array();
  targetNode.addEventListener('change', function (e) {
    // console.log(e)
    const elementArr = ["INPUT", "TEXTAREA"]
    var element = e.target;
    for (const el of elementArr) {
      if (el === element.tagName) {
        console.log(element.value);
        actionArr.push({
          time: Date.now - remarkStartTime,
          dom: el
        })
        return;
      }
    }
  })
  targetNode.addEventListener('click', function (e) {
    // console.log(e)
    const elementArr = ["BUTTON"];
    var element = e.target;
    for (const el of elementArr) {
      if (el === element.tagName) {
        console.log(element.tagName + "被单击");
        actionArr.push({
          time: Date.now - remarkStartTime,
          dom: el
        })
        return;
      }
    }
  })

}



/**
* @function domActionListen
* @description dom节点是否改变
* @return void
* @author iiijr
*/
function domActionListen() {
  // subtree：是否监听子节点的变化
  const config = { attributes: true, childList: true, subtree: true };
  const callback = function (mutationsList) {
    // Dom发生变化，加载时也会生效
    for (const mutation of mutationsList) {
      console.log(mutation)
      if (mutation.type == "childList") {
        console.log("有一个子节点被添加或移除")
      } else if (mutation.type == "attributes") {
        console.log('这个' + mutation.attributeName + '属性被修改')
      }
    }
  };
  var observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}
