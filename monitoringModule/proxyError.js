export function watchError(option) {
  const capture = new ErrorCapture(option.reportUrl, option.openErrorLog)
}

/**
 *  捕获页面的所有错误
 *  window.allErrorInfo 为存储所有错误列表
 *  window.errorCaptureProcess 指向该类本身
 */
class ErrorCapture {
  /**
   * 错误监控构造器
   * @param {*} reportURL 用于上报的接口
   * @param {*} openLog 是否开启日志模式，用于查看监控信息 （默认关闭）
   * @author banana
   */
  constructor(reportURL, openLog = false) {
    this.openLog = openLog
    this.reportURL = reportURL

    window.errorCaptureProcess = this
    window.allErrorInfo = {
      jsError: [],
      loadingError: [],
      whiteScreen: [],
      InterfaceError: []
    }

    // 开启监控
    this.errorMonitor()
    // 开启上报
    this.reportError()
  }

  /**
   * 开启监控
   * @author banana
   */
  errorMonitor() {
    // 未被定义的异常 如promise异步操作出现的错误
    window.addEventListener('unhandledrejection', this.unhandledError)
    // js异常监控
    window.addEventListener('error', this.jsErrorAndLoadingError, true)
    // 白屏异常监控
    this.checkWhiteScreen()
    // 接口异常监控
    this.checkInterfaceError()
  }

  /**
   * 负责处理promise异步操作出现的错误
   * @param {*} error 错误信息
   * @author banana
   */
  unhandledError(error) {
    const errorInfo = {
      // 错误类型
      errorType: 'unhandledError',
      // 错误链接
      source: window.location.href,
      // 错误的解释
      reason: error.reason.message + error.reason.stack,
      timeStamp: Date.now()
    }
    window.errorCaptureProcess.addJsError(errorInfo)
    this.openLog && console.log('unhandledrejection error :>> ', errorInfo)
  }

  /**
   * 负责js错误和资源加载错误
   * @param {*} event 错误信息
   * @returns void
   * @author banana
   */
  jsErrorAndLoadingError(event) {
    // 资源加载错误的异常是不存在普通异常如message, source, lineno, colno, error 之类的信息
    // 需要分而治之
    if (event.error) {
      // js错误

      const errorInfo = {
        // 错误类型
        errorType: 'jsError',
        // 错误信息
        message: event.message,
        // 错误链接
        source: event.filename,
        // 错误的行、列
        'lineno & colno': event.lineno + ',' + event.colno,
        // 错误的解释
        error: event.error,
        timeStamp: Date.now()
      }
      window.errorCaptureProcess.addJsError(errorInfo)
      window.errorCaptureProcess.openLog && console.log('js error :>> ', event)
    } else {
      // 资源加载错误

      const loadingInfo = {
        // 错误类型
        errorType: 'loadingError',
        // 出错的页面
        source: event.target.baseURI,
        // 出现错误的 loading DOM元素
        loadingDOM: event.target.outerHTML,
        // loading 的 链接
        loadingSrc: event.target.attributes.src.value,
        timeStamp: Date.now()
      }

      window.errorCaptureProcess.addLoadingError(loadingInfo)
      window.errorCaptureProcess.openLog && console.log('loading error :>> ', event)
    }
    return false
  }

  /**
   * 用于 日志模式的 白屏检测时，在屏幕上渲染测试点
   * @param {*} left 监测点x坐标
   * @param {*} bottom 监测点y坐标
   * @param {*} html 监测点的内容
   * @author banana
   */
  createMessageUnder(left, bottom, html) {
    // 创建 message 元素
    const message = document.createElement('div')
    message.style.cssText = 'position:fixed; color: red'
    message.style.left = left + 'px'
    message.style.top = bottom + 'px'
    message.innerHTML = html
    document.body.append(message)
  }

  /**
   * 白屏异常检测
   * 在DOM节点挂载完成后取16个的节点内容 若大于15个节点没有内容或是为包裹元素 上报白屏异常
   * @author banana
   */
  checkWhiteScreen() {
    window.addEventListener('load', () => {
      let whiteScreenInfo;
      let textNum = 0
      const x = document.documentElement.clientWidth - 30
      const y = document.documentElement.clientHeight - 30
      for (let i = 1; i < 9; i++) {
        const currentx = x / 8 * i
        const currenty = y / 8 * i

        const currentColDOM = document.elementFromPoint(x / 2, currenty)
        const currentRowDOM = document.elementFromPoint(currentx, y / 2)
        textNum += window.errorCaptureProcess.isEmptyDOM(currentColDOM)
        textNum += window.errorCaptureProcess.isEmptyDOM(currentRowDOM)

        window.errorCaptureProcess.openLog && window.errorCaptureProcess.createMessageUnder(x / 2, currenty, '<p>+</p>')
        window.errorCaptureProcess.openLog && window.errorCaptureProcess.createMessageUnder(currentx, y / 2, '<p>+</p>')
      }

      // 16个白屏检测点中若有十五个以上都是包裹元素，则上报白屏错误
      if (textNum >= 15) {
        whiteScreenInfo = {
          // 错误类型
          errorType: 'whiteScreen',
          // 出错的页面
          source: window.location.href,
          // 16个点位中检测到的白屏的区域的数量
          whiteScreenDOMNums: textNum,
          timeStamp: Date.now()
        }
        window.errorCaptureProcess.addWhiteScreenError(whiteScreenInfo)
      }

      window.errorCaptureProcess.openLog && console.log('屏幕上16个采样点中空白的数量 :>> ', textNum)
    })
  }

  /**
   * 接口异常检测
   * @author banana
   */
  checkInterfaceError() {
    const XMLHttpRequest = window.XMLHttpRequest
    const oldOpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function (method, url, isAsync) {
      // 取得上报的url 并且过滤上报的信息
      const reportURL = window.errorCaptureProcess.reportURL.split('/')[1]

      // 过滤 日志库/webpack心跳检测/错误上报 的接口
      if (!url.match(/logstores/) && !url.match(/sockjs/) && url.indexOf(reportURL) === -1) {
        this.logData = {
          method,
          url,
          isAsync
        }
        // debugger
      }
      return oldOpen.apply(this, arguments)
    }

    const oldSend = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function (body) {
      if (this.logData) {
        const startTime = Date.now()

        const handle = type => event => {
          // 请求时间
          const duration = Date.now() - startTime
          // 请求码 200 | 404
          const status = this.status
          // 请求结果 ok | 404 Not Found
          const statusText = this.statusText

          // 仅在状态码错误时上报
          if (status !== 200) {
            const interfaceInfo = {
              // 错误类型
              errorType: 'interfaceError',
              // 请求持续的时间
              duration,
              interfaceURL: this.logData.url,
              status: status + ' ' + statusText,
              response: this.response ? JSON.stringify(this.response) : '',
              timeStamp: Date.now()
            }
            window.errorCaptureProcess.openLog && console.log('status != 200 :>> ', interfaceInfo)
            window.errorCaptureProcess.addInterfaceError(interfaceInfo)
          }
        }

        this.addEventListener('error', handle('error'))
        this.addEventListener('load', handle('load'))
        this.addEventListener('abort', handle('abort'))
      }
      return oldSend.apply(this, arguments)
    }
  }

  /**
   * 异常上报
   * 重写 window.allErrorInfo 的列表中的 push 方法，每次 push 时向服务器上传当前收录的错误信息
   * @author banana
   */
  reportError() {
    Object.keys(window.allErrorInfo).forEach(item => {
      const oldPush = window.allErrorInfo[item].push

      window.allErrorInfo[item].push = function () {
        // 上报错误
        if (window.errorCaptureProcess.reportURL !== '') {
          // const xhr = new XMLHttpRequest()
          // xhr.open('post', window.errorCaptureProcess.reportURL + "&errorinfo=" + JSON.stringify(arguments[0]), true)
          // xhr.responseType = 'json'
          // xhr.onload = function () {
          //   window.errorCaptureProcess.openLog && console.log('xhr.response :>> ', xhr.response)
          // }
          // xhr.send()


          (async () => {

            //拼接链接
            let finallyUrl = window.errorCaptureProcess.reportURL.indexOf("?") != -1 ? window.errorCaptureProcess.reportURL + "&error=" + JSON.stringify(arguments[0]) : window.errorCaptureProcess.reportURL + "?error=" + JSON.stringify(arguments[0]);

            let response = await fetch(finallyUrl, {
              method: 'get',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              }
            });

            let result = await response.json();
            console.log(result);

          })()
        }

        window.errorCaptureProcess.openLog && console.log('我上报啦！=>', arguments[0])
        oldPush.apply(this, arguments)
      }
    })
  }

  /**
   * 检验当前DOM是否为 emptyDOM 中的 空|包裹 元素
   * @param {*} element 检测的DOM
   * @returns 是空则返回0 其他元素返回1
   * @author banana
   */
  isEmptyDOM(element) {
    let emptyNum = 0
    const emptyDOM = ['html', 'body', 'div']
    emptyDOM.forEach(item => {
      if (element.tagName.toLowerCase() === item) {
        emptyNum = 1
      }
    })
    return emptyNum
  }

  /**
   * 添加加载异常
   * @param {*} value 错误信息
   * @author banana
   */
  addLoadingError(value) {
    window.allErrorInfo.loadingError.push(value)
  }

  /**
   * 添加js异常
   * @param {*} value 错误信息
   * @author banana
   */
  addJsError(value) {
    window.allErrorInfo.jsError.push(value)
  }

  /**
   * 添加白屏异常
   * @param {*} value 错误信息
   * @author banana
   */
  addWhiteScreenError(value) {
    window.allErrorInfo.whiteScreen.push(value)
  }

  /**
   * 添加接口异常
   * @param {*} value 错误信息
   * @author banana
   */
  addInterfaceError(value) {
    window.allErrorInfo.InterfaceError.push(value)
  }

  /**
   * 获取所有异常的信息
   * @returns 所有异常
   * @author banana
   */
  getAllError() {
    return window.allErrorInfo
  }
}