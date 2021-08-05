<template>
  <div v-loading="loadingTF">
    <section class="upperBlock">
      <div>
        <span class="leftTip" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          计划详情
        </span>
      </div>

      <div>
        <el-table :data="detailsDataOne" style="width: 100%;margin-top: 16px">
          <el-table-column label="计划编号" prop="planNum"></el-table-column>
          <el-table-column label="计划类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 0">安排巡店</span>
              <span v-if="scope.row.type === 1">申请巡店</span>
            </template>
          </el-table-column>
          <el-table-column label="主访人" prop="planUserName"></el-table-column>
          <el-table-column label="陪同人" prop="escortUser">
            <template slot-scope="scope">
              <span>{{scope.row.newUserName || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系人" prop="phone"></el-table-column>
          <el-table-column label="创建人" prop="creator"></el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">待提交</span>
              <span v-if="scope.row.status === 1" class="txtYellow">待审核</span>
              <span v-if="scope.row.status === 2">已审核</span>
              <span v-if="scope.row.status === 3" class="txtRed">已驳回</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="txtHui txt14 top10" v-if="orderAllData.content">
          巡店内容：
          <span class="txtBlack">{{orderAllData.content}}</span>
        </div>
        <div class="txtHui txt14 top10" v-if="orderAllData.loaseCause">
          驳回原因：
          <span class="txtRed">{{orderAllData.loaseCause}}</span>
        </div>
      </div>
    </section>
    <div class="hr" />
    <section class="middleBlock">
      <el-row>
        <el-col :span="12">巡店预算</el-col>
        <el-col :span="12" class="txtRight">
          <el-button
            type="primary"
            v-if="orderAllData.status === 1 && btnAuth"
            size="small"
            plain
            @click="confirmFun"
          >审核通过</el-button>
          <el-button
            type="primary"
            v-if="orderAllData.status === 1 && btnAuth"
            size="small"
            @click="backFun"
          >审核驳回</el-button>
        </el-col>
      </el-row>
      <div>
        <Steps v-if="stepData.length > 0" :data="stepData" style="padding: 15px 0;"></Steps>
      </div>
      <el-table
        :data="detailsData"
        style="width: 100%;margin-top: 40px"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="storeNum" label="巡店编号" width="150px"></el-table-column>
        <el-table-column prop="storeName" label="巡店客户" width="220px"></el-table-column>
        <el-table-column prop="predictTime" label="预定时间" width="190px">
          <template slot-scope="scope">
            <span>{{scope.row.predictStartTime}}~{{scope.row.predictEndTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ticketPrice" label="机票"></el-table-column>
        <el-table-column prop="highSpeedFee" label="高铁"></el-table-column>
        <el-table-column prop="trafficPrice" label="其他交通费"></el-table-column>
        <el-table-column prop="putupPrice" label="住宿"></el-table-column>
        <el-table-column prop="mealPrice" label="餐补通讯费"></el-table-column>
        <el-table-column prop="peopleNum" label="人数"></el-table-column>
        <el-table-column prop="timeNum" label="天数"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180px"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btnAuth: false, //审核按钮权限
      selectData: [], //选中的数据
      btnloading: false,
      id: "",
      name: "",
      dialogFormVisible: false,
      detailsDataOne: [{}], //详情数据
      detailsData: [{}, {}, {}, {}], //详情数据
      orderAllData: {}, //单内容
      pageCurrent: 1,
      pageSize: 12,
      total: 0,
      stepData: [], //流程进度显示
      loadingTF: false
    };
  },
  created() {
    this.id = this.$route.query.id;
    // this.name = this.$route.query.name;
    if (this.id) {
      this.getDetails();
      this.findFlowAuth(); //审核流程接口
      this.currUserIsAuth();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    //审核流程接口
    findFlowAuth() {
      let params = {
        planId: this.id
      };
      this.$api.findFlowAuth(params).then(
        res => {
          if (res.code == 200) {
            // this.stepData = res.data;

            this.stepData = res.data == null ? [] : res.data;
            // console.log("进度条", this.stepData);
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          this.$message.error(res.message);
        }
      );
    },

    //获取详情
    getDetails() {
      this.loadingTF = true;
      let params = {
        id: this.id
      };
      this.$api.findDetailsById(params).then(res => {
        this.loadingTF = false;
        if (res.data.escortUser) {
          res.data.newUserName = JSON.parse(res.data.escortUser).userNames;
        }
        this.detailsDataOne = [res.data];
        this.detailsData = res.data.storeList; //巡店计划内
        this.orderAllData = res.data;
        // console.log("计划详情", res.data);
      });
    },
    //确认
    confirmFun() {
      this.$confirm("请确认审批通过此单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            planId: this.id,
            status: 2
          };
          this.$api.updateAudit(params).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.getDetails();
              this.findFlowAuth();
              this.currUserIsAuth();
              this.$message({
                type: "success",
                message: res.message
              });
            } else {
              this.$message({
                type: "errror",
                message: res.message
              });
            }
          });
        })
        .catch(() => {});
    },
    backFun() {
      this.$prompt("请输入驳回原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "请输入驳回原因"
      })
        .then(({ value }) => {
          let params = {
            planId: this.id,
            status: 3,
            cause: value
          };
          this.$api.updateAudit(params).then(res => {
            if (res.code === 200) {
              this.getDetails();
              this.findFlowAuth(); //审核流程接口
              this.currUserIsAuth();
              this.$message({
                type: "success",
                message: res.message
              });
            } else {
              this.$message({
                type: "errror",
                message: res.message
              });
            }
          });
        })
        .catch(() => {});
    },
    //按钮权限
    currUserIsAuth() {
      let params = {
        planId: this.id
      };
      this.$api.currUserIsAuth(params).then(res => {
        this.btnAuth = res.data;
      });
    },
    //合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (
          column.label === "机票" ||
          column.label === "高铁" ||
          column.label === "其他交通费" ||
          column.label === "住宿" ||
          column.label === "餐补通讯费" ||
          column.label === "天数" ||
          column.label === "总预算"
        ) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value) && column.label !== "天数") {
                let res = (Number(prev) + Number(curr)).toFixed(2);
                return res;
              } else if (!isNaN(value) && column.label === "天数") {
                let res = Number(prev) + Number(curr);
                return res;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += "";
          } else {
            sums[index] = "";
          }
        }
      });
      return sums;
    }
  }
};
</script>


<style scoped lang="scss" >
.redColor {
  color: #9e0029;
}
.width520 {
  width: 520px;
}

.upperBlock {
  // display: flex;
  // justify-content: space-between;
  .leftTip {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(34, 36, 38, 1);
    cursor: pointer;
  }
}

.middleBlock {
}

.dialogWrap {
  .title {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(34, 36, 38, 1);
    margin-bottom: 13px;
  }
  .progressWrap {
    width: 50%;
  }

  .fileWrap {
    flex: 1;
    margin-bottom: 20px;
    .fileUL {
      // display: flex;
      // flex-wrap: wrap;
      margin-bottom: 24px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(34, 36, 38, 1);
      .redColor {
        cursor: pointer;
      }

      div {
        margin-right: 40px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>

