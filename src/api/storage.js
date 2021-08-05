export default {
    /**
     * 保存数据localStorage
     *
     * @param {*} key 键
     * @param {*} value 值
     */
    set(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value))
    },

    /**
     * 获取数据
     *
     * @param {*} key  键
     */
    get(key) {
        return JSON.parse(window.localStorage.getItem(key))
    },

    /**
     * 删除数据
     *
     * @param {*} key 键
     */
    remove(key) {
        window.localStorage.removeItem(key)
    },

    /**
     * 保存数据Cookie
     *
     * @param {*} key 键
     * @param {*} value 值
     */
    setCookie(c_name, value) {
        window.document.cookie=`${c_name}=${escape(value)};path=/;domain=${window.location.hostname}`; 
    },

    /**
     * 获取Cookie数据
     *
     * @param {*} key  键
     */
    getCookie(c_name) {
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                let c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    },


    /**
     * 保存数据sessionStorage
     *
     * @param {*} key 键
     * @param {*} value 值
     */
    sessionSet(key, value) {
        window.sessionStorage.setItem(key, JSON.stringify(value))
    },

    /**
     * 获取数据
     *
     * @param {*} key  键
     */
    sessionGet(key) {
        return JSON.parse(window.sessionStorage.getItem(key))
    },

    /**
     * 删除数据
     *
     * @param {*} key 键
     */
    sessionRemove(key) {
        window.sessionStorage.removeItem(key)
    }
}