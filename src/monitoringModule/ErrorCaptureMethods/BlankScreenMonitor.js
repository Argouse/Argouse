import {
    addWhiteScreenError
} from "./ReportInfo"
import {
    errorType
} from "./EnumErrorType"


/**
 * @function blankScreenCapture
 * @description: 开启白屏异常检测 
 * @param {*} options 用户的配置
 * @return {*}
 * @author: Banana
 */
export function blankScreenCapture(options) {

    setTimeout(() => {
        checkBlanckScreen(options)
    }, 4000);

    // window.addEventListener('load', checkBlanckScreen(options));
}


/**
 * @function checkBlanckScreen
 * @description: 在DOM节点挂载完成后取16个的节点内容 若大于15个节点没有内容或是为包裹元素 上报白屏异常
 * @param {*} options 用户的配置
 * @return {*}
 * @author: Banana
 */
function checkBlanckScreen(options) {

    let textNum = 0;
    const x = document.documentElement.clientWidth;
    const y = document.documentElement.clientHeight;
    for (let i = 1; i < 9; i++) {
        const currentx = (x / 8 * i) - x / 16;
        const currenty = (y / 8 * i) - y / 16;

        const currentColDOM = document.elementFromPoint(x / 2, currenty);
        const currentRowDOM = document.elementFromPoint(currentx, y / 2);
        textNum += isEmptyDOM(currentColDOM);
        textNum += isEmptyDOM(currentRowDOM);

        options.openLog && createDetectionPoint(x / 2, currenty);
        options.openLog && createDetectionPoint(currentx, y / 2);
    }

    // 16个白屏检测点中若有十五个以上都是包裹元素，则上报白屏错误
    if (textNum >= 15) {
        let whiteScreenInfo = {
            type: errorType.blankScreenError,
            data: {
                'pageUrl': window.location.href,
                'whiteScreenDOMNums': textNum,
                'timeStamp': Date.now()
            }
        };
        addWhiteScreenError(whiteScreenInfo);
    }
    options.openLog && console.log('屏幕上16个采样点中空白的数量 :>> ', textNum);

    // return function () {

    // }
}


/**
 * @function isEmptyDOM
 * @description: 检验当前DOM是否为 emptyDOM 中的 空|包裹 元素
 * @param {*} element 检测的DOM
 * @return {Number} 是空则返回0 其他元素返回1
 * @author: Banana
 */
function isEmptyDOM(element) {
    let emptyNum = 0;
    const emptyDOM = ['html', 'body', 'div'];
    emptyDOM.forEach((item) => {
        if (element.tagName.toLowerCase() === item) {
            emptyNum = 1;
        }
    });
    return emptyNum;
}




/**
 * @function createDetectionPoint
 * @description: 
 * @param {*} left 监测点x坐标
 * @param {*} bottom 监测点y坐标
 * @return void
 * @author: Banana
 */
function createDetectionPoint(left, bottom) {
    // 创建 message 元素
    const message = document.createElement('div');
    message.style.cssText = 'position:fixed; color: red';
    message.style.left = left + 'px';
    message.style.top = bottom + 'px';
    message.innerHTML = "<p>+</p>";
    document.body.append(message);
}
