import { initDOMtree } from "./structureMethods"
import { getDOMopera } from "./restoreMethods"
import {eventListen, domActionListen} from "./domActionListen"


/**
 * @function initDOMaction
 * @description: 根据页面不同，开启DOM录制或者还原的DOM
 * @return {void}
 * @author: Banana
 */
export function initDOMaction() {

    // 当前页面是播放用户操作
    if (location.href.includes("replay")) {
        console.log('play user actions...')
        getDOMopera()
    } else {
        console.log('Record user actions...')
        initDOMtree()
        eventListen()
        domActionListen()
    }
}
