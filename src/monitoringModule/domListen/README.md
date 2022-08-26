## 数据

- [x] 上报初始页面

| 页面DOM | 页面类型 |  时间戳 | 页面URL |
| ------- | ------- | ------- | ------- |
| domInfo | info |  timeStamp | pageUrl |

实例
```
{
    "domInfo": "<body> ... </body>",
    "info": "originInfo",
    "timeStamp": 1660874344217,
    "pageUrl": "http://127.0.0.1:5500/"
}
```


- [x] 上报页面修改

| 页面DOM | 页面类型 |  时间戳 | 页面URL |
| ------- | ------- | ------- | ------- |
| domInfo | info |  timeStamp | pageUrl |

实例
```
{
    "domInfo": "<body> ... <h1> ... </h1> </body>",
    'info': 'DOMupdate',
    "timeStamp": 1660875386682,
    "pageUrl": "http://127.0.0.1:5500/"
}
```

- [x] 上报按钮点击

| 点击的按钮从body到自身的完整索引 | 页面类型 |  时间戳 | 页面URL |
| ------- | ------- | ------- | ------- |
| domInfo | info |  timeStamp | pageUrl |

实例
```
{
    "domInfo": [0,1,2,1],
    'info': 'buttonClick',
    "timeStamp": 1660875386682,
    "pageUrl": "http://127.0.0.1:5500/"
}
```

- [x] 上报文本输入

| 更改的输入框从body到自身的完整索引 | 页面类型 |  时间戳 | 页面URL | 更改后的文本 |
| ------- | ------- | ------- | ------- | ------- |
| domInfo | info |  timeStamp | pageUrl | text |

实例
```
{
    "domInfo": [0,1,2,1],
    'text': "Banana King",
    'info': 'textUpdate',
    "timeStamp": 1660875386682,
    "pageUrl": "http://127.0.0.1:5500/"
}
```
