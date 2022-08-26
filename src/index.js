import { watchApi } from "./monitoringModule/userAction.js"
import { httpListenApi } from "./monitoringModule/httpListen.js"
import { watchError } from "./monitoringModule/captureError.js"
import { watchPerf } from "./monitoringModule/performanceMonitoring.js"
import { initDOMaction } from "./monitoringModule/domListenAll/initDOMaction"

/**
 * @function queryURLparams
 * @description 查询url参数 
 * @param url {String} 路径
 * @return void
 * @author zrer0y
 */
function queryURLparams(url) {
    let obj = {}
    if (url.indexOf('?') < 0) return obj
    let arr = url.split('?')
    url = arr[1]
    let array = url.split('&')
    for (let i = 0; i < array.length; i++) {
        let arr2 = array[i]
        let arr3 = arr2.split('=')
        obj[arr3[0]] = JSON.parse(arr3[1])
    }
    return obj;
}

/**
 * @function initSDK
 * @description 初始化SDK 
 * @param opt {Map} 基础配置 
 * @return void
 * @author iiijr
 */
function initSDK(opt = {}) {
    // 内置默认参数
    const config = Object.assign({
        sendPV: true, // 是否上报页面 PV
        sendApi: true, // 是否上报 API 接口请求
        sendError: true, // 是否上报 js error
        sendPerf: true, // 是否上报页面性能
        sendDom: true, // 是否进行dom录制
        openLog: false, // 用于开启 异常监控 和 关键性能检测 的日志
        reportURL: "/metrics/report", //上报信息的接口 (用于异常监控时过滤该接口的异常)
    }, opt);
    console.log("into InitSDK");
    // 监控模块执行，也是需要大伙们顺便添加上去，格式按着来就行
    config.sendPV && watchApi();
    config.sendApi && httpListenApi();
    config.sendError && watchError(config);
    config.sendPerf && watchPerf(config);
    config.sendDom && initDOMaction();
}


/**
 * @function main
 * @description 立即执行函数 
 * @return void
 * @author iiijr
 */
(function () {
    let url = document.getElementById('Argouse').getAttribute('src');
    const params = queryURLparams(url)
    initSDK(params);
    console.log("into SDK");
})();
