import { TaskQueue } from "../../util/requestQueue"

/**
 * @function findDOMbyAllIndex
 * @description: 通过索引列表 定位到该索引的DOM元素 并且返回   （恢复用）
 * @param {Array} allIndex 索引列表
 * @param {*} startNode 开始的节点 默认是从body开始
 * @return {Element}
 * @author: Banana
 */
function findDOMbyAllIndex(allIndex, startNode = document.body) {
    let currentNode = startNode


    for (const item of allIndex) {

        currentNode = currentNode.children[item]

    }

    return currentNode
}


/**
 * @function displayButtonClick
 * @description: 用于展现按钮被点击的效果  （恢复用）
 * @param {Element} node
 * @return {void}
 * @author: Banana
 */
function displayButtonClick(node) {

    node.style.backgroundColor = "#307c6a"
    node.style.color = "#f1cfc1"

    setTimeout(() => {
        node.style.backgroundColor = ""
        node.style.color = ""
    }, 500);

}


/**
 * @function updateText
 * @description: 向文本框中逐字填入数据
 * @param {*} node 文本框节点 （恢复用）
 * @param {*} text 文本内容
 * @param {*} time 填内容的时间
 * @return {*}
 * @author: Banana
 */
function updateText(node, text, time) {
    setTimeout(() => {
        node.value = text
    }, time);
}

/**
 * @function updateDOM
 * @description: 根据传入的 新节点数据 ，更新虚拟DOM
 * @param {*} screenDOM 新元素要在该节点内更新 （恢复用）
 * @param {*} DOMtree 更新的信息
 * @return {*}
 * @author: Banana
 */
function updateDOM(screenDOM, DOMtree) {
    screenDOM.innerHTML = DOMtree
}




/**
 * @function displayTextUpdate
 * @description: 播放文本的更改  （恢复用）
 * @param {*} node 更改的节点
 * @param {*} text 更改的内容
 * @return {void}
 * @author: Banana
 */
function displayTextUpdate(node, text) {
    // --------------- 逐字向文本框输入    有bug，弃用
    /*
    console.log('node :>> ', node);
    let stratTime = 0
    let CurrentText = ""
    for (const item of text) {


        CurrentText += item
        updateText(node, CurrentText, stratTime)
        stratTime += 100



    }*/
    // ---------------
    node.style.backgroundColor = "#307c6a"
    node.style.color = "#f1cfc1"
    node.value = text

    setTimeout(() => {
        node.style.backgroundColor = ""
        node.style.color = ""
    }, 500);

}




/* data需要的数据

data = [
    {   // 首屏DOM
        domInfo:"<div> ... </div>",
        info: 'originInfo',
        'timeStamp': 114514,
        'pageUrl': 'x.x.x.x/x.html'
    }, 
    {   // 所有该页面上传的数据 按照时间从小到大排列...
        domInfo:"<div> ... </div>",
        info: 'DOMupdate',
        'timeStamp': 114514,
        'pageUrl': 'x.x.x.x/x.html'
    }, 
    ...
]
*/


/**
 * @functiondisplayDOMupdate
 * @description: 按顺序还原记录到的用户操作  还原时调用该方法
 * @param {Object} data
 * @return {void}
 * @author: Banana
 */
function displayDOMupdate(data) {
    const playscreen = document.querySelector("#monitor")
    const playBar = document.querySelector("#currentplay")
    const message = document.querySelector("#message").innerHTML = "this page from " + data[0].pageUrl
    const startTime = data[0].timeStamp
    let allEventStime = []

    for (const item of data) {
        let currentTargetTime = item.timeStamp - startTime
        allEventStime.push(currentTargetTime)
    }


    let partlyBar = 100 / data.length



    for (const index in allEventStime) {

        setTimeout(() => {

            if (data[index].type === "DOMupdate" || data[index].type === "originInfo") {
                // 这条数据 是DOM更改操作

                updateDOM(playscreen, data[index].domInfo)


            } else if (data[index].type === "buttonClick") {
                // 这条数据 是 button 点击事件

                let thisButton = findDOMbyAllIndex(data[index].domInfo, playscreen)
                displayButtonClick(thisButton)

            } else if (data[index].type === "textUpdate") {
                // 这条数据 是 text 更改事件

                let textArea = findDOMbyAllIndex(data[index].domInfo, playscreen)
                displayTextUpdate(textArea, data[index].text)

            }


            let currentIndex = parseInt(index) + 1

            playBar.style.width = partlyBar * currentIndex + "vw"

        }, allEventStime[index]);

    }
}


/**
 * @function getDOMopera
 * @description: 获取所有的的操作，并且在页面中逐步还原
 * @return {void}
 * @author: Banana
 */
export function getDOMopera() {

    // TaskQueue.addTask(



    // )

    const replayUrl = windows.epimetheus + "/replay/getDOMevent?reportid=" + windows.reportId
    fetch(replayUrl, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'get'
    }).then((res) => {
        res.json().then((data) => {

            console.log('data :>> ', data.data);

            displayDOMupdate(data.data)


        })
    })


}
