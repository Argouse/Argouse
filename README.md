&nbsp;
<p align="center">
    <picture>
        <img alt="Argouse" src="doc/logo/Argouse.png" width="300px">
    </picture>
</p>
<h3 align="center">Argouse 前端监控解决方案</h3>
<p align="center">
    通过SDK接入实现性能监控、异常收集及访问回放等功能，提供可视化观测界面。
</p>
&nbsp;

## 声明
 
实验性项目，不建议使用于生产环境。



## 使用
从仓库中下载 bundle.js
参考 demoPage 在页面中引入 bundle.js 并配置后端可视化平台 [Epimetheus](https://github.com/Argouse/Epimetheus) 接口及 reportID

``` html
<html>
<head>
  ......
  ......
  <script>
    window.epimetheus = 'http://localhost:3002'; // 后端api 不含末尾 /
    window.reportId = '114514';  // 用户上报Id 需要与后端一致
  </script>
  <script src="dist/bundle.js" id="Argouse" async></script>
</head>

<body>
  ......
  ......
  ......
</body>
</html>

```
### 功能开关

```
<script src="dist/bundle.js?sendPV=true&sendApi=ture&sendError=false&sendPerf=false&sendDom=false" id="Argouse" async></script>
```



## 特性
监控数据
- sendPV: 
  - 用户页面停留时长
- sendApi: 
  - http请求链路
  - http请求成功率
- sendError: 
  - js异常
  - 接口异常
  - 白屏异常
  - 资源加载异常
  - promise异常
- sendPerf: 
  - FP (首次绘制时间（白屏时间）)
  - FCP (首次内容绘制时间时长)
  - DOM Ready(Dom加载时长)
  - DNS (DNS解析时长)
  - TCPduration (TCP链接耗时)
  - request (请求耗时)
- sendDom: 
  - 屏幕录制和回放功能

## 演示数据
![grafana_img_1](doc/demo/grafana_1.jpg)
![grafana_img_2](doc/demo/grafana_2.jpg)
![grafana_img_3](doc/demo/grafana_3.jpg)
![grafana_img_4](doc/demo/grafana_4.jpg)
![grafana_img_5](doc/demo/grafana_5.jpg)

