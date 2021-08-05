import Vue from 'vue'
import router from './router'
import element from "element-ui"
import moment from 'moment'


import "element-ui/lib/theme-chalk/index.css"
import './styles/index.scss'
import '@/styles/theme/index.css'

import App from './App.vue';
import Api from './api/api'
import Storage from './api/storage'
import {
    tools
} from '@/utils/tool'


import '@/api/global'

const PopoverImg = () =>
    import ('@/components/popoverImg/popoverImg')
const Steps = () =>
    import ('@/components/steps')
const NoDataPage = () =>
    import ('@/components/noDataPage')

Vue.config.productionTip = false
Vue.config.devtools = true


Vue.prototype.$api = Api;
Vue.prototype.$moment = moment;
Vue.prototype.$Storage = Storage;
Vue.prototype.$tools = tools;


Vue.use(element);

Vue.component('PopoverImg', PopoverImg)
Vue.component('Steps', Steps)
Vue.component('NoDataPage', NoDataPage)

new Vue({
    el: '#app',
    data: {
        eventHub: new Vue()
    },
    router,
    components: {
        App
    },
    template: '<App/>'
})