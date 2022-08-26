// 全局变量 用于 在还原DOM时 存储和拼接DOM结构
let SplicingDOM = ""

/**
 * @function initDOMtree
 * @description: 初始化DOM树
 * @return {*}
 * @author: Banana
 */
export function initDOMtree() {
  let virtualDOM = {
    tagName: 'body',
    index: 0,
    children: []
  }

  window.addEventListener("load", () => {
    let body = document.body;
    createDOMtree(body, virtualDOM.children)
    console.log('构建的DOM树 :>> ', virtualDOM);
    restoreDOM(virtualDOM.children)
    console.log('根据DOM树还原的DOM结构 :>> ', SplicingDOM);

  })
}



/**
 * @function createDOMtree
 * @description: 创建DOM树
 * @param {Element} el 当前遍历的node节点
 * @param {Object} nodeObject 当前节点存储的object
 * @return {*}
 * @author: Banana
 */
export function createDOMtree(el, nodeObject) {
  let allChildren = el.childNodes
  let currentIndex = 0

  for (const child of allChildren) {
    let currentDOMObject = nodeBaseObject(child, currentIndex)

    // 过滤script元素
    if (child.tagName === "SCRIPT") {
      continue
    } else if (child.nodeType === 1) {
      // 是元素 
      let grandson = child.firstChild
      nodeObject.push(currentDOMObject)

      // 同时拥有孩子
      grandson && createDOMtree(child, nodeObject[currentIndex].children)
    } else {

      // 是字符
      nodeObject.push(currentDOMObject)
    }

    currentIndex++

  }
}



/**
 * @function nodeBaseObject
 * @description: 向对象中添加节点的信息
 * @param {*} node 当前节点
 * @param {*} index 当前节点索引
 * @return {*}
 * @author: Banana
 */
function nodeBaseObject(node, index) {
  let object = {}

  // 当前节点的索引
  object.index = index

  // 只有节点需要 添加 dom、endTag 内容
  if (node.nodeType === 1) {
    // 当前节点DOM元素 
    object.dom = getDOM(node)
    // 如果当前节点是div等包裹元素 返回 </div>
    object.endTag = getEndTag(node, object.dom)
    object.style = node.style.cssText
    object.type = "node"
    object.tagName = node.tagName.toLowerCase()
    object.text = ""
  } else {
    // 文本的 dom、endTag 为空
    object.dom = ""
    object.endTag = ""
    object.style = ""
    object.tagName = ""
    object.type = "text"
    object.text = node.wholeText || `<!--  ${node.nodeValue}  -->`
  }


  object.id = node.id || ""
  object.class = node.className || ""
  object.children = []

  return object
}




/**
 * @function getDOM
 * @description: 检查是否为包裹元素，为包裹元素则提取元素的前半部分标签，如 
 * 包裹元素: <div class="banana aa"><p>bigBanana</p></div> => <div class="banana aa">
 * 普通元素: <p>bigBanana</p> => <p>bigBanana</p>
 * @param {*} node 检测的节点
 * @return {SplicingDOM} 提取的元素
 * @author: Banana
 */
function getDOM(node) {
  const currentTagName = node.tagName.toLowerCase()
  const currentDOM = node.outerHTML.trim()

  let regexp = new RegExp("^<" + currentTagName + "\.\*\?>", "g")
  let matchDOM = currentDOM.match(regexp)
  if (matchDOM) {
    return currentDOM.match(regexp)[0]
  } else {
    return `<${currentTagName}>`
  }

}


/**
 * @function getEndTag
 * @description 如果是包裹元素，获取DOM的 </*> 标签，否则返回空值
 * @param {*} node 检测的节点
 * @return {*}
 * @author: Banana
 */
function getEndTag(node, currentDOM) {
  const currentTagName = node.tagName.toLowerCase()

  let regexp = new RegExp("</" + currentTagName + ">", "g")
  if (!currentDOM.match(regexp)) {
    return `</${currentTagName}>`
  }
  return ''
}


/**
 * @function restoreDOM
 * @description: 根据DOM树还原DOM
 * @param {*} DOMtree 构建的DOM结构
 * @return {*}
 * @author: Banana
 */
export function restoreDOM(DOMtree) {

  DOMtree.forEach(element => {
    // 元素是文本
    if (element.type === "text") {
      SplicingDOM += element.text
    } else if (element.type === "node") {

      SplicingDOM += element.dom

      if (element.children.length !== 0) {
        // 有孩子
        restoreDOM(element.children)
      }
      SplicingDOM += element.endTag

    }

  });
}
