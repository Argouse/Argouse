import { sendRequest } from "../util/request.js"




/**
 * @function countDwellTime
 * @description 计算停留时长
 * @param url {String} 路径
 * @param time {Date}  时间
 * @return void
 * @author iiijr
 */
function sendPV(url, time) {
    const data = {
        "type": "pageStay",
        "data": {
            "pageUrl": url,
            "time": time
        }
    }
    sendRequest(data);
}

/**
 * @function countDwellTime
 * @description 计算停留时长
 * @param timeStr {Date}  时间
 * @return t {Date} 停留时长
 * @author iiijr
 */
function countDwellTime(timeStr) {
    let t = new Date().getTime() - timeStr
    timeStr = new Date().getTime()
    console.log('在' + location.href + '页面的时长：' + t)
    return [t, timeStr];
}

/**
 * @function bindHistoryEvent
 * @description 封装自定义事件，为获取用户路由信息 
 * @param type {String} 事件名称
 * @return function
 * @author iiijr
 */
function bindHistoryEvent(type) {
    const historyEvent = history[type];
    return function () {
        const newEvent = historyEvent.apply(this, arguments); //执行history函数
        const e = new Event(type); //声明自定义事件
        e.arguments = arguments;
        window.dispatchEvent(e); //抛出事件
        return newEvent; //返回方法，用于重写history的方法
    };
};

/**
 * @function sendTraceAction
 * @description 上报用户请求链路信息 
 * @param config {Map} 基础配置 
 * @return void
 * @author IMXENON
 */
let traceAction = new Array();
export function sendTraceAction() {
    console.log("traceRoute mounted")
    window.onbeforeunload = (e) => {
        const data = {
            "type": "allTrace",
            "data": {
                "trace": traceAction
            }
        }
        console.log(traceAction);
        // return traceAction
        e.preventDefault();
        return traceAction

    };
}

/**
 * @function watchApi
 * @description 监控页面url并获取用户停留时间 
 * @param config {Map} 基础配置 
 * @return void
 * @author iiijr
 */
export function watchApi() {
    const pathAction = new Array(); // 记录用户访问过的页面路径
    let timeStr = null // 在js运行时获取一次时间

    console.log("into watch");

    // 在页面加载时读取一次时间
    window.onload = function (e) {
        pathAction.push(location.href);
        traceAction.push(location.href)
        console.log(location.href)
        timeStr = new Date().getTime()
    }
    // 重写pushState函数
    history.pushState = bindHistoryEvent('pushState');
    // 重写replaceState函数
    history.replaceState = bindHistoryEvent('replaceState');

    // 监听popState事件
    window.onpopstate = function (event) {
        console.log("popState")
        let t = null;
        [t, timeStr] = countDwellTime(timeStr)
        sendPV(pathAction.pop(), t);
        pathAction.push(location.href)
        traceAction.push(location.href)
    };

    // 监听replaceState函数
    window.addEventListener('replaceState', function (e) {
        let t = null;
        [t, timeStr] = countDwellTime(timeStr)
        sendPV(pathAction.pop(), t);
        pathAction.push(location.href)
        traceAction.push(location.href)
    });

    // 监听pushState函数
    window.addEventListener('pushState', function (e) {
        let t = null;
        [t, timeStr] = countDwellTime(timeStr)
        sendPV(pathAction.pop(), t);
        pathAction.push(location.href)
        traceAction.push(location.href)
    });


    // 监听hashchange函数
    // window.addEventListener('hashchange',()=>{
    //   pathAction.push(location.href)
    //   let t = null;
    //   [t, timeStr] = countDwellTime(timeStr)
    // })
}
