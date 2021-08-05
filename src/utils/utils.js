import router from "@/router/index";
import CryptoJS from "crypto-js";




//base64加密 解密

/* //1.加密
var result = Base.encode('125中文');  //--> "MTI15Lit5paH"

//2.解密
var result2 = Base.decode(result); //--> '125中文'
*/

// ~(function(root, factory) {
//   if (typeof define === "function" && define.amd) {
//     define([], factory);
//   } else if (typeof module === "object" && module.exports) {
//     module.exports = factory();
//   } else {
//     root.Base = factory();
//   }
// }(this, function() {
//   'use strict';
//
function Base64() {
    // private property
    this._keyStr =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
}

//public method for encoding
Base64.prototype.encode = function (input) {
    var output = "",
        chr1,
        chr2,
        chr3,
        enc1,
        enc2,
        enc3,
        enc4,
        i = 0;
    input = this._utf8_encode(input);
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output =
            output +
            this._keyStr.charAt(enc1) +
            this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) +
            this._keyStr.charAt(enc4);
    }
    return output;
};

// public method for decoding
Base64.prototype.decode = function (input) {
    var output = "",
        chr1,
        chr2,
        chr3,
        enc1,
        enc2,
        enc3,
        enc4,
        i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    output = this._utf8_decode(output);
    return output;
};

// private method for UTF-8 encoding
Base64.prototype._utf8_encode = function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
};

// private method for UTF-8 decoding
Base64.prototype._utf8_decode = function (utftext) {
    var string = "",
        i = 0,
        c = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0;
    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if (c > 191 && c < 224) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(
                ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
            );
            i += 3;
        }
    }
    return string;
};

var Base = new Base64();
//
//   return Base;
// }));

export default {
    fomartParams(obj) {
        let newKeys = Object.keys(obj).sort();
        let newObj = {};
        for (let i = 0; i < newKeys.length; i++) {
            newObj[newKeys[i]] = obj[newKeys[i]];
        }
        let result = "";
        for (let it in newObj) {
            if (Object.prototype.toString.call(newObj[it]) === "[object Array]") {
                newObj[it].forEach(val => {
                    result += it + "=" + val + "&";
                });
            } else {
                result += it + "=" + newObj[it] + "&";
            }
        }
        result = result.substring(0, result.length - 1);
        return result;
    },
    isEmptyObj(obj) {
        let is = false;
        if (obj) {
            JSON.stringify(obj) === "{}" ? (is = true) : (is = false);
        } else {
            is = true;
        }
        return is;
    },
    //数组去重
    listUnique(value) {
        let ret = value.filter((element, index, self) => {
            return self.indexOf(element) === index
        })
        return ret.sort()
    },
    setCookie(c_name, value) {
        let date = new Date();
        date.setTime(date.getTime() + expiredays * 1000);
        if (expiredays && expiredays != "") {
            document.cookie = `${c_name}=${value};expires=${date.toGMTString()}`;
        } else {
            document.cookie = `${c_name}=${value}`;
        }
    },
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
    delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() + -1 * 24 * 60 * 60 * 1000);
        var cval = this.getCookie(name);
        document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
    },
    encodeBase64(e) {
        let p = new Promise((resolve, reject) => {
            let uploadFile = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(uploadFile);
            reader.onloadend = function () {
                return resolve(reader.result);
            };
        });
        return p;
    },
    reset(element) {
        element.value = "";
    },
    delDataFromArray(array, data) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] == data) {
                array.splice(i, 1);
                break;
            }
        }
    },
    getType(obj) {
        //tostring会返回对应不同的标签的构造函数
        let toString = Object.prototype.toString;
        let map = {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regExp",
            "[object Undefined]": "undefined",
            "[object Null]": "null",
            "[object Object]": "object"
        };
        if (obj instanceof Element) {
            return "element";
        }
        return map[toString.call(obj)];
    },
    deepClone(data) {
        let type = this.getType(data);
        let obj;
        if (type === "array") {
            obj = [];
        } else if (type === "object") {
            obj = {};
        } else {
            //不再具有下一层次
            return data;
        }
        if (type === "array") {
            for (let i = 0, len = data.length; i < len; i++) {
                obj.push(this.deepClone(data[i]));
            }
        } else if (type === "object") {
            for (let key in data) {
                obj[key] = this.deepClone(data[key]);
            }
        }
        return obj;
    },
    goLogin() {
        router.push("/login");
    },
    formatData(standardDate) {
        let d = new Date(standardDate);
        let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        return date;
    },
    formatDataTime(standardTime) {
        let d = new Date(standardTime);
        let dateTime = `${
            d.getFullYear()}-${
            d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}-${
            d.getDate() < 10 ? '0' + d.getDate() : d.getDate()} ${
            d.getHours() < 10 ? '0' + d.getHours() : d.getHours()}:${
            d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}:${
            d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()}
    `
        return dateTime;
    },

    //h5页面203处理
    errInfo(self) {
        self.err = localStorage.getItem("phoneError")
            ? localStorage.getItem("phoneError")
            : ``;
    },

    /**
     * 加密（需要先加载lib/aes/aes.min.js文件）
     * @param word
     * @returns {*}
     */

    encrypt(word) {
        var key = CryptoJS.enc.Utf8.parse("acdwessdbatar123");
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },

    /**
     * 解密
     * @param word
     * @returns {*}
     */
    decrypt(word) {
        var key = CryptoJS.enc.Utf8.parse("acdwessdbatar123");
        var decrypt = CryptoJS.AES.decrypt(word, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    },

    //判断是否是微信浏览器的函数
    isWeiXin() {
        //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
        var ua = window.navigator.userAgent.toLowerCase();
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },

    // 产品规则判断 手镯 戒指开口未判断
    isProClass(data) {
        for (let i = 0; i < Object.keys(data).length; i++) {
            let item = Object.keys(data)[i]
            if (item === 'length') {
                return '项链'
            }
            if (item === 'diameterLength' && data[item]) {
                return '手镯'  // 固口
            }
            if (item === 'height') {
                return '吊坠'
            }
            if (item === "ringHand" && data[item]) {
                return '戒指' // 固口
            }
        }
    },

    // 对象数组去重
    unique(arr) {
        let unique = {};
        arr.forEach((item) => {
            unique[JSON.stringify(item)] = item;
        })
        arr = Object.keys(unique).map(function (u) {
            return JSON.parse(u);
        })
        return arr;
    },

    // 改变规格
    changeItemSpec(options) {
        if (typeof options !== 'string') {
            return
        }
        options = options.replace(/、$/, '')
        options = options.replace(/^、/, '')
        options = options.replace(/、、/g, '、')
        options = options.replace(/、undefined+/g, '')
        options = options.replace(/undefined+/g, '')
        if (/、$/.test(options) || /^、/.test(options) || /、、/.test(options) || /、undefined+/g.test(options) || /undefined+/g.test(options)) {
            options = this.changeItemSpec(options)
        }
        return options
    },

    // 计算价格
    countPrice(condit, feeType, totalSum, additionPrice = 0, feePrice = 0, weight = 0) {
        let allPrice = 0

        let priceObj = {
            997: localStorage.getItem('price997'),
            999: localStorage.getItem('price999'),
            9999: localStorage.getItem('price9999')
        }

        let conditPrice = priceObj[parseInt(condit)]

        if (feeType === 1) {
            allPrice = (parseFloat(conditPrice) * weight * totalSum) + (additionPrice * weight * totalSum)
        }
        if (feeType === 2) {
            allPrice = (parseFloat(conditPrice) * weight * totalSum) + (feePrice * totalSum)
        }
        return allPrice
    },

    // 套装计算价格
    countSuitPrice(condit, feeType = 1, totalSum, additionPrice = 0, feePrice = 0, weight = 0) {
        let allPrice = 0
        let priceObj = {
            997: localStorage.getItem('price997'),
            999: localStorage.getItem('price999'),
            9999: localStorage.getItem('price9999')
        }
        let conditPrice = priceObj[parseInt(condit)]

        if (feeType === 1) {
            // allPrice = (conditPrice * weight * totalSum) + (additionPrice * weight * totalSum)
            allPrice = (parseFloat(conditPrice) + additionPrice) * weight * totalSum
            // allPrice = additionPrice * totalSum
        }

        if (feeType === 2) {
            allPrice = (parseFloat(conditPrice) * weight * totalSum) + (feePrice * totalSum)
            // allPrice = feePrice * totalSum
        }
        return allPrice
    }


};
