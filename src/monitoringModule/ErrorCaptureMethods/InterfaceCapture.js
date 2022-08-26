import {
    addInterfaceError
} from "./ReportInfo"
import {
    errorType
} from "./EnumErrorType"





/**
 * @function sendSuccessRate
 * @description: 统计响应成功率
 * @param  {*} statusCode
 * @return void
 * @author: IMXENON
 */
let requestTimes = 0
let success = 0

export function sendSuccessRate() {
    console.log("Send rates success mounted")
    const rate = success / requestTimes
    const data = {
        "type": "successRate",
        "data": {
            "rate": rate
        }
    }
    return data
}

/**
 * @function sendTrace
 * @description: 链路信息
 * @param  {*} statusCode
 * @return void
 * @author: IMXENON
 */
const trace = new Array();
export function sendTrace() {
    console.log("traceRoute mounted")
    const data = {
        "type": "allTrace",
        "data": {
            "trace": trace
        }
    }
    return data
}

// /**
//  * @function sendStatusCodes
//  * @description: 统计响应成功率
//  * @param  {*} statusCode
//  * @return void
//  * @author: IMXENON
//  */
// const codes = new Array();
// export function sendStatusCodes() {
//     console.log("statusCodes mounted")

//     const data = {
//         "type": "requestInfo",
//         "data": {
//             "codes": codes,

//         }
//     }
//     return data
// }

/**
 * @function interfaceCapture
 * @description: 开启接口异常检测
 * @param {*} options 用户的配置
 * @return void
 * @author: Banana
 */
export function interfaceCapture(options) {
    checkXHRError(options);
    checkFetchError(options);
}



/**
 * @function checkXHRError
 * @description: 拦截 XHR 异常
 * @param {*} options 用户的配置
 * @return void
 * @author: Banana
 */
function checkXHRError(options) {
    // const XMLHttpRequest = window.XMLHttpRequest;
    const oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, isAsync) {
        // 取得上报的url 并且过滤上报的信息
        const reportURL = options.reportURL;

        // 过滤 错误上报 的接口
        if (reportURL === "" || url.indexOf(reportURL) === -1) {
            this.logData = {
                method,
                url,
                isAsync,
            };
            // debugger
        }
        return oldOpen.apply(this, arguments);
    };

    const oldSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if (this.logData) {
            const startTime = Date.now();

            const handle = (type) => (event) => {
                // 请求时长
                const duration = Date.now() - startTime;
                const status = this.status;
                // 请求结果
                const statusText = this.statusText;
                // 响应结果的第一位 如200 取 2 
                const BeginningResponse = Math.floor(status / 100);
                // 每次响更新成功率
                console.log()
                trace.push({ "status": status, "trace": this.logData.url })
                requestTimes++;
                if (status == 200) {
                    success++
                }
                console.log("success rate==>",
                    success / requestTimes, "request times==>", requestTimes, "success times==>", success)

                // 仅在状态码错误时上报
                if (BeginningResponse !== 2) {
                    const interfaceInfo = {
                        type: errorType.interfaceError,
                        // 请求持续的时间
                        data: {
                            duration,
                            'pageUrl': window.location.href,
                            'interfaceURL': this.logData.url,
                            'status': status + ' ' + statusText,
                            'response': this.response ? JSON.stringify(this.response) : '',
                            'timeStamp': Date.now()
                        }
                    };
                    options.openLog && console.log('xhr error :>> ', interfaceInfo);
                    addInterfaceError(interfaceInfo);
                }
            };

            this.addEventListener('error', handle('error'));
            this.addEventListener('load', handle('load'));
            this.addEventListener('abort', handle('abort'));
        }
        return oldSend.apply(this, arguments);
    };
}

/**
 * 
 */

/**
 * @function checkFetchError
 * @description: 捕获 fetch 异常
 * @param {*} options 用户的配置
 * @return void
 * @author: Banana
 */
function checkFetchError(options) {
    const originFetch = fetch;
    Object.defineProperty(window, 'fetch', {
        configurable: true,
        enumerable: true,
        // writable: true,
        get() {
            return (url, interfaceCollocation) => {
                const startTime = Date.now();
                console.log('interfaceCollocation :>> ', interfaceCollocation);
                return originFetch(url, {
                    ...interfaceCollocation
                }).then(
                    (request) => {
                        const duration = Date.now() - startTime;
                        // 每次响应实时上报成功率
                        const BeginningResponse = Math.floor(request.status / 100);
                        if (url.indexOf(window.epimetheus) !== 0) {
                            trace.push({ "status": request.status, "trace": url })
                            requestTimes++;
                            if (request.status == 200) {
                                success++;
                            }
                            console.log("success rate==>",
                                success / requestTimes, "request times==>", requestTimes, "success times==>", success)
                        }
                        // 过滤上报接口自身的异常
                        if (BeginningResponse !== 2 && url.indexOf(options.reportURL) === -1) {
                            const interfaceInfo = {
                                type: errorType.interfaceError,
                                // 请求持续的时间
                                data: {
                                    duration,
                                    'pageUrl': window.location.href,
                                    'interfaceURL': request.url,
                                    'status': request.status + ' ' + request.statusText,
                                    'response': request.response ? JSON.stringify(request.response) : '',
                                    'timeStamp': Date.now()
                                }
                            };
                            options && console.log('fetch error :>> ', interfaceInfo);
                            addInterfaceError(interfaceInfo);
                        }
                        return interfaceCollocation;
                    }, (error) => {

                        if (url.indexOf(options.reportURL) === -1) {
                            const duration = Date.now() - startTime;
                            let interfaceInfo = {
                                type: errorType.interfaceError,
                                data: {
                                    // 请求持续的时间
                                    duration,
                                    'pageUrl': window.location.href,
                                    'interfaceURL': url,
                                    'status': error.message + " " + error.stack,
                                    'response': '',
                                    'timeStamp': Date.now()
                                }

                            };
                            options && console.log('fetch error :>> ', interfaceInfo);
                            addInterfaceError(interfaceInfo);
                        }
                    }
                );
            };
        },
    });
}
