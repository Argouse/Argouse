import { jsErrorAndLoadingErrorCapture } from "./ErrorCaptureMethods/JSerrorAndLoadingError"
import { promiseErrorCapture } from "./ErrorCaptureMethods/PromiseError"
import { blankScreenCapture } from "./ErrorCaptureMethods/BlankScreenMonitor"
import { interfaceCapture } from "./ErrorCaptureMethods/InterfaceCapture"
import { openreportError } from "./ErrorCaptureMethods/ReportInfo"


/**
 * @function watchError
 * @description:初始化异常监控
 * @param {*} options 用户的配置
 * @param {*} options.openLog 是否开启日志
 * @return {*}
 * @author: Banana
 */
export function watchError(options = { reportURL: "", openLog: false }) {
  console.log('init error capture API');
  openreportError(options);

  jsErrorAndLoadingErrorCapture(options);
  blankScreenCapture(options);
  promiseErrorCapture(options);
  interfaceCapture(options);
}
