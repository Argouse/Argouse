import { TaskQueue } from "./requestQueue"

const url_base = window.epimetheus
const reportId = window.reportId || 114514
// 请求队列初始化
const taskQueue = new TaskQueue();
/**
* @function request
* @description 封装请求头
* @param params {请求body}
* @return http
* @author iiijr
*/
export async function request(params) {
  let url = url_base + params?.url
  const method = params?.method
  const header = params?.header
  const data = Object.assign({ "reportid": reportId }, params?.data)
  console.log(data);
  const get_params = params?.params
  const get_params_list = []
  if (get_params) {
    for (const item in get_params) {
      get_params_list.push(item + "=" + get_params[item])
    }
    if (url.search(/\?/) === -1) {
      url += '?' + get_params_list.join('&')
    } else {
      url += '&' + get_params_list.join('&')
    }
  }
  const headers = {
    'Content-Type': 'application/json',
    ...header
  }

  return await fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: new Headers(headers),
    mode: 'cors',
    credentials: 'omit',
  })
    .then(res => { return res.json() })
    // .then(res => res.status)
    // .then(response => response.json())
    .catch(error => { return error })
}



/**
* @function sendRequest
* @description 发送请求
* @param data {map}
* @return request
* @author iiijr
*/
export async function sendRequest(data) {
  taskQueue.addTask(request({
    url: '/metrics/report',
    method: 'POST',
    data
  }))
}




/**
 * @function reportDOMevent
 * @description: 上报DOM事件
 * @param {Object} data
 * @return {void}
 * @author: Banana
 */
export async function reportDOMevent(data) {
  taskQueue.addTask(request({
    url: '/replay/reportDOMevent',
    method: 'POST',
    data
  }))
}
