module.exports = {

    // 环境变量配置
    development: {
        envObj: {
            NODE_ENV: '"development"',
            API_HOST: '"http://192.168.16.103:8090"', 
            API_IMG: '"http://192.168.16.103:8080"',
        }
    },

    test: {
        envObj: {
            NODE_ENV: '"test"',
            API_HOST: '"http://192.168.16.103:8090"', 
            API_IMG: '"http://192.168.16.103:8080"',
        }
    },

    formalTest: {
        envObj: {
            NODE_ENV: '"test"',
            API_HOST: '"http://192.168.16.103:8091"',
            API_IMG: '"http://192.168.16.103:8081"'
        }
    },

    demo: {
        envObj: {
            NODE_ENV: '"test"',
            API_HOST: '"http://192.168.16.103:8091"',
            API_IMG: '"http://192.168.16.103:8081"'
        }
    },

    production: {
        envObj: {
            NODE_ENV: '"production"',
            API_HOST: '"https://m.hhoa.ezgold.cn/"',
            API_IMG: '"http://203.86.16.236:8080"'
        }
    },

}