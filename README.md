


******启动命令******
      1.npm install      //安装项目依赖
      2.ionic serve      //项目编译启动
      3.ionic g page newPage   //创建新页面
     安装 cordova插件命令：
      ionic cordova plugin add 插件名
     例如：
      ionic cordova plugin add cordova-plugin-badge

******ionic常用命令******
      1、ionic g page newPage   创建新页面

******注意事项******
      1、node版本装8.9.0 的  不然跑不起来
      2、http文件里面的请求改成本地请求的方式 本地跑
      3、这个项目的接口基本都是用form表单提交的
      4.ionic.config.json 文件是本地配置跨域问题的nginx文件 service 里面的domain参数要设置

******常见问题******
      如果build android 报错了请在platforms/build.gradle里面的最后添加如下代码：
      configurations.all {
      resolutionStrategy {
          force 'com.android.support:support-v4:27.1.0'
      }}
      打包报错可以试试这个命令
      ./platforms/android/gradlew clean


//app自动更新安装打开功能中 android 8以上的权限有限制；需要在 platforms/android/app/src/main/AndroidManifest.xml文件里面
      将 targetSdkVersion的值改为23即可；android SDK版本降低可以

******正式版本更新说明******
      2019-3-17  v3.0.3  更新问卷调查结果预览出现的问题
      2019-4-11 v4.0.6   学习测试模块上线

******appid的问题******
     io.ionic.smart19.starter.test   内部测试的版本id
     io.ionic.smart19.starter        正式环境的版本id
     io.ionic.partyCloud.starter.test     部机关党建云(测试)
   
     
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release-key.keystore app-release-unsigned.apk 部机关党建云
20192019
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release-key-wisdom.keystore app-release-unsigned.apk 智汇19号
20182018
