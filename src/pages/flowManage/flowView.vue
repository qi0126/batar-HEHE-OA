<template>
  <div class="userWrap" v-loading="loadingList">
    <section class="leftWrap">
      <div class="title">流程列表</div>
      <div class="line"></div>
      <ul>
        <li
          v-for="(item,index) in flowList"
          :key="item.type"
          @click="selectuser(item,index)"
          @mouseover="mouseover(item.type)"
          @mouseout="mouseout"
          :class="{'active':activeIndex === item.type}"
        >
          <span>{{item.name}}</span>
          <!-- <i
            class="iconfont icon-bianji red_font"
            v-show="mouseid === item.id"
            @click.stop="edituser(item)"
          ></i>-->
        </li>
        <li v-if="flowList.length === 0" style="color: #909399;">暂无流程</li>
      </ul>
    </section>
    <section class="rightWrap" v-if="flowList.length > 0">
      <div class="title">流程详情</div>
      <div class="line"></div>
      <div class="txtRight right20" v-if="flowEdit">
        <el-button type="primary" size="small" @click="editFun" v-if="!editTF">编辑</el-button>
        <span v-else>
          <el-button type="primary" size="small" @click="saveFun">保存</el-button>
          <el-button type="primary" size="small" plain @click="cancelFun">取消</el-button>
        </span>
      </div>
      <el-row class="flowViewDiv" v-if="!editTF">
        <el-col :span="3" class="txtRight" style="padding-right:17px;">
          <div v-if="pointAllData.id != null">流程状态</div>
          <div>流程名称</div>
          <div>备注信息</div>
          <div>订单流程</div>
          <div>更改时间</div>
        </el-col>
        <el-col :span="21" class="txtLeft txtBlack">
          <div v-if="pointAllData.id != null">
            <span v-if="!flowOpenOrClose">
              <span v-if="pointAllData.status === 0">开启</span>
              <span v-if="pointAllData.status === 1" class="txtYellow">关闭</span>
            </span>
            <span v-if="flowOpenOrClose">
              <el-radio v-model="pointAllData.status" :label="0" @change="changeStatus">开启</el-radio>
              <el-radio v-model="pointAllData.status" :label="1" @change="changeStatus">关闭</el-radio>
            </span>
          </div>
          <div>{{pointAllData.name}}</div>
          <div>{{pointAllData.remark}}</div>
          <div v-show="false">
            <span v-for="(ielem,ind) in pointList" :key="ind">
              {{ielem.nodeName}}
              <span v-if="(ind+1) < pointList.length">--></span>
            </span>
          </div>
          <div v-if="pointAllData.nodeList != null && pointAllData.nodeList.length > 0">
            <span v-for="(item,index) in pointAllData.nodeList" :key="item.nodeId">
              {{item.nodeName}}
              <i
                class="el-icon-right"
                v-if="index !== pointAllData.nodeList.length - 1"
              ></i>
            </span>
          </div>
          <div>{{pointAllData.updateTime}}</div>
        </el-col>
      </el-row>
      <el-row class="flowViewDiv" v-if="editTF">
        <el-col :span="10" :offset="2">
          <div>流程名称</div>
          <el-input placeholder="请输入自定义流程名称" v-model="pointAllData.name" disabled></el-input>
          <div class="mtop20">备注</div>
          <el-input
            placeholder="请输入备注信息"
            v-model="pointAllData.remark"
            show-word-limit
            maxlength="20"
          ></el-input>
        </el-col>
        <el-col :span="12">&nbsp;</el-col>
      </el-row>
      <el-row class="flowViewDiv" v-if="editTF">
        <el-col :span="20" :offset="2">
          <div class="mtop20" style="display:flex;">
            <span v-for="(ielem,ind) in pointList" :key="ind">
              <!-- <span v-if="ind != (pointList.length-1)">{{ielem.nodeName}}</span> -->
              <span class="nodeWrap">
                <div class="nodeBtn">
                  <el-button plain size="small" @click="editPointFun(ielem,ind)">{{ielem.nodeName}}</el-button>
                  <i class="el-icon-circle-close left10 txtRed" @click="delPointFun(ielem,ind)"></i>--->
                </div>
                <div class="nodePerson">
                  <div v-for="(item,index) in ielem.auditorName" :key="index">{{item}}</div>
                </div>
              </span>
            </span>
            <div>
              <el-button plain size="small" type="primary" @click="addPointFun">添加节点</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </section>

    <section class="rightWrap" v-else>
      <div class="title">流程详情</div>
      <div class="line"></div>
      <div class="noData">暂无流程</div>
    </section>

    <!--编辑节点弹框 -->
    <el-dialog
      width="1000px"
      title="编辑节点"
      :close-on-click-modal="false"
      :visible.sync="editPointTF"
    >
      <section class="dialogWrap">
        <el-row>
          <el-col :span="16">
            <span class="title">节点名称</span>
            <el-input
              v-model="userDataOne.nodeName"
              placeholder="请设置节点名称"
              size="small"
              style="width:240px"
              @input="inputFun"
            ></el-input>
            <el-input
              v-model="searchName"
              placeholder="请输入关键字搜索"
              size="small"
              style="width:240px"
              prefix-icon="el-icon-search"
              @blur="searchNameEditFun('searchName')"
            ></el-input>
          </el-col>
          <el-col :span="8" class="txtRight">
            <el-button size="small" type="primary" @click="editPointTF = false" plain>取 消</el-button>
            <el-button
              size="small"
              type="primary"
              @click="editSubUserFun"
              :loading="btnloading"
            >确认保存</el-button>
          </el-col>
        </el-row>
        <userList
          :userData="userDataOne"
          @checkedFn="checkedFun"
          :authUsersID="authUsersID"
          :itemStamp="itemStamp"
          :nodePersonData="nodePersonData"
        ></userList>
      </section>
    </el-dialog>
    <!--新增节点弹框 -->
    <el-dialog width="1000px" title="新增节点" :close-on-click-modal="false" :visible.sync="addPointTF">
      <section class="dialogWrap">
        <el-row>
          <el-col :span="16">
            <span class="title">节点名称</span>
            <el-input
              v-model="userSubName"
              placeholder="请设置节点名称"
              size="small"
              style="width:240px"
              @blur="goEmpty('userSubName')"
            ></el-input>
            <el-input
              v-model="searchName"
              placeholder="请输入关键字搜索"
              size="small"
              style="width:240px"
              prefix-icon="el-icon-search"
              @blur="searchNameAddFun('searchName')"
            ></el-input>
          </el-col>
          <el-col :span="8" class="txtRight">
            <el-button size="small" type="primary" @click="addPointTF = false" plain>取 消</el-button>
            <el-button
              size="small"
              type="primary"
              @click="addPointOneFun"
              :loading="btnloading"
            >确认增加</el-button>
          </el-col>
        </el-row>
        <userList
          :userData="userDataOne"
          @checkedFn="checkedFun"
          :authUsersID="authUsersID"
          :itemStamp="itemStamp"
          :nodePersonData="nodePersonData"
        ></userList>
      </section>
    </el-dialog>
  </div>
</template>

<script>
import { userList } from "../flowManage/common/index";
export default {
  components: {
    userList
  },
  data() {
    return {
      itemStamp: new Date(),
      authUsersID: [],
      oneIndex: "", //一级下标
      editIdnex: "", //二级下标
      nodePersonData: [],
      loadingList: false,
      btnloading: false,
      saveType: false, // 底部状态
      openTF: true,
      editUserItem: {}, //需要编辑菜单
      pointName: "", //新增目录名称
      searchName: "", //搜索字段
      userSubName: "", //新增子菜单名称
      addPointTF: false,
      mock: "",
      activeIndex: null, //选中下标
      mouseid: "", //鼠标移入菜单id
      flowList: [], //菜单列表
      props: {
        label: "name",
        children: "sonUser"
      },
      pointAllData: {},
      pointList: [], //节点流程
      editPointTF: false, //编辑节点
      editTF: false, //查看状态为false,编辑状态为edit
      addPointTF: false,
      addTF: false, //查看状态为false,新增状态为edit
      checkedList: [],
      checkedListName: [],
      userDataOne: {},
      nodeId: "",
      editNode: {},
      flowOpenOrClose: false,
      flowEdit: false
    };
  },
  created() {
    this.allFun();
    this.getAuth();
  },
  methods: {
    async allFun() {
      await this.findNodeFun();
      await this.flowAll();
    },
    //查询节点人
    findNodeFun() {
      let params = {};
      return this.$api.findUserByNodeId(params).then(
        res => {
          if (res.code == 200) {
            this.nodePersonData = res.data.userVoList;
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
        }
      );
    },
    getAuth() {
      let authObj = JSON.parse(sessionStorage.verify);
      this.flowOpenOrClose = false;
      this.flowEdit = false;
      authObj.forEach(ielem => {
        if (ielem === "flow:openOrClose") {
          this.flowOpenOrClose = true;
        }
        if (ielem === "flow:edit") {
          this.flowEdit = true;
        }
      });
    },
    flowAll() {
      this.loadingList = true;
      return this.$api.flowAll().then(
        res => {
          if (res.code == 200) {
            this.flowList = res.data;
            if (this.flowList.length > 0) {
              this.selectuser(this.flowList[0], 0);
            }

            this.flowList.forEach(item => {
              if (item.nodeList != null) {
                item.nodeList.forEach(one => {
                  one.auditor = one.auditor.split(",");
                  one.auditorName = [];
                  if(this.nodePersonData && this.nodePersonData.length > 0){
                    one.auditor.forEach(two => {
                      this.nodePersonData.forEach(three => {
                        if (two == three.userId) {
                          one.auditorName.push(three.concat);
                        }
                      });
                    });
                  }

                });
              }
            });

            this.loadingList = false;
          } else {
            this.$message.error(res.message);
            this.loadingList = false;
            this.loadingList = false;
          }
        },
        err => {
          this.$message.error(res.message);
          this.loadingList = false;
        }
      );
    },
    //鼠标移入
    mouseover(id) {
      this.mouseid = id;
    },
    //鼠标移出
    mouseout() {
      this.mouseid = "";
    },

    //选择菜单
    selectuser(item, index) {
      this.activeIndex = item.type;
      this.editUserItem = item;
      this.getUser(item);
      this.oneIndex = index;
    },
    //去空
    goEmpty(name) {
      this[name] = this.$tools.goEmpty(this[name]);
    },
    //公司組件传给父组件
    checkedFun(elem) {
      this.checkedList = elem.id;
      this.checkedListName = elem.name;
    },
    //搜索
    searchNameEditFun(name) {
      this.goEmpty(name);
      this.searchNameFun();
    },
    //搜索
    searchNameAddFun(name) {
      this.goEmpty(name);
      this.searchNameFun();
    },

    //编辑节点方法
    editSubUserFun() {
      let self = this;
      if (this.userDataOne.nodeName === "") {
        this.$message.warning("请输入节点名称");
        return;
      }
      if (this.checkedList.length === 0) {
        this.$message.warning("未选择员工，请重新选择提交！");
        return;
      }

      let params = {
        flowId: this.editUserItem.id,
        nodeId: this.nodeId,
        nodeName: this.userDataOne.nodeName,
        auditor: this.checkedList,
        auditorName: this.checkedListName
      };

      this.pointList.splice(this.editIdnex, 1, params);
      this.editPointTF = false;
    },
    //新增节点方法
    addPointOneFun() {
      let self = this;
      if (this.userSubName === "") {
        this.$message.warning("请输入节点名称");
        return;
      }

      if (this.checkedList.length == 0) {
        this.$message.warning("请选择审核人员！");
        return;
      }
      let params = {
        nodeName: this.userSubName,
        flowId: this.editUserItem.id,
        auditor: this.checkedList,
        auditorName: this.checkedListName
      };
      this.pointList.push(params);
      this.addPointTF = false;
    },
    //编辑菜单
    edituser(item) {
      this.editUserItem = item;
    },

    //根据id查询菜单
    getUser(ielem) {
      this.pointAllData = ielem;
      this.pointList = ielem.nodeList;
    },
    //编辑状态
    editFun() {
      this.$confirm("确认需要编辑此流程？")
        .then(_ => {
          this.editTF = true;
        })
        .catch(_ => {});
    },
    saveFun() {
      let self = this;
      this.$confirm("确认需要保存此流程", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let pointList = JSON.parse(JSON.stringify(this.pointList));
          pointList.forEach(item => {
            delete item.auditorName;
            item.auditor = item.auditor.join();
          });
          let params = {
            id: this.pointAllData.id,
            flowName: this.pointAllData.name,
            remark: this.pointAllData.remark,
            type: this.pointAllData.type,
            flowNodeList: pointList != null ? [...pointList] : []
          };

          this.$api.updateFlow(params).then(
            res => {
              if (res.code == 200) {
                this.flowAll();
                this.editPointTF = false;
                this.$message.success("修改流程成功，正在刷新页面！");
                setTimeout(function() {
                  self.selectuser(self.editUserItem, self.oneIndex);
                }, 1000);
              }else{
                return
              }
              this.editTF = false;
            },
            err => {
              this.allFun();
              this.editTF = false;
            }
          );
          
        })
        .catch(() => {});
    },
    cancelFun() {
      this.$confirm("确认需要取消保存？")
        .then(_ => {
          this.editTF = false;
          this.allFun();
        })
        .catch(_ => {});
    },
    editPointFun(ielem, index) {
      let newAuditor = [];
      if (ielem.auditor != null) {
        newAuditor = ielem.auditor.map(item => {
          return Number(item);
        });
      }

      this.editIdnex = index;
      this.searchName = "";

      this.userDataOne.userVoList = this.nodePersonData;
      this.authUsersID = newAuditor;
      this.userDataOne.nodeName = ielem.nodeName;
      this.itemStamp = new Date();
      this.editPointTF = true;
      this.checkedList = newAuditor;
      this.checkedListName = ielem.auditorName;
      this.$forceUpdate();
    },
    addPointFun() {
      this.userSubName = "";
      this.searchName = "";
      let params = {
        searchName: this.searchName
      };

      this.checkedList = [];
      this.itemStamp = new Date();
      this.userDataOne.userVoList = this.nodePersonData;
      this.addPointTF = true;
    },
    //改变开启/关闭状态
    changeStatus() {
      let params = {
        flowId: this.pointAllData.id,
        status: this.pointAllData.status
      };
      this.$api.openOrCloseFlow(params).then(
        res => {
          if (res.code == 200) {
            this.$message.success("改变流程状态成功！");
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
        }
      );
    },
    //删除节点
    delPointFun(ielem, index) {
      this.$confirm("确认需要删除此流程？")
        .then(_ => {
          this.pointList.splice(index, 1);
        })
        .catch(_ => {});
    },
    //输入事件
    inputFun() {
      this.$forceUpdate();
    },
    searchNameFun() {
      let params = {
        searchName: this.searchName
      };

      this.$api.findUserByNodeId(params).then(
        res => {
          if (res.code == 200) {
            this.userDataOne.userVoList = res.data.userVoList;
            this.itemStamp = new Date();
          }
        },
        err => {
          this.$message.error(res.message);
        }
      );
    }
  }
};
</script>


<style scoped lang="scss" >
.red_font {
  color: #9e0029;
}
.userWrap {
  // background: red;
  // margin-left:-20px;
  // margin-top: -20px;
  // width: 100%;
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
  .leftWrap {
    box-sizing: border-box;
    padding: 15px 0px;
    width: 240px;
    position: absolute;
    top: -20px;
    left: -20px;
    height: 106%;
    border-right: 16px solid rgb(244, 244, 244);
    .btnWrap {
      text-align: center;
      margin-bottom: 8px;
    }
    ul {
      // overflow-y: scroll;
      height: 85%;
      li {
        // background: red;
        cursor: pointer;
        font-size: 14px;
        padding: 0px 16px;
        height: 40px;
        border: 1px solid #fff;
        display: flex;
        align-items: center;
        display: flex;
        justify-content: space-between;
        &:hover {
          background: rgb(246, 233, 236);
          color: #9e0029;
        }
      }
      .active {
        background: rgb(246, 233, 236);
        color: #9e0029;
      }
    }
  }
  .rightWrap {
    padding: 15px 0px;
    width: 88%;
    position: absolute;
    top: -20px;
    left: 220px;
    height: 102%;

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
}

.noData {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  height: 50vh;
  font-size: 16px;
}

.nodeWrap {
  display: flex;
  flex-direction: column;
  .nodeBtn {
  }
  .nodePerson {
  }
}
</style>

