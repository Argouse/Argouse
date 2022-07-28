'use strict';
/**
* @function main
* @description 立即执行函数 
* @return void
* @author iiijr
*/
(function() {
  // 获取 script src 里的 query 参数
  const params = getScriptQuery();
  initSDK(params);
})();


/**
* @function initSDK
* @description 初始化SDK 
* @param opt {Map} 基础配置 
* @return void
* @author iiijr
*/
function initSDK(opt) {
  // 内置默认参数
  const config = assign({
    sendPV: true, // 是否上报页面 PV
    sendApi: true, // 是否上报 API 接口请求
    sendResource: true, // 是否上报资源请求
    sendError: true, // 是否上报 js error
    sendPerf: true, // 是否上报页面性能
    // TODO 写了一部分模块，待补充，写模块的时候大伙们顺便添加上去
  }, opt);

  // TODO 监控模块执行，也是需要大伙们顺便添加上去，格式按着来就行
  config.sendPV && watchPV(config);
  config.sendApi && watchApi(config);
  config.sendResource && watchResource(config);
  config.sendError && watchError(config);
  config.sendPerf && watchPerf();

  // TODO 自定义日志上报
  watchCustom(); 
}






