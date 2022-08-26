import {
    addJsError
} from "./ReportInfo"
import {
    addLoadingError
} from "./ReportInfo"
import {
    errorType
} from "./EnumErrorType"


/**
 * @function jsErrorAndLoadingErrorCapture
 * @description: 开启JS异常和加载异常监控
 * @param {*} options 用户的配置
 * @return void
 * @author: Banana
 */
export function jsErrorAndLoadingErrorCapture(options) {
    // js异常监控
    window.addEventListener('error', jsErrorAndLoadingError(options), true);
}


/**
 * @function jsErrorAndLoadingError
 * @description: 捕获js异常和加载异常
 * @param {*} options 用户的配置
 * @return {*}
 * @author: Banana
 */
function jsErrorAndLoadingError(options) {

    return function (event) {
        // 资源加载异常是不存在普通异常如message, source, lineno, colno, error 之类的信息
        // 需要分而治之
        if (event.error) {

            // js错误
            const errorInfo = {
                type: errorType.jsError,
                data: {
                    'errorMessage': event.message,
                    'pageUrl': event.filename,
                    'errorPosition': event.lineno + ',' + event.colno,
                    'errorStack': event.error.stack,
                    'timeStamp': Date.now()
                }
            };
            addJsError(errorInfo);
            options.openLog && console.log('js error :>> ', event);
        } else {

            // 资源加载错误
            const loadingInfo = {
                type: errorType.loadingError,
                data: {
                    'pageUrl': event.target.baseURI,
                    'loadingDOM': event.target.outerHTML,
                    'loadingSrc': event.target.attributes.src.value,
                    'timeStamp': Date.now()
                }
            };

            addLoadingError(loadingInfo);
            options.openLog && console.log('loading error :>> ', event);
        }
    }
}
