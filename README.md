#项目相关命令
npm install  
ionic serve  
ionic build --prod  
cordova build android --release  
xxxx  
修改测试

###合并某个文件
git checkout --patch dev3 src/pages/home/competition/lists/lists.ts 

###wow动画参数  
```
data-wow-duration: Change the animation duration  
data-wow-delay: Delay before the animation starts  
data-wow-offset: Distance to start the animation (related to the browser bottom)  
data-wow-iteration: Number of times the animation is repeated  
```

###微信插件相关信息
```
<plugin name="cordova-plugin-wechat" spec="^3.0.0">
    <variable name="WECHATAPPID" value="wxb5bb0aae5137074c" />
    <variable name="UNIVERSALLINK" value="YOUR_UNIVERSAL_LINK" />
</plugin>
```

因为wkwebview会跨域，UIWEbview不会跨域，所以在config.xml里面设置了 强制使用UIWebview 建议使用native http
<feature name="CDVWKWebViewEngine">
        <param name="ios-package" value="CDVWKWebViewEngine" />
    </feature>
    <preference name="CordovaWebViewEngine" value="CDVUIWebViewEngine" />

####IP启动
```ionic serve --address 192.168.68.95``` 

###添加微信插件的命令
```cordova plugin add cordova-plugin-wechat  --variable wechatappid=wxb5bb0aae5137074c --variable universallink=https://elearning.sgmw.com.cn/```

###别更新 cordova-plugin-ionic-webview 版本 因为最新版的 用android打开PDF会有跨域问题
