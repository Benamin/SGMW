// export let env = 'localhost';
// export let env = 'dev';
// export let env = 'uat';
export let env = 'prod';

// let keyEnv = 'dev';
let keyEnv = 'prod';

// /***培训平台***/
export const SERVER_API_URL_LOCALHOST = '/api';
export const SERVER_API_URL_DEV = 'http://devapi1.chinacloudsites.cn/api'; //开发环境
export const SERVER_API_URL_UAT = 'http://sitapi1.chinacloudsites.cn/api'; //uat环境
export const SERVER_API_URL_PROD = 'https://elearningapi.sgmw.com.cn/api';  //生产环境
export const SERVER_API_URL = (env === 'localhost' ? SERVER_API_URL_LOCALHOST : (env == 'dev' ? SERVER_API_URL_DEV : (env == 'uat' ?
    SERVER_API_URL_UAT : (env == 'prod' ? SERVER_API_URL_PROD : ''))));

//client_id
export const sgmw_client_id = "2961C96D-4DB0-4FCF-99FA-FE18AC9A496A";

//通过判断url来跳转内部还是外部
export const SERVER_HTTP_URL_DEV = 'https://sitportal.chinacloudsites.cn/dist/#/courseDetail/'; //测试
export const SERVER_HTTP_URL_PROD = 'https://elearning.sgmw.com.cn/#/courseDetail';  //生产
export const SERVER_HTTP_URL = env === 'localhost' ? SERVER_HTTP_URL_DEV : SERVER_HTTP_URL_PROD;
/*****end******/

/***骏客***/
//环境
export const JunKe_HTTP_URL_LOCALHOST = "/JunKeAPI";  //代理地址
export const JunKe_HTTP_URL_DEV = "https://nbjtest.sgmw.com.cn";   //测试
export const JunKe_HTTP_URL_PROD = "https://nbj.sgmw.com.cn";   //生产
export const JunKe_HTTP_URL = (env == 'localhost' ? JunKe_HTTP_URL_LOCALHOST : (env == 'dev' || env == 'uat') ? JunKe_HTTP_URL_DEV : JunKe_HTTP_URL_PROD);

//秘钥
//开发环境
export const JunKe_PRIVATE_KEY_DEV = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZs0vnjp+z/6ggXS5jXzusSAfDO6OUDRNpZ/YDtLDHof8J0Z2O2Y0JeBcsItIwmoYMuaBYlMxGq2NJ4hZU4cSrHfpE7mt+QFgdJe2H2v8GYOi+umM56QGq+gM18jYsOVwZQXfVmAV+y8gVO+0Ksg77vab/QRZaYuPfyGyGEQTklwIDAQAB";

//生产环境
export const JunKe_PRIVATE_KEY_PROD = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCboECH8BMV6e8/DsEd9uyUqVQLpeEP1qkncIPWxlGn81++jpHjUohTku1k6Qakyl9tbxN+6mMBt6+rJD6/qDSGxXpx1hw3/u1bdTUfgk1DkqleMs4q4bZgwolYNqeFxVMkOMfcYDr8b9F1f4BA2Ezsjnr/x2XVu4dtGM9yFR7m+QIDAQAB";

export const JunKe_PRIVATE_KEY = keyEnv === 'dev' ? JunKe_PRIVATE_KEY_DEV : JunKe_PRIVATE_KEY_PROD;

export const JunKe_client_id = "41BC3798-5392-49A4-A191-0891F322920B";
/*****end******/


/***销售助手***/
//环境
export const XSZS_HTTP_URL_LOCALHOST = "/XSZSAPI";  //代理地址
export const XSZS_HTTP_URL_DEV = "http://112.124.23.230:8010/API";  //测试
export const XSZS_HTTP_URL_PROD = "https://promotion.sgmw.com.cn/API";  //生产
export let XSZS_HTTP_URL = (env == 'localhost' ? XSZS_HTTP_URL_LOCALHOST : ((env == 'dev' || env == 'uat') ? XSZS_HTTP_URL_DEV : XSZS_HTTP_URL_PROD));

//appid  登录销售助手接口使用
export const XSZS_appId_DEV = "npuehtqbtp1puya9obgb";  //测试
export const XSZS_appId_PROD = "5nvi2v72vepo1p62a2vc";   //生产
export const XSZS_appId = keyEnv === 'dev' ? XSZS_appId_DEV : XSZS_appId_PROD;

//appKey 登录销售助手接口使用
export const XSZS_appKey_DEV = "3s78yo1pv1pucentst5rl3jvbyl6iwmn";  //测试
export const XSZS_appKey_PROD = "do5d9txfvtdt7neftljltgxa1pcpuate";   //生产
export const XSZS_appKey = keyEnv === 'dev' ? XSZS_appKey_DEV : XSZS_appKey_PROD;

//client_id
export const XSZS_client_id = "138B0798-8D43-4588-B291-DB8545865C8A";
/*****end******/

/***服务助手***/
export const FWZS_HTTP_URL_LOCALHOST = "FWZSAPI";
export const FWZS_HTTP_URL_PROD = "https://sgmwsa.shaoxingzhuoyue.com/api";
export const FWZS_HTTP_URL = env === 'localhost' ? FWZS_HTTP_URL_LOCALHOST : FWZS_HTTP_URL_PROD;

//appid
export const FWZS_appid = "52492bf5765840b192fac6c7ca3d10c8";

export const FWZS_SecretKey = "48c85555fbf14d489536070b32c6998f";

export const FWZS_client_id = '5729E3DD-4DD9-4132-9365-016E6FE676E1';

//签名

/*****end******/

export const defaultImg = './assets/imgs/default.jpg';
export const defaultHeadPhoto = './assets/imgs/userDefault.jpg';

export const pageSize = 10;
export const LastVersion = '2.0.0';

//提示信息
export const NoUserMsg = "您的用户信息暂未同步到骏菱学社，请稍后再试。如有问题，请致电0772-2650611。";


//分享
export const PCURLDEV = "https://devportal1.chinacloudsites.cn/#/"  //dev
export const PCURLUAT = "https://sitportal1.chinacloudsites.cn/#/"  //uat
export const PCURLPROD = "http://elearning.sgmw.com.cn/#/"  //prod

export const PCURL = (env === 'localhost' ? PCURLDEV : (env == 'dev' ? PCURLDEV : (env == 'uat' ?
    PCURLUAT : (env == 'prod' ? PCURLPROD : ''))));
