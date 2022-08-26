/*
 * @Author: Banana
 * @Date: 2022-08-09 15:38:54
 * @LastEditors: 最后编辑
 * @LastEditTime: 2022-08-22 16:34:42
 */
import { sendRequest } from "../../util/request.js"


/**
 * @function openreportError
 * @description: 重写 allErrorInfo 的列表中的 push 方法，每次 push 时向服务器上传当前收录的错误信息，实现异常上报
 * @param {*} options 用户的配置
 * @return {*}
 * @author: Banana
 */
export function openreportError(options) {
    Object.keys(allErrorInfo).forEach((item) => {
        const oldPush = allErrorInfo[item].push;
        allErrorInfo[item].push = function (info) {


            // 上报错误
            sendRequest(info);

            options.openLog && console.log('异常上报 =>', info);
            oldPush.apply(this, arguments);
        };
    });
}

// 错误对象，实现异常的收集和上报
let allErrorInfo = {
    jsError: [],
    loadingError: [],
    whiteScreen: [],
    InterfaceError: []
};



/**
 * @function addLoadingError
 * @description: 添加加载异常
 * @param {*} value 加载异常的数据
 * @return void
 * @author: Banana
 */
export function addLoadingError(value) {
    allErrorInfo.loadingError.push(value);
}

/**
 * @function addJsError
 * @description: 添加 JS 异常
 * @param {*} value 加载异常的数据
 * @return void
 * @author: Banana
 */
export function addJsError(value) {
    allErrorInfo.jsError.push(value);
}

/**
 * @function addWhiteScreenError
 * @description: 添加白屏异常
 * @param {*} value 加载异常的数据
 * @return void
 * @author: Banana
 */
export function addWhiteScreenError(value) {
    allErrorInfo.whiteScreen.push(value);
}

/**
 * @function addInterfaceError
 * @description: 添加接口异常
 * @param {*} value 加载异常的数据
 * @return void
 * @author: Banana
 */
export function addInterfaceError(value) {
    allErrorInfo.InterfaceError.push(value);
}
