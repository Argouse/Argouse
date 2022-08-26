import {
    addJsError
} from "./ReportInfo"
import {
    errorType
} from "./EnumErrorType"


/**
 * @function promiseErrorCapture
 * @description: 开启promise异常监控
 * @param {*} options 用户的配置
 * @return {*}
 * @author: Banana
 */
export function promiseErrorCapture(options) {
    // 未被定义的异常 如promise异步操作出现的错误
    window.addEventListener('unhandledrejection', unhandledError(options));
}


/**
 * @function: unhandledError
 * @description: 负责处理promise异步操作出现的错误
 * @param {*} options 用户的配置
 * @return {*}
 * @author: Banana
 */
function unhandledError(options) {
    return function (error) {
        const errorInfo = {
            type: errorType.promiseError,
            data: {
                'pageUrl': window.location.href,
                'errorStack': error.reason.stack === undefined ? error.reason : error.reason.stack,
                'errorMessage': error.reason.message === undefined ? error.reason : error.reason.message,
                'timeStamp': Date.now()
            }
        };
        addJsError(errorInfo);
        options.openLog && console.log('unhandledrejection error :>> ', errorInfo);
    }
}
