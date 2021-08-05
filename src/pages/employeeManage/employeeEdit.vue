<template>
  <div class="userWrap" v-loading="loadingTF">
    <section class="rightWrap">
      <div class="title">基本资料</div>
      <div class="line"></div>
      <div class="txtRight right20" v-if="isAdmin !== 'Y' && userEdit">
        <el-button type="primary" size="small" @click="editFun" v-if="!editTF">编辑</el-button>
        <span v-else>
          <el-button type="primary" size="small" @click="saveFun">保存</el-button>
          <el-button type="primary" size="small" plain @click="cancelFun">取消</el-button>
        </span>
      </div>
      <el-row class="flowViewDiv" v-if="!editTF">
        <el-col :span="3" class="txtRight" style="padding-right:17px;">
          <div>员工账号</div>
          <div>密码</div>
          <div>员工姓名</div>
          <div>员工状态</div>
          <div>手机号码</div>
          <!-- <div>办公电话</div> -->
          <div>邮箱地址</div>
          <div>员工角色</div>
          <!-- <div>所属部门</div> -->
        </el-col>
        <el-col :span="21" class="txtLeft txtBlack">
          <div>{{editUserData.username || '-'}}</div>
          <div>******</div>
          <div>{{editUserData.concat || '-'}}</div>
          <div>
            <span v-if="editUserData.status === null">-</span>
            <span v-if="editUserData.status === 0">启用</span>
            <span v-if="editUserData.status === 1" class="txtYellow">禁用</span>
          </div>
          <div>{{editUserData.telephone || '-'}}</div>
          <!-- <div>暂无</div> -->
          <div>{{editUserData.mail || '-'}}</div>
          <div>{{editUserData.roleName || '-'}}</div>
          <!-- <div>金库</div> -->
        </el-col>
      </el-row>
      <el-row class="flowViewDiv" v-if="editTF">
        <el-col :span="10" :offset="2">
          <el-row>
            <el-col :span="8">
              <div>员工账号</div>
              <div>密码</div>
              <div>姓名</div>
              <div>角色</div>
              <!-- <div>所属部门</div> -->
            </el-col>
            <el-col :span="16">
              <div>{{editUserData.username || '-'}}</div>
              <div>******</div>
              <div>{{editUserData.concat || '-'}}</div>
              <div>
                <el-select v-model="editUserData.roleId" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in roleAllList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                  ></el-option>
                </el-select>
              </div>
              <!-- <div>业务部</div> -->
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="8">
              <div>状态</div>
              <div>手机号码</div>
              <!-- <div>办公电话</div> -->
              <!-- <div>角色</div> -->
              <!-- <div>所属部门</div> -->
            </el-col>
            <el-col :span="16">
              <div>
                <el-radio v-model="editUserData.status" :label="0" @change="radioFun">开启</el-radio>
                <el-radio v-model="editUserData.status" :label="1" @change="radioFun">关闭</el-radio>
              </div>
              <div>{{editUserData.telephone || '-'}}</div>
              <!-- <div>-</div> -->
              <!-- <div>{{editUserData.mail || '-'}}</div> -->
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: "N",
      userId: "",
      btnloading: false,
      saveType: false, // 底部状态
      openTF: true,
      editUserData: {}, //查看/编辑用户数据
      menuName: "", //新增目录名称
      menuSubName: "", //新增子菜单名称
      dialogCreateState: false,
      mock: "",
      //菜单列表
      props: {
        label: "name",
        children: "sonMenu"
      },
      editTF: false, //查看状态为false,编辑状态为edit
      roleAllList: [],
      roleId: "",
      loadingTF: false,
      userEdit: false
    };
  },
  created() {
    this.userId = this.$route.query.userId;
    this.getAuth(); //权限判断
    if (this.userId) {
      this.getDetails();
      this.roleFindAll(); //所有角色列表读取事件
    } else {
      this.initFun();
      this.roleFindAll();
    }
  },
  methods: {
    async initFun() {
      await this.getUserInfo();
      await this.getDetails();
    },
    //登录成功后查询用户信息和权限
    getUserInfo() {
      return this.$api.getUserInfo().then(res => {
        if (res.code == 200) {
          this.userId = res.data.userId;
        }
      });
    },
    getAuth() {
      let authObj = JSON.parse(sessionStorage.verify);
      this.userEdit = false;
      authObj.forEach(ielem => {
        if (ielem === "user:edit") {
          this.userEdit = true;
        }
      });
    },
    //获取详情
    getDetails() {
      this.loadingTF = true;
      let params = {
        userId: this.userId
      };
      return this.$api.findById(params).then(
        res => {
          this.loadingTF = false;
          if (res.code == 200) {
            this.isAdmin = res.data.isAdmin;
            this.editUserData = res.data;
            this.editUserData.status =
              this.editUserData.status === 0 ? this.editUserData.status : 1;
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.loadingTF = false;
          this.$message.error(res.message);
        }
      );
    },
    //所有角色列表读取事件
    roleFindAll() {
      this.$api.roleFindAll().then(
        res => {
          if (res.code == 200) {
            this.roleAllList = res.data;
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
        }
      );
    },

    //编辑状态
    editFun() {
      this.$confirm("确认需要编辑此员工？")
        .then(_ => {
          this.editTF = true;
        })
        .catch(_ => {});
    },
    saveFun() {
      if (this.editUserData.roleId == null) {
        this.$message.warning("请选择角色！");
        return;
      }
      this.roleAllList.forEach(ielem => {
        if (this.editUserData.roleId === ielem.roleId) {
          this.editUserData.roleName = ielem.roleName;
        }
      });
      this.$confirm("确认需要保存此员工？")
        .then(_ => {
          let params = {
            userId: this.userId,
            status: this.editUserData.status,
            roleId: this.editUserData.roleId,
            roleName: this.editUserData.roleName
          };

          this.$api.userUpdate(params).then(
            res => {
              if (res.code == 200) {
                this.getDetails();
                this.editTF = false;
                this.$message.success("修改员工成功，正在刷新页面！");
              } else {
                this.$message.error(res.message);
              }
            },
            err => {
              this.$message.error(res.message);
            }
          );
        })
        .catch(_ => {});
    },
    cancelFun() {
      this.$confirm("确认需要取消保存？")
        .then(_ => {
          this.editTF = false;
          this.initFun();
        })
        .catch(_ => {});
    },
    radioFun() {
      this.$forceUpdate();
    }
  }
};
</script>


<style scoped lang="scss" >
.red_font {
  color: #9e0029;
}
.userWrap {
  height: 100%;
  position: relative;
  .title {
    font-size: 14px;
    font-weight: bold;
    color: rgba(46, 48, 51, 1);
    padding: 0px 16px;
  }
  .line {
    width: 100%;
    border-top: 1px solid rgba(218, 221, 229, 1);
    margin-top: 15px;
    margin-bottom: 8px;
  }
  .rightWrap {
    width: 100%;
    ul {
      padding-left: 28px;
      padding-top: 24px;
      height: 95%;
      li {
        height: 89%;
        // overflow-y: scroll;
      }
    }
  }

  .dialogWrap {
    .title {
      font-size: 14px;
      font-weight: 400;
      color: rgba(138, 145, 153, 1);
    }
  }

  .footBtnWrap {
    position: absolute;
    left: 0px;
    bottom: 7px;
    height: 50px;
    width: 100%;
    // background: green;
    box-shadow: 6px -6px 10px rgba(0, 0, 0, 0.1);
    text-align: right;
    padding-top: 10px;
    box-sizing: border-box;
    padding-right: 60px;
  }
  .flowViewDiv {
    margin-top: 70px;
    color: #8a9199;
    font-size: 14px;
    line-height: 40px;
  }
  .flowViewDiv .leftDiv {
  }
}
</style>

