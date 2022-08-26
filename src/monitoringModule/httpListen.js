import { sendSuccessRate, sendTrace } from "./ErrorCaptureMethods/InterfaceCapture"
import { sendRequest } from "../util/request.js"

// import { sendTraceAction } from "./userAction"
/**
 * @function httpListenApi
 * @description 初始化SDK 
 * @param config {Map} 基础配置 
 * @return void
 * @author IMXENON
 * @comment 使用httpListen之前请确保sendError的开启
 */

function mountUnload() {
    window.onbeforeunload = (e) => {
        const rate = sendSuccessRate();
        sendRequest(rate)
        const trace = sendTrace();
        sendRequest(trace)

    }
}

export function httpListenApi() {
    console.log("http listen API is mounted");
    mountUnload();
}





// /**
//  * @function rewriteRequest
//  * @description 重写xmlhttprequest请求
//  * @param config {Map} 基础配置
//  * @return void
//  * @author ZealianMa
//  */
// function rewriteXhrRequest() {
//     let xhrOpen = XMLHttpRequest.prototype.open

//     function Fopen(method, url, async, user, password) {

//         console.log("Opening an http request")
//         this.logData = {
//             method,
//             url,
//         }
//         xhrOpen.call(this, method, url, async, user, password)

//         console.log(this.logData)
//     }
//     XMLHttpRequest.prototype.open = Fopen

//     let xhrSend = XMLHttpRequest.prototype.send
//     XMLHttpRequest.prototype.send = function(request) {
//         console.log("Sending an http request")
//         const startTime = new Date()
//             // console.log(startTime)
//         console.log(startTime)
//         const handle = (eventType) => {
//             return () => {
//                 if (
//                     (eventType === 'load' && this.response.status !== 0) ||
//                     eventType === 'error' ||
//                     eventType === 'abort'
//                 ) {
//                     const duration = new Date() - startTime
//                     const logData = {
//                         duration,
//                         statusCode: this.status,
//                         statusText: this.statusText,
//                         url: this.responseURL,
//                         method: this.logData.methods,
//                         params: this.request,
//                         response: JSON.stringify(this.response || ''),
//                         type: 'xhr',
//                         eventType
//                     }
//                     console.log(logData, "aaa")
//                 }
//             }
//         }
//         this.addEventListener('load', handle('load'), false)
//         this.addEventListener('load', handle('error'), false)
//         this.addEventListener('load', handle('abort'), false)
//         return xhrSend.apply(this, arguments)

//     }
// }



// function rewriteFetchRequest() {
//     let _fetch = fetch;
//     window.fetch = function() {
//         //请求拦截部分
//         console.log("Fetching")
//         return _fetch
//             .apply(this, arguments)
//             .then((res) => {
//                 console.log(arguments)
//                     //响应拦截
//                 return res;
//             })
//     };
// }
