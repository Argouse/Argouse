/*
 * @Author: Banana
 * @Date: 2022-08-09 15:38:54
 * @LastEditors: 最后编辑
 * @LastEditTime: 2022-08-09 16:29:05
 */
import { sendRequest } from "../util/request.js"

// 初始化关键性能数据
const performanceInfo = {
  type: "performanceInfo",
  data: { // 首次绘制 First Paint (白屏时间)
    'FP': 0,
    // 首次内容绘制 First Content Paint
    'FCP': 0,
    // DNS 解析时长
    'DNS': 0,
    // DOM 加载时长
    'DOMready': 0,
    // TCP 链接耗时
    'TCPduration': 0,
    // request 请求耗时
    'requestTime': 0
  }
};

/**
 * @function getPerformanceInfo
 * @description 计算页面各项性能信息
 * @param config {Map} 基础配置
 * @return void
 * @author banana
 */
export function watchPerf(options) {

  window.addEventListener('load', function () {
    // navigation 列表中第一项才是性能数据
    const performanceTime = performance.getEntriesByType('navigation')[0];
    // paint 列表中的第二项才是 first-contentful-paint
    const performancePaint = performance.getEntriesByType('paint')[1];

    performanceInfo.data.DOMready = performanceTime.domContentLoadedEventEnd - performanceTime.fetchStart;
    performanceInfo.data.DNS = performanceTime.domainLookupEnd - performanceTime.domainLookupStart;
    performanceInfo.data.TCPduration = performanceTime.connectEnd - performanceTime.connectStart;
    performanceInfo.data.requestTime = performanceTime.responseEnd - performanceTime.responseStart;
    performanceInfo.data.FP = performanceTime.domInteractive - performanceTime.fetchStart;
    performanceInfo.data.FCP = performancePaint.startTime;

    sendRequest(performanceInfo);
    options.openLog && console.log('关键性能信息 :>> ', performanceInfo);
    // 数据上报
  });
}
