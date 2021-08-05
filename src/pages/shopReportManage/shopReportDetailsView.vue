<template>
  <div v-loading="loadingTF">
    <section class="upperBlock">
      <div>
        <span class="leftTip" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          报告详情-{{titleFun()}}
        </span>
      </div>

      <div>
        <el-table :data="detailsDataOne" style="width: 100%;margin-top: 16px">
          <el-table-column prop="storeNum" label="巡店编号"></el-table-column>
          <el-table-column prop="storeName" label="巡店客户"></el-table-column>
          <el-table-column label="预定时间">
            <template slot-scope="scope">
              <span
                v-if="scope.row.predictStartTime != null"
                class="txtRed"
              >{{scope.row.predictStartTime}}--{{scope.row.predictEndTime}}</span>
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
              <span v-else>---</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
    <div class="hr" />
    <section class="middleBlock" v-if="orderAllData.isStoreStatus === 0">
      <el-row>
        <el-col :span="24">报告详情</el-col>
        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>主访人</div>
          <div>陪同人员</div>
          <div>未到店原因</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlan.planUserName || '-'}}</div>
          <div>{{shopPlan.newUserName || '-'}}</div>
          <div class="txtRed">{{orderAllData.noStoreCause || '-'}}</div>
        </el-col>
      </el-row>
    </section>

    <section class="middleBlock" v-if="orderAllData.isStoreStatus === 1">
      <el-row>
        <el-col :span="24">报告详情</el-col>
        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>主访人</div>
          <div>陪同人员</div>
          <div>到店时间</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlan.planUserName || '-'}}</div>
          <div>{{shopPlan.newUserName || '-'}}</div>
          <div>{{shopPlanReport.storeStartTime || '-'}}~{{shopPlanReport.storeEndTime || '-'}}</div>
        </el-col>

        <div v-for="item in reportDataList" :key="item.type">
          <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
            <div>
              <div>{{item.name}}</div>
              <div style="color:#9e0029">
                ({{item.score}}/
                <span style="color:#8A9199">{{item.fullMark}})分</span>
              </div>
            </div>
          </el-col>
          <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
            <div v-for="(ielem,inOne) in item.datalist" :key="inOne">
              <el-row>
                <el-col :span="3" style="padding-top:10px">
                  <el-rate v-model="ielem.result" disabled text-color="#9e0029" :colors="colors"></el-rate>
                </el-col>
                <el-col :span="21" style="position: relative;">
                  <span class="fullMark">{{ielem.fullMark}}分</span>
                  <span style="margin-left: 40px;">{{ielem.content}}</span>
                </el-col>
              </el-row>
              <!-- <div v-if="ielem.commentType === 2 || ielem.commentType === 3">
                <span :class="ielem.reportResult === '2'?'txtRed':''">
                  {{ielem.reportResult === '2'?'【否】':'【是】'}}
                  <span class="left5">{{ielem.content}}</span>
                </span>
              </div>-->
              <div class="imgWrap" v-for="(two,twoNum) in ielem.img" :key="twoNum">
                <el-image
                  v-if="two"
                  style="width: 160px; height: 120px"
                  :src="two"
                  :preview-src-list="ielem.img"
                ></el-image>
              </div>
            </div>
            <!-- <div>--</div> -->
          </el-col>
        </div>

        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>周边市场情况</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlanReport.rimCondition || '-'}}</div>
        </el-col>

        <!-- <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">

          <div>店铺需要哪些支持</div>
          <div>提升建议</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">

         
          <div>{{shopPlanReport.needSupport || '-'}}</div>
          <div>{{shopPlanReport.liftSuggest || '-'}}</div>
        </el-col>-->

        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>培训内容</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlanReport.trainContent || '-'}}</div>
        </el-col>

        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>参与培训人员</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlanReport.trainNum || '-'}}人</div>
        </el-col>

        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>店铺人流量</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlanReport.storeFlux || '-'}}人次</div>
        </el-col>

        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>主要消费年龄段</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlanReport.ageParagraph || '-'}}岁</div>
        </el-col>

        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>营销活动内容</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlanReport.marketing || '-'}}</div>
        </el-col>

        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>产出金额</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>￥{{shopPlanReport.outputMoney || '-'}}</div>
        </el-col>

        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>店铺需要哪些支持</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlanReport.needSupport || '-'}}</div>
        </el-col>

        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>提升建议</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlanReport.liftSuggest || '-'}}</div>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reportDataList: [], //巡店报告动态数据
      selectData: [], //选中的数据
      btnloading: false,
      file: "",
      search: "",
      searchValue: "",
      planId: "",
      storeId: "",
      dialogFormVisible: false,
      detailsDataOne: [], //详情数据
      detailsData: [], //详情数据
      orderAllData: {}, //巡店全部内容
      shopPlanReport: {}, //报告信息
      reportContentDataList: [], //报告内容
      reportList: [
        { type: 1, name: "店铺形象", list: [] },
        { type: 2, name: "商品陈列", list: [] },
        { type: 3, name: "员工仪容", list: [] },
        { type: 4, name: "软件服务", list: [] }
      ],
      value: 3,
      shopPlan: {}, //巡店内容
      colors: ["#9e0029", "#9e0029", "#9e0029"],
      loadingTF: false
    };
  },
  created() {
    this.planId = this.$route.query.planId;
    this.storeId = this.$route.query.storeId;
    if (this.planId && this.storeId) {
      this.getDetails();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    //获取详情
    getDetails() {
      this.loadingTF = true;
      let params = {
        planId: this.planId,
        storeId: this.storeId
      };
      this.$api.findReportDetails(params).then(res => {
        this.loadingTF = false;
        this.detailsDataOne = [res.data];
        this.shopPlan = res.data.shopPlan ? res.data.shopPlan : {};

        if (this.shopPlan.escortUser) {
          this.shopPlan.newUserName = JSON.parse(
            this.shopPlan.escortUser
          ).userNames;
        }
        this.orderAllData = res.data;
        this.shopPlanReport = res.data.reportDetailsVo;

        if (this.shopPlanReport != null && this.shopPlanReport.escortUser) {
          this.shopPlanReport.newUserName = JSON.parse(
            this.shopPlanReport.escortUser
          ).userNames;
        }

        if (this.orderAllData.isStoreStatus === 1) {
          this.reportDataList = this.shopPlanReport.reportDataList;
          this.reportDataList.forEach(item => {
            item.datalist.forEach(one => {
              one.img = one.img.split(",");
            });
          });
        }

        // this.reportContentDataList = res.data.reportContentDataList;
        // this.reportContentDataList.forEach(ielem => {
        //   this.reportList.forEach(jelem => {
        //     if (ielem.type === jelem.type) {
        //       jelem.list.push(ielem);
        //     }
        //   });
        // });
      });
    },
    titleFun() {
      if (this.orderAllData.reportStatus === 0) {
        return "待报告";
      } else if (this.orderAllData.reportStatus === 1) {
        return "待提交";
      } else if (this.orderAllData.reportStatus === 2) {
        return "已报告";
      }
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
  line-height: 40px;
  .txtOne {
    padding-right: 48px;
  }
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

.imgWrap {
  display: inline-block;
  margin-right: 16px;
}

.fullMark {
  color: #9e0029;
  position: absolute;
  top: 0px;
  left: -35px;
}
</style>

