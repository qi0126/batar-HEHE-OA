/*
 * des: 公用工具;
 */
// import Storage from '@/api/storage'
import Storage from '../api/storage'
class Tools {

    /**
     * 去除所有空
     * @param {*} option 字符型
     */
    goEmpty(option) {
        return option.replace(/\s+/g, "");
    }


    /**
     * 权限控制
     * @param {*} num 权限ID
     */
    controlPower(num) {
        if (!num) {
            return false
        }
        let controller = Storage.sessionGet('controller'),
            result = false;
        controller.forEach(item => {
            if (item.permsId == num) {
                result = !!item.checked
            }
        })


        return result
    } 
    //数组去重
    listUnique(value) {
        let ret = value.filter((element, index, self) => {
            return self.indexOf(element) === index
        })
        return ret.sort()
    }
};


export const tools = new Tools()