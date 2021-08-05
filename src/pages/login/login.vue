<template>
  <div class="loginWrap">
    <section>
      <div class="content">
        <div class="title">百泰OA管理系统</div>
        <el-input
          v-model="userName"
          placeholder="请输入用户名"
          class="buttonDiv"
          size="large"
          prefix-icon
        >
          <i slot="prefix" class="el-input__icon el-icon-user txtLogo"></i>
        </el-input>
        <el-input
          v-model="password"
          show-password
          placeholder="请输入密码"
          class="password buttonDiv"
          size="large"
          prefix-icon
          @keyup.enter.native="login"
        >
          <i slot="prefix" class="el-input__icon el-icon-lock txtLogo"></i>
        </el-input>
        <el-button type="primary" size="small" class="buttonDiv" @click="login">登 录</el-button>
      </div>
    </section>
  </div>
</template>

<script>
import Base64 from "@/utils/base64";
export default {
  data() {
    return {
      userName: "",
      password: ""
    };
  },
  created() {},
  methods: {
    login() {
      this.loginName = this.userName.replace(/\s+/g, "");
      this.password = this.password.replace(/\s+/g, "");
      let params = {
        loginName: this.loginName,
        // userPassword: Base64.encode(userPassword)
        password: this.password
      };

      if (this.loginName === "" || this.password === "") {
        this.$message.error("请输入账号和密码");
        return;
      }
      this.$api.login(params).then(res => {
          // this.$Storage.setCookie("heheToken", res);
          this.$Storage.set("heheToken", res);
          this.$message({
            duration: 1500,
            showClose: true,
            message: "登录成功，正在跳转中！",
            type: "success"
          });
          this.$router.push("/index");
      });
    }
    // //omsToken跳转
    // heheTokenFun() {
    //   let heheToken = this.$Storage.getCookie("heheToken")
    //     ? this.$Storage.getCookie("heheToken")
    //     : "";
    //   if (heheToken.length > 0) {
    //     this.$Storage.set("heheToken", heheToken);
    //     this.$message({
    //       duration: 1500,
    //       showClose: true,
    //       message: "登录成功，正在跳转中！",
    //       type: "success"
    //     });
    //     this.$router.push("/index");
    //   }
    // }
  }
};
</script>

<style scoped lang="scss" >
.loginWrap {
  background: #e8eaed url("/static/img/loginBack.png") no-repeat;
  // background: #e8eaed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .batarLogoImg {
    position: absolute;
    top: 32px;
    left: 48px;
    width: 191px;
  }
  .buttonDiv {
    width: 320px;
    height: 40px;
    font-size: 16px;
  }
  section {
    width: 875px;
    height: 560px;
    background: url("/static/img/loginBO.png") no-repeat;
    position: relative;
    .content {
      width: 360px;
      position: absolute;
      top: 164px;
      right: 36px;
      .title {
        font-size: 24px;
        font-weight: 400;
        color: #9e0029;
        text-align: left;
        margin-bottom: 29px;
      }
      .password {
        margin-top: 32px;
        margin-bottom: 58px;
      }
    }
  }
}
</style>
