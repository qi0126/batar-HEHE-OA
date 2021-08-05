import Vue from 'vue';

//接口服务器端口
let GlobalApiHost;

GlobalApiHost = process.env.API_HOST;
// GlobalApiHost = 'http://192.168.16.103:8091'; //测试
// GlobalApiHost = 'http://192.168.16.103:8090'; //开发
// GlobalApiHost = 'https://m.hhoa.ezgold.cn'; //生产

const GlobalImg = process.env.API_IMG;

Vue.prototype.$GlobalApiHost = GlobalApiHost;
Vue.prototype.$GlobalImg = GlobalImg;

export default {
    GlobalApiHost
};