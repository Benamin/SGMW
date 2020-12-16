// export let env = 'localhost';
// export let env = 'dev';
export let env = 'uat';
// export let env = 'prod';

export let keyEnv = 'dev';
// export let keyEnv = 'prod';


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
const SERVER_HTTP_URL_DEV = 'https://sitportal.chinacloudsites.cn/dist/#/courseDetail/'; //测试
const SERVER_HTTP_URL_PROD = 'https://elearning.sgmw.com.cn/#/courseDetail';  //生产
export const SERVER_HTTP_URL = env === 'localhost' ? SERVER_HTTP_URL_DEV : SERVER_HTTP_URL_PROD;
/*****end******/


/***骏客***/
//环境
const JunKe_HTTP_URL_LOCALHOST = "/JunKeAPI";  //代理地址
const JunKe_HTTP_URL_DEV = "https://nbjtest.sgmw.com.cn";   //测试
const JunKe_HTTP_URL_PROD = "https://nbj.sgmw.com.cn";   //生产
export const JunKe_HTTP_URL = (env == 'localhost' ? JunKe_HTTP_URL_LOCALHOST : (env == 'dev' || env == 'uat') ? JunKe_HTTP_URL_DEV : JunKe_HTTP_URL_PROD);

//秘钥
const JunKe_PRIVATE_KEY_DEV = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZs0vnjp+z/6ggXS5jXzusSAfDO6OUDRNpZ/YDtLDHof8J0Z2O2Y0JeBcsItIwmoYMuaBYlMxGq2NJ4hZU4cSrHfpE7mt+QFgdJe2H2v8GYOi+umM56QGq+gM18jYsOVwZQXfVmAV+y8gVO+0Ksg77vab/QRZaYuPfyGyGEQTklwIDAQAB";
const JunKe_PRIVATE_KEY_PROD = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCboECH8BMV6e8/DsEd9uyUqVQLpeEP1qkncIPWxlGn81++jpHjUohTku1k6Qakyl9tbxN+6mMBt6+rJD6/qDSGxXpx1hw3/u1bdTUfgk1DkqleMs4q4bZgwolYNqeFxVMkOMfcYDr8b9F1f4BA2Ezsjnr/x2XVu4dtGM9yFR7m+QIDAQAB";

export const JunKe_PRIVATE_KEY = keyEnv === 'dev' ? JunKe_PRIVATE_KEY_DEV : JunKe_PRIVATE_KEY_PROD;

export const JunKe_client_id = "41BC3798-5392-49A4-A191-0891F322920B";
/*****end******/


/***销售助手***/
//环境
const XSZS_HTTP_URL_LOCALHOST = "/XSZSAPI";  //代理地址
const XSZS_HTTP_URL_DEV = "http://112.124.23.230:8010/API";  //测试
const XSZS_HTTP_URL_PROD = "https://promotion.sgmw.com.cn/API";  //生产
export let XSZS_HTTP_URL = (env == 'localhost' ? XSZS_HTTP_URL_LOCALHOST : ((env == 'dev' || env == 'uat') ? XSZS_HTTP_URL_DEV : XSZS_HTTP_URL_PROD));

//appid  登录销售助手接口使用
const XSZS_appId_DEV = "npuehtqbtp1puya9obgb";  //测试
const XSZS_appId_PROD = "5nvi2v72vepo1p62a2vc";   //生产
export const XSZS_appId = keyEnv === 'dev' ? XSZS_appId_DEV : XSZS_appId_PROD;

//appKey 登录销售助手接口使用
const XSZS_appKey_DEV = "3s78yo1pv1pucentst5rl3jvbyl6iwmn";  //测试
const XSZS_appKey_PROD = "do5d9txfvtdt7neftljltgxa1pcpuate";   //生产
export const XSZS_appKey = keyEnv === 'dev' ? XSZS_appKey_DEV : XSZS_appKey_PROD;

//client_id
export const XSZS_client_id = "138B0798-8D43-4588-B291-DB8545865C8A";
/*****end******/


/***新销售助手***/
//环境
const NXSZS_HTTP_URL_LOCALHOST = "/LLZSAPI";  //代理地址
const NXSZS_HTTP_URL_DEV = "https://sso-test.baojunev.com";   //测试
const NXSZS_HTTP_URL_PROD = "https://sso-sales.sgmwsales.com";   //生产
export const NXSZS_HTTP_URL = (env == 'localhost' ? NXSZS_HTTP_URL_LOCALHOST : (env == 'dev' || env == 'uat') ? NXSZS_HTTP_URL_DEV : NXSZS_HTTP_URL_PROD);

//client_id 账号密码登录菱菱助手接口使用
const NXSZS_client_id_DEV = "jlxs_test";
const NXSZS_client_id_PROD = "jlxs";
//账号密码登录登录使用的client_id
export const NXSZS_clientId = keyEnv === 'dev' ? NXSZS_client_id_DEV : NXSZS_client_id_PROD;


//client_id 手机验证码登录菱菱助手接口使用
const NXSZS_client_id_phone_DEV = "jlxs_phone_test";
const NXSZS_client_id_phone_PROD = "jlxs_phone";
//手机验证码登录使用的client_id
export const NXSZS_clientId_phone = keyEnv === 'dev' ? NXSZS_client_id_phone_DEV : NXSZS_client_id_phone_PROD;

//client_secret 账号密码登录菱菱助手接口使用
const NXSZS_client_secret_DEV = "0440158b-6de0-443f-a32c-cc8f1ccefd20";
const NXSZS_client_secret_PROD = "a95cf710-8320-457b-a8eb-741264c592f7";
//登录使用的client_secret
export const NXSZS_client_secret = keyEnv === 'dev' ? NXSZS_client_secret_DEV : NXSZS_client_secret_PROD;

//client_secret 手机验证码登录菱菱助手接口使用
const NXSZS_client_secret_phone_DEV = "f495f7ee-ef97-45d5-8819-5452ec0f171d";
const NXSZS_client_secret_phone_PROD = "e622f989-0eca-4d05-ac46-819c2224c335";
//手机验证码登录使用的client_secret
export const NXSZS_client_secret_phone = keyEnv === 'dev' ? NXSZS_client_secret_phone_DEV : NXSZS_client_secret_phone_PROD;

export const NXSZS_client_id_login = "D1EBCD6A-B8C4-4055-9FBA-D8AFEF00357F";
export const NXSZS_client_id_app = "8ee2c202-1e5e-4c50-b620-016cb967c768";
/*****end******/


/***服务助手***/
const FWZS_HTTP_URL_LOCALHOST = "FWZSAPI";
const FWZS_HTTP_URL_PROD = "https://sgmwsa.shaoxingzhuoyue.com/api";
export const FWZS_HTTP_URL = env === 'localhost' ? FWZS_HTTP_URL_LOCALHOST : FWZS_HTTP_URL_PROD;

//appid
export const FWZS_appid = "52492bf5765840b192fac6c7ca3d10c8";

export const FWZS_SecretKey = "48c85555fbf14d489536070b32c6998f";

export const FWZS_client_id = '5729E3DD-4DD9-4132-9365-016E6FE676E1';

/*****end******/


/*****系统部分配置******/
export const defaultImg = './assets/imgs/default.jpg';
export const defaultHeadPhoto = './assets/imgs/userDefault.jpg';

export const pageSize = 10;
export const LastVersion = '2.1.2';

//提示信息
export const NoUserMsg = "您的用户信息暂未同步到骏菱学社，请稍后再试。如有问题，请致电0772-2650611。";
export const LLZSNoUserMsg = "无该用户信息，请至菱菱助手查看备案信息。";

//分享
const PCURLDEV = "https://devportal1.chinacloudsites.cn/#/"  //dev
const PCURLUAT = "https://sitportal1.chinacloudsites.cn/#/"  //uat
const PCURLPROD = "http://elearning.sgmw.com.cn/#/"  //prod

export const PCURL = (env === 'localhost' ? PCURLDEV : (env == 'dev' ? PCURLDEV : (env == 'uat' ?
    PCURLUAT : (env == 'prod' ? PCURLPROD : ''))));
