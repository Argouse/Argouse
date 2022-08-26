import { reportDOMevent } from "../../util/request"


/**
 * @function initDOMtree
 * @description: 初始化DOM树
 * @return {*}
 * @author: Banana
 */
export function initDOMtree() {

    window.addEventListener("load", () => {

        // 构建更新的数据
        let originInfo = nodeBaseObject(document.body, 0, "originInfo")
        creatDOMtree(document.body, originInfo.children)

        // let reportInfo = {
        //     'domInfo': restoreDOMtag("", originInfo),
        //     'type': 'originInfo',
        //     'timeStamp': Date.now(),
        //     'pageUrl': window.location.href
        // }

        let reportInfo = {
            data: {
                'domInfo': restoreDOMtag("", originInfo),
                'type': 'originInfo',
                'timeStamp': Date.now(),
                'pageUrl': window.location.href
            }
        }


        reportDOMevent(reportInfo)
        // TODO 上报数据



        console.log('reportInfo :>> ', reportInfo);
    })
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
 * @function restoreDOMtag
 * @description: 根据 DOM树 还原 HTML 标签
 * @param {*} strHtml 为空字符串 ""，用于递归时存储与拼接标签
 * @param {*} DOMtree 构建的DOM结构
 * @return {String} 拼接好的HTML标签
 * @author: Banana
 */
function restoreDOMtag(strHtml, DOMtree) {
    if (DOMtree.dom != null) strHtml += DOMtree.dom;
    if (DOMtree.children.length != 0) {
        DOMtree.children.forEach(el => {
            if (el.type === "text") {
                strHtml += el.text.trim()

            } else if (el.type === "node") {
                strHtml += restoreDOMtag("", el);
            }
        })
    }
    if (DOMtree.endTag != null) return strHtml += DOMtree.endTag;
    else return strHtml
}



/**
 * @function getTreeNodeByIndex
 * @description: 通过新增节点的索引，查找虚拟DOM下是否存在相同索引的节点
 * @param {*} newDOM 新增节点
 * @param {*} DOMtree 虚拟DOM 中 与新增节点处于相等层级的 children 列表
 * @return {object} 查询到则返回虚拟DOM下 相同索引的节点，否则返回 undefined
 * @author: Banana
 */
function getTreeNodeByIndex(newDOM, DOMtree) {
    let index = newDOM.index
    let nums = 0
    for (let i = 0; i < DOMtree.length; i++) {
        if (DOMtree[i].nodeType === "node") {
            if (nums === index) return DOMtree[i]
            nums++
        }
    }

    return undefined
}


/**
 * @function insertNode
 * @description: 根据新增节点的 index，在虚拟DOM中 插入新增节点并且重新整理索引 
 * @param {*} newNode 新增节点
 * @param {*} DOMchildren 虚拟DOM 中 与新增节点处于相等层级的 children 列表
 * @return {*}
 * @author: Banana
 */
function insertNode(newNode, DOMchildren) {
    let temp = newNode
    let nextChild = newNode

    let currentIndex = getTreeNodeByIndex(newNode, DOMchildren).index

    for (let i = currentIndex; i < DOMchildren.length; i++) {
        temp = Object.assign({}, DOMchildren[i])
        DOMchildren[i] = Object.assign(DOMchildren[i], nextChild)
        // 后面的DOM元素 index 都需要+1
        DOMchildren[i].index = i
        nextChild = temp
    }

    // 在最后一位插入 超过当前 children 长度的最后一位
    nextChild.index = DOMchildren.length
    DOMchildren.push(nextChild)

}




/**
 * @function mockStringify
 * @description: 格式化 更新节点的数据
 * @param {*} nodes 更新节点的数据
 * @return {*}
 * @author: Banana
 */
function mockStringify(nodes) {

    for (const node of nodes) {
        // 过滤 文本节点
        if (node.nodeType === "text") continue

        node.dom = splicingDOMLable(node)
        node.endTag = `</${node.tagName}>`
        node.nodeType = "node"


        if (node.children) {
            // 有孩子 并且标签内有文字 需要在他的children首部插入 文本节点
            if (node.text) {
                node.children.unshift({
                    index: 0,
                    text: node.text,
                    nodeType: "text"
                })
            }

            // 继续格式化他的孩子
            mockStringify(node.children)
        } else {
            // 没有孩子但标签内有文字 需要在他的children首部插入 文本节点
            if (node.text) {
                node.children = [{
                    index: 0,
                    text: node.text,
                    nodeType: "text"
                }]
            }
        }
    }

}



/**
 * @function splicingDOMLable
 * @description: 拼接DOM标签
 * @param {*} node 需要拼接的node
 * @return {*}
 * @author: Banana
 */
function splicingDOMLable(node) {
    let newLable = `<${node.tagName}`
    newLable += node.class ? ` class = "${node.class}" ` : ""
    newLable += node.id ? ` id = "${node.id}" ` : ""
    newLable += node.style ? ` style = "${node.style}" ` : ""
    newLable += ">"
    return newLable
}




/**
 * @function nodeBaseObject
 * @description: 向对象中添加节点的信息
 * @param {*} node 当前节点
 * @param {*} index 当前节点索引
 * @return {*}
 * @author: Banana
 */
function nodeBaseObject(node, index, operation = undefined) {
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

    //有 operation 则在对象中添加该属性
    operation && (object.operation = operation)

    object.id = node.id || ""
    object.class = node.className || ""
    object.children = []

    return object
}






/**
 * @function creatDOMtree
 * @description: 创建DOM树
 * @param {*} el 当前遍历的node节点
 * @param {*} nodeObject 当前节点存储的object
 * @param {*} definiteIndex 如果当前节点有确定的索引 可通过此传入
 * @param {*} operation 如果带有DOM的行为操作 可通过此传入
 * @return {*}
 * @author: Banana
 */
function creatDOMtree(el, nodeObject, definiteIndex = 0, operation = undefined) {
    let allChildren = el.childNodes
    let currentIndex = 0

    for (const child of allChildren) {
        // 过滤script元素
        if (child.tagName === "SCRIPT") {

            continue

        } else if (child.nodeType === 1) {
            // 是元素 
            let grandson = child.firstChild
            nodeObject.push(nodeBaseObject(child, definiteIndex, operation))

            grandson && creatDOMtree(child, nodeObject[currentIndex].children, 0, operation)
        } else {

            // 是字符
            nodeObject.push(nodeBaseObject(child, definiteIndex, operation))
        }
        definiteIndex++
        currentIndex++

    }
}



/**
 * @function getCurrentDOMindex
 * @description: 获取当前元素在它父元素中的的索引
 * @param {*} node
 * @return {*}
 * @author: Banana
 */
function getCurrentDOMindex(node) {
    // body 的 parentElement 没有 children
    if (node.tagName === "BODY") return 0

    let nodeParent = node.parentElement.children
    let index = 0

    for (const item of nodeParent) {
        if (item === node) return index
        else if (item.tagName !== "SCRIPT") index++
        // 过滤 script 标签
    }
}





/**
 * @function reportDOMupdate
 * @description: dom树改变后 上报更改的数据
 * @return {*}
 * @author: Banana
 */
export function reportDOMupdate() {
    // 构建更新的数据
    let updateInfo = nodeBaseObject(document.body, 0, "update")
    creatDOMtree(document.body, updateInfo.children)


    // 向元素中添加时间戳
    let reportInfo = {
        data: {
            'domInfo': restoreDOMtag("", updateInfo),
            'type': 'DOMupdate',
            'timeStamp': Date.now(),
            'pageUrl': window.location.href
        }

    }





    // TODO 上报
    reportDOMevent(reportInfo)




    console.log('reportInfo :>> ', reportInfo);
}





/**
 * @function reportButtonClick
 * @description: 上报按钮点击事件
 * @param {*} node 要获取索引的节点
 * @return {*}
 * @author: Banana
 */
export function reportButtonClick(node) {


    let indexArr = getNodeAllIndex(node)

    let reportInfo = {
        data: {
            'domInfo': indexArr, // 通过索引可以直接定位到元素
            'type': 'buttonClick',
            'timeStamp': Date.now(),
            'pageUrl': window.location.href
        }
    }

    console.log('reportInfo :>> ', reportInfo);



    reportDOMevent(reportInfo)
    // TODO  上报数据



}




/**
 * @function reportTextUpdate
 * @description: 上报文本更改事件
 * @param {*} node 触发事件的节点
 * @return {*}
 * @author: Banana
 */
export function reportTextUpdate(node) {

    let indexArr = getNodeAllIndex(node)

    let reportInfo = {
        data: {
            'domInfo': indexArr, // 通过索引可以直接定位到元素
            'text': node.value,
            'type': 'textUpdate',
            'timeStamp': Date.now(),
            'pageUrl': window.location.href
        }
    }




    reportDOMevent(reportInfo)
    // TODO  上报数据



    console.log('reportInfo :>> ', reportInfo);
}






/**
 * @function: 
 * @description: 获取节点从body到自身的索引 body - > ( div -> h1, p ) 这时 h1 的索引为 0(bod中的第0个div) 0(div中的第0个h1)
 * @param {*} node 要获取索引的节点
 * @return {Array} 从body到自身的索引
 * @author: Banana
 */
function getNodeAllIndex(node) {
    let IndexArr = []

    console.log('node :>> ', node);

    let virtualDOM = node

    while (virtualDOM.tagName !== "BODY") {

        let currentIndex = getCurrentDOMindex(virtualDOM)
        IndexArr.push(currentIndex)
        virtualDOM = virtualDOM.parentElement

    }

    IndexArr.reverse()

    console.log('IndexArr :>> ', IndexArr);

    return IndexArr
}
