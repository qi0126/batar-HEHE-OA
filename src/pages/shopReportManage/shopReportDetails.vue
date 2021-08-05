<template>
  <div v-loading="loadingTF">
    <section class="upperBlock">
      <div>
        <span class="leftTip" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          报告详情
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
              <span>{{scope.row.escortUser.userNames || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系人" prop="phone"></el-table-column>
          <el-table-column label="创建人" prop="creator"></el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.reportStatus === 0" class="txtYellow">待报告</span>
              <span v-else-if="scope.row.reportStatus === 1">已报告</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="txtHui txt14 top10" v-if="orderAllData.content">
          巡店内容：
          <span class="txtBlack" style="line-height: 22px;">{{orderAllData.content}}</span>
        </div>
      </div>
    </section>
    <div class="hr" />
    <section class="middleBlock">
      <el-row>
        <el-col :span="24">计划内</el-col>
      </el-row>

      <el-table
        :data="storeList"
        style="width: 100%;margin-top: 16px"
        @row-dblclick="goDetail"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="storeNum" label="巡店编号"></el-table-column>
        <el-table-column prop="storeName" label="巡店客户"></el-table-column>
        <el-table-column prop="predictTime" label="预定时间">
          <template slot-scope="scope">
            <span>{{scope.row.predictStartTime}}~{{scope.row.predictEndTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ticketPrice" label="机票"></el-table-column>
        <el-table-column prop="highSpeedFee" label="高铁"></el-table-column>
        <el-table-column prop="trafficPrice" label="其他交通费"></el-table-column>
        <el-table-column prop="putupPrice" label="住宿"></el-table-column>
        <el-table-column prop="mealPrice" label="餐补通讯费"></el-table-column>
        <el-table-column prop="timeNum" label="天数"></el-table-column>
        <el-table-column prop="totalPrice" label="总预算"></el-table-column>
        <el-table-column label="人数">
          <template slot-scope="scope">
            <span>{{scope.row.peopleNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否巡店">
          <template slot-scope="scope">
            <span v-if="scope.row.isStoreStatus === 0" class="txtRed">未到店</span>
            <span v-if="scope.row.isStoreStatus === 1">已到店</span>
          </template>
        </el-table-column>
        <el-table-column label="分数/满分">
          <template slot-scope="scope">
            <span
              v-if="scope.row.score != null && scope.row.fullMark != null"
            >{{scope.row.score}}/{{scope.row.fullMark}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.reportStatus === 0" class="txtRed">待报告</span>
            <span v-else-if="scope.row.reportStatus === 1" class="txtYellow">待提交</span>
            <span v-else-if="scope.row.reportStatus === 2">已报告</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <div class="hr" />
    <section class="middleBlock">
      <el-row>
        <el-col :span="24">计划外</el-col>
      </el-row>

      <el-table
        :data="storeListOut"
        style="width: 100%;margin-top: 16px"
        @row-dblclick="goDetail"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="storeNum" label="巡店编号"></el-table-column>
        <el-table-column prop="storeName" label="巡店客户"></el-table-column>
        <el-table-column prop="predictTime" label="预定时间">
          <template slot-scope="scope">
            <span>{{scope.row.predictStartTime}}~{{scope.row.predictEndTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ticketPrice" label="机票">
          <template slot-scope="scope">
            <span v-if="scope.row.ticketPrice">{{scope.row.ticketPrice}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="highSpeedFee" label="高铁">
          <template slot-scope="scope">
            <span v-if="scope.row.highSpeedFee">{{scope.row.highSpeedFee}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="trafficPrice" label="其他交通费">
          <template slot-scope="scope">
            <span v-if="scope.row.trafficPrice">{{scope.row.trafficPrice}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="putupPrice" label="住宿">
          <template slot-scope="scope">
            <span v-if="scope.row.putupPrice">{{scope.row.putupPrice}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="mealPrice" label="餐补通讯费">
          <template slot-scope="scope">
            <span v-if="scope.row.mealPrice">{{scope.row.mealPrice}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="timeNum" label="天数">
          <template slot-scope="scope">
            <span v-if="scope.row.timeNum">{{scope.row.timeNum}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="总预算">
          <template slot-scope="scope">
            <span v-if="scope.row.totalPrice">{{scope.row.totalPrice}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="人数">
          <template slot-scope="scope">
            <span v-if="scope.row.peopleNum">{{scope.row.peopleNum}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="是否巡店">
          <template slot-scope="scope">
            <span v-if="scope.row.isStoreStatus === 0" class="txtRed">未到店</span>
            <span v-if="scope.row.isStoreStatus === 1">已到店</span>
          </template>
        </el-table-column>
        <el-table-column label="分数/满分">
          <template slot-scope="scope">
            <span
              v-if="scope.row.score != null && scope.row.fullMark != null"
            >{{scope.row.score}}/{{scope.row.fullMark}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="examNumber" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.reportStatus === 0" class="txtRed">待报告</span>
            <span v-else-if="scope.row.reportStatus === 1" class="txtYellow">待提交</span>
            <span v-else-if="scope.row.reportStatus === 2">已报告</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      detailsDataOne: [
        {
          escortUser: {
            userNames: ""
          }
        }
      ], //详情数据
      storeList: [], //计划内内容
      storeListOut: [], //计划外内容
      orderAllData: {},
      loadingTF: false
    };
  },
  created() {
    this.id = this.$route.query.id;
    if (this.id) {
      this.getDetails();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goDetail(elem) {
      if (elem.reportStatus === 2) {
        this.$router.push({
          path: "shopReportDetailsView",
          query: { planId: elem.planId, storeId: elem.storeId }
        });
      }
    },
    //获取详情
    getDetails() {
      this.loadingTF = true;
      let params = {
        id: this.id
      };
      this.$api.findAllReportDetails(params).then(res => {
        this.loadingTF = false;
        res.data.escortUser = res.data.escortUser
          ? JSON.parse(res.data.escortUser)
          : "-";
        this.detailsDataOne = [res.data];
        this.orderAllData = res.data;
        this.storeList = res.data.storeList;
        this.storeListOut = res.data.storeListOut;
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
              if (!isNaN(value)) {
                let res = "";
                if (column.label === "天数") {
                  res = (Number(prev) + Number(curr)).toFixed(0);
                } else {
                  res = (Number(prev) + Number(curr)).toFixed(2);
                }

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

