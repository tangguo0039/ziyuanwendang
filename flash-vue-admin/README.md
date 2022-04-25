# flash-vue-admin

该模块提供了一个基于Vue.js的纯静态后台管理系统的界面方案，

flash-vue-admin（前端）和flash-api（后端）搭配使用提供了一套成熟简洁的后台管理系统

该模块克隆自：[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)，感谢PanJiaChen，欢迎大家给他点赞。

PanJiaChen老师提供了全面的文档，开发过程可以参考其官方文档
 
## 构建步骤

```bash 

# Install dependencies 
# 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
npm install --registry=https://registry.npmmirror.com

# Serve with hot reload at localhost:9528
npm run dev

# Build for production with minification
npm run build

# Build for production and view the bundle analyzer report
npm run build --report
```


##  nvm多版本切换以应对VUE框架降级问题
```bash   
第一步 windows安装nvm
https://blog.csdn.net/qq_33745371/article/details/109039414
https://www.jianshu.com/p/49a94959c44f

第二步 nodeJS 通过nvm选择版本安装
【样例】
nvm install 10.15.0 //安装指定的版本的nodejs
nvm use 10.15.0 //使用指定版本的nodejs


