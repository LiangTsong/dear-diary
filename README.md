# Dear Diary API约定

梁聪 liangxcong@gmail.com

2019.12.6更新



[TOC]



## 首页个人信息

### 客户端请求 GET

### 服务器回复

```json
{
    user_img: 用户头像链接String,
    user_name: 用户名String,
    success: 服务器处理情况Integer,//1表示成功，0表示服务器操作失败
}
```

### 服务器回复示例

```json
{
    user_img: "http://localhost/img/007.png",
    user_name: "梁聪",
    success: 1,
}
```



## 首页信息流

### 客户端请求 GET

### 服务器回复

```json
{
    feed_item_data:[ // List
        {
            type: 信息流类型Integer,// 0表示用户日记摘要，1表示系统信息
            date: 日期String,
            user_name: 发信人名String,
            user_img: 发信人头像链接String,
            digest: 内容摘要String(比如，用户的日记，系统的提醒(如，"你有新的周报")),
            emotion: [// List，当发信人是系统（type为1）时，请随机附上积极向上的心情
                 心情1, // 请自行约定心情代号
                 心情2,
                ...
            ],
            score: 情绪极性Float, // 当发信人是系统（type为1）时，请随机附上积极向上的极性
            id: 条目唯一编号,// 请自行定义数据类型。当发信人为用户（type为0）时，id应为对应日记的编号
        },
        ...
    ],
    success: 服务器处理情况Integer,//1表示成功，0表示服务器操作失败
}
```

### 服务器回复信息示例

```json
{
    feed_item_data: [
                    {
                        type: 0,
                        date:"2019-12-31 00:00",
                        user_name:"我自己",
                        user_img:"http://localhost/img/007.png",
                        digest: '今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。',
                        emotion:['😀'],
                        score: 0.55,
                    },
                    {
                        type: 1,
                        date:"2019-12-31 00:00",
                        user_name:"心情助手",
                        user_img:"http://localhost/img/008.png",
                        digest: '你有新的情绪周报。',
                        emotion:['😀'],
                        score:0.85,
                    },
        ],
    success: 1,
}

```



## 首页提醒事项请求

注意，首页提醒事项只是“提醒事项的完成/删除”，不涉及提醒事项的新建。

### 客户端提醒事项请求 GET

### 服务器提醒事项回复

请注意，暂定只回复【尚未完成的事项，以及今天刚刚完成的事项】。

```json
{
    todo_data:[// List
        {
            date: 日期String,
            content: 内容String,
            expired: 过期标识Integer,// 0为还差得远，1为差1天过期，2为已经过期（只涉及时间上的判断，不涉及是否完成的判断）
            finished: 完成标识Integer,// 0为尚未完成，1为已经完成
            id: 该提醒的唯一编号,// 请自己定义数据类型，以实现方便为准
        },
        ...
    ],
    success: 服务器处理情况Integer,//1表示成功，0表示服务器操作失败
}
```

### 服务器提醒事项回复示例

```json
{
    todo_data:[
                    {
                        date: '2019.12.31 00:00',
                        content: '2019年最后一天',
                        expired: 0,
                        finished: 0,
                        id: 0,
                    },
                    {
                        date: '2019.12.31 00:00',
                        content: '2019年最后一天',
                        expired: 1,
                        finished: 0,
                        id: 1,
                    },
                    {
                        date: '2019.12.31 00:00',
                        content: '2019年最后一天',
                        expired: 2,
                        finished: 0,
                        id: 2,
                    },
                    {
                        date: '2019.12.31 00:00',
                        content: '2019年最后一天',
                        expired: 2,
                        finished: 1,
                        id: 3,
                    }
    ],
    success: 1,
}
```



## 首页提醒事项完成/删除

### 客户端提醒事项完成/删除请求 POST

```json
{
    id: 待操作的提醒事项的唯一编号，//如上文所属，请自行设计数据类型
    type: 操作类型Integer, //0表示完成，1表示删除，2表示不完成
}
```

### 服务器提醒事项完成/删除请求回复

```json
{
    success: 服务器处理情况Integer,//1表示成功，0表示服务器操作失败
}
```

### 客户端提醒事项完成/删除请求 POST示例

```json
{
    id: 123,
    type: 1,
}
```

### 服务器提醒事项完成/删除请求回复示例

```json
{
    success: 1,
}
```



## 书写页新建日记

点击新建日记按钮：

* 如果今天尚未新建日记，则回复空内容；
* 如果今天已经写过日记了，则返回今天已经写过的日记

### 客户端新建日记 GET

### 服务器新建日记回复

```json
{
    success: 服务器处理情况Integer,//1表示成功，0表示服务器操作失败
    type: 新建情况Integer,//1表示新建成功，并返回空的object_text；0表示新建失败，返回今天已经写过的日记
    object_text: 日记内容富文本String,
    id: 日记唯一编号,
}
```

### 服务器新建日记示例

```json
{
    success: 1,
    type: 新建情况Integer,//1表示新建成功，并返回空的object_text；0表示新建失败，返回今天已经写过的日记
    object_text: 日记内容富文本String,
    id: 007,
}
```



## 书写页日记提交

### 客户端日记提交请求 POST

请注意，提交这个请求之后，请先不要保存分析到的提醒事项，也不要给提醒事项建立编号！

```json
{
    raw_text: 日记内容plain文本String,//服务器文本分析的对象
    object_text: 日记内容富文本String,//不需要服务器处理，只要存储即可
    id: 日记唯一编号,
}
```

### 服务器日记提交请求回复

这里其实是回复了服务器分析出来的提醒事项。

```json
{
    success: 服务器处理情况Integer,//1表示成功，0表示服务器操作失败
    id: 该日记的唯一编号,// 请自行定义数据类型
    todo_data:[// List，服务器从文本中分析得到的提醒事项
        {
            date: 日期String,
            content: 内容String,
        },
        ...
    ],
}
```

### 客户端日记提交请求示例

```json
{
    raw_text: "我今天很开心。blahblahblah",
    object_text: 日记内容富文本String,//不需要服务器处理，只要存储即可
}
```

### 服务器日记提交请求回复示例

```json
{
    success: 1,
    id: 007,
    todo_data:[
        {
            date: "2019-12-31 00:00",
            content: "买饭团",
        },
        ...
    ],
}
```



## 书写页提醒事项提交

### 客户端书写页提醒事项提交 POST

```json
{
     todo_data:[// List
        {
            date: 日期String,
            content: 内容String,
        },
        ...
}
```

### 服务器书写页提醒事项提交回复

```json
{
    success: 服务器处理情况Integer,//1表示成功，0表示服务器操作失败
}
```

### 客户端书写页提醒事项提交示例

```json
{
     todo_data:[
       {
            date: "2019-12-31 00:00",
            content: "买饭团",
        },
        ...
}
```

### 服务器书写页提醒事项提交回复示例

```json
{
    success:1,
}
```



## 书写页日记拉取请求

### 客户端日记拉取请求 POST

```json
{
    id: 日记唯一编号,//请自行设计数据类型
}
```

### 服务器日记拉取请求回复

```json
{
   object_text: 日记内容富文本String,// 注意，这并不是plain文本，而是之前保存过的富文本
   success: 服务器处理情况Integer,//1表示成功，0表示服务器操作失败
}
```

### 客户端日记拉取请求示例

```json
{
    id: 007,
}
```

### 服务器日记拉取请求回复示例

```json
{
   object_text: 日记内容富文本String,// 注意，这并不是plain文本，而是之前保存过的富文本
   success: 1,
}
```





## 图表页信息请求

### 客户端图表页信息请求 GET

### 服务器图表页信息请求回复

请一次性回复所有数据。

```json
{
    success: Integer,
    data_number: 所发出的所有数据的个数Integer,
    emotions: [//List 情绪列表，请自行定义数据类型，列表长度应该为上述data_number
        [],
        ...
    ],
    digests: [//List 摘要文本String，列表长度应该为上述data_number
        ...
    ],
    data: [// List 极性列表，列表长度应该为上述data_number
        {x: Integer, y: Float},// x表示数据index，y表示相应的极性
        ...
    ],
    dates: [//List 日期列表，日期为String
        ...
    ],
}
```

### 服务器图表页信息请求回复示例

```json
{
    success: 1,
    data_number: 7,
    emotions: [// 请自行定义数据类型
        [1],
        ...
    ],
    digests: ["开心开心开心开心开心开心开心", "伤心伤心伤心伤心伤心伤心伤心伤心",
              "难过到了极点。早课睡过头了。外卖撒了。ddl到了。火车晚点了。真是伤心的一天。",
              "今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。",
              "中等中等中等", "开心开心开心开心开心开心开心", "中等中等中等"],
    data: [
        {x: 0, y: 0.89},
        {x: 1, y: 0.35},
        {x: 2, y: 0.11},
        {x: 3, y: 0.93},
        {x: 4, y: 0.55},
        {x: 5, y: 0.68},
        {x: 6, y: 0.55},
    ],
    dates: ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7"],
}
```

