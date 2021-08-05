<template>
  <div v-loading="loadingDetail">
    <section class="upperBlock">
      <div>
        <span class="leftTip" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          巡店报告-{{titleFun()}}
        </span>
      </div>

      <div>
        <el-table :data="detailsDataOne" style="width: 100%;margin-top: 16px">
          <el-table-column label="巡店编号" prop="storeNum"></el-table-column>
          <el-table-column label="巡访客户" prop="storeName"></el-table-column>
          <el-table-column label="预定时间">
            <template slot-scope="scope">
              <span>{{scope.row.predictStartTime}} - {{scope.row.predictEndTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="机票" prop="ticketPrice"></el-table-column>
          <el-table-column label="高铁" prop="highSpeedFee"></el-table-column>
          <el-table-column label="其他交通费" prop="trafficPrice"></el-table-column>
          <el-table-column label="住宿" prop="putupPrice"></el-table-column>
          <el-table-column label="餐补通讯费" prop="mealPrice"></el-table-column>
          <el-table-column label="天数" prop="timeNum"></el-table-column>
          <el-table-column label="总预算" prop="totalPrice"></el-table-column>
          <el-table-column label="是否巡店" prop="isStoreStatus">
            <template slot-scope="scope">
              <span v-if="scope.row.isStoreStatus === 0">未到店</span>
              <span v-if="scope.row.isStoreStatus === 1" class="txtYellow">已到店</span>
            </template>
          </el-table-column>
          <el-table-column label="分数/满分">
            <template slot-scope="scope">
              <span>{{scope.row.score}}/{{scope.row.fullMark}}</span>
            </template>
          </el-table-column>
          <el-table-column label="回复状态" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.storeStatus === 0" style="color:#F20F34">待反馈</span>
              <span v-else-if="scope.row.storeStatus === 1" style="color:#F29924">待回复</span>
              <span v-else-if="scope.row.storeStatus === 2">已回复</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
    <div class="hr" />
    <section class="middleBlock" v-if="orderAllData.isStoreStatus === 0">
      <el-row>
        <el-col :span="24">报告详情-未到店</el-col>
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
          <div>{{shopPlanReport.userName || '-'}}</div>
          <div>{{shopPlanReport.newUserName || '-'}}</div>
          <div>
            <span
              v-if="shopPlanReport"
            >{{shopPlanReport.storeStartTime || '-'}}~{{shopPlanReport.storeEndTime || '-'}}</span>
            <span v-else>-</span>
          </div>
        </el-col>
        <span v-if="showTF">
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
                    <span style="margin-left: 40px;">{{ielem.content || '-'}}</span>
                  </el-col>
                </el-row>

                <div class="imgWrap" v-for="(two,twoNum) in ielem.img" :key="twoNum">
                  <el-image
                    v-if="two"
                    style="width: 160px; height: 120px"
                    :src="two"
                    :preview-src-list="ielem.img"
                  ></el-image>
                </div>
              </div>
            </el-col>
          </div>

          <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
            <div>周边市场情况</div>
          </el-col>
          <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
            <div>{{shopPlanReport.rimCondition || '-'}}</div>
          </el-col>

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
            <div>{{shopPlanReport.ageParagraph || '-'}}</div>
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
        </span>

        <el-col :span="4" :offset="2" class="txtRed txtOne txtRight txt14 cpointer txtBold">
          <div @click="showFun">{{!showTF?'展开全部报告':'收起报告'}}</div>
        </el-col>
      </el-row>
    </section>

    <section class="middleBlock" v-if="orderAllData.storeStatus !== 0">
      <div class="hr" />
      <el-row v-if="orderAllData.storeStatus === 1 || orderAllData.storeStatus === 2">
        <el-col :span="24" class="btnWrap">
          <span>客户反馈</span>
          <el-button
            type="primary"
            size="mini"
            @click="confirmFun"
            v-if="orderAllData.storeStatus === 1 && planReply"
          >确定回复</el-button>
        </el-col>
        <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
          <div>巡店天数</div>
          <div>服务人员态度</div>
          <div>服务人员专业度</div>
          <div>服务内容匹配度</div>
          <div>期待下一次到店</div>
        </el-col>
        <el-col :span="18" class="txtLeft txtBlack txtTwo txt14">
          <div>{{shopPlanFeedback.timeNum}}天</div>
          <div style="padding-top:10px">
            <el-rate
              v-model="shopPlanFeedback.serviceStaffSatisfaction"
              disabled
              text-color="#9e0029"
              :colors="colors"
            ></el-rate>
          </div>
          <div style="padding-top:20px">
            <el-rate
              v-model="shopPlanFeedback.serviceStaffMajor"
              disabled
              text-color="#9e0029"
              :colors="colors"
            ></el-rate>
          </div>
          <div style="padding-top:20px">
            <el-rate
              v-model="shopPlanFeedback.serviceContentSuited"
              disabled
              text-color="#9e0029"
              :colors="colors"
            ></el-rate>
          </div>
          <div style="padding-top:20px">
            <el-rate
              v-model="shopPlanFeedback.hopefulNext"
              disabled
              text-color="#9e0029"
              :colors="colors"
            ></el-rate>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <span v-if="shopPlanFeedback.evaluate != null && shopPlanFeedback.evaluate != ''">
          <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
            <div>其他建议</div>
          </el-col>
          <el-col :span="14" class="txtLeft txtRed txtTwo txt14">
            <div>{{shopPlanFeedback.evaluate}}</div>
          </el-col>
          <el-col :span="4" class="txtLeft txtRed txtTwo txt14">
            <div></div>
          </el-col>
        </span>

        <!-- 查看 -->
        <span v-if="orderAllData.storeStatus === 2 && orderAllData.planReply != null">
          <el-col :span="24" class="mtop50">回复反馈</el-col>
          <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
            <div>回复内容</div>
          </el-col>
          <el-col :span="14" class="txtLeft txtRed txtTwo txt14">
            <div class="replyContentStyle">{{orderAllData.planReply.content}}</div>
          </el-col>
        </span>

        <!-- 编辑 -->
        <span v-if="orderAllData.storeStatus === 1 && planReply">
          <el-col :span="24" class="mtop50">回复反馈</el-col>
          <el-col :span="4" :offset="2" class="txtRight txtHui txtOne txt14">
            <div>回复内容</div>
          </el-col>
          <el-col :span="14" class="txtLeft txtRed txtTwo txt14">
            <div>
              <el-input
                type="textarea"
                placeholder="请输入回复内容"
                v-model="textarea"
                maxlength="800"
                show-word-limit
                :rows="7"
              ></el-input>
            </div>
          </el-col>
        </span>
      </el-row>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingDetail: false,
      selectData: [], //选中的数据
      btnloading: false,
      file: "",
      searchValue: "",
      planId: "",
      storeId: "",
      dialogFormVisible: false,
      detailsDataOne: [], //详情数据
      detailsData: [{}, {}, {}, {}], //详情数据
      orderAllData: {}, //巡店全部内容
      shopPlanReport: {
        newUserName: ""
      }, //报告信息
      reportContentDataList: [], //报告内容
      reportList: [
        { type: 1, name: "店铺形象", list: [] },
        { type: 2, name: "商品陈列", list: [] },
        { type: 3, name: "员工仪容", list: [] },
        { type: 4, name: "软件服务", list: [] }
      ],
      value: 1,
      textarea: "",
      shopPlan: {}, //巡店内容
      shopPlanFeedback: {}, //反馈内容
      colors: ["#9e0029", "#9e0029", "#9e0029"],
      showTF: false,
      planReply: false
    };
  },
  created() {
    this.planId = this.$route.query.planId;
    this.storeId = this.$route.query.storeId;
    if (this.planId && this.storeId) {
      this.getDetails();
    }
    this.getAuth(); //权限判断
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    getAuth() {
      // console.log(localStorage.authTxt)
      let authObj = JSON.parse(sessionStorage.verify);
      this.planReply = false;
      authObj.forEach(ielem => {
        if (ielem === "plan:reply") {
          this.planReply = true;
        }
      });
    },
    showFun() {
      this.showTF = !this.showTF;
    },
    //获取详情
    getDetails() {
      let params = {
        planId: this.planId,
        storeId: this.storeId
      };
      this.loadingDetail = true;
      this.$api.findStoreDetails(params).then(res => {
        this.detailsDataOne = [res.data];
        this.shopPlan = res.data.shopPlan ? res.data.shopPlan : {};
        this.shopPlanFeedback = res.data.shopPlanFeedback
          ? res.data.shopPlanFeedback
          : {};
        this.orderAllData = res.data;

        this.shopPlanReport = res.data.reportDetailsVo;

        if (this.shopPlanReport != null && this.shopPlanReport.esUserName) {
          this.shopPlanReport.newUserName = JSON.parse(
            this.shopPlanReport.esUserName
          ).userNames;
        }

        if (this.shopPlan != null && this.shopPlan.escortUser) {
          this.shopPlan.newUserName = JSON.parse(
            this.shopPlan.escortUser
          ).userNames;
          // console.log("进来123123", this.shopPlan);
        }

        if (
          this.shopPlanReport != null &&
          this.orderAllData.isStoreStatus === 1
        ) {
          this.reportDataList = this.shopPlanReport.reportDataList;
          this.reportDataList.forEach(item => {
            item.datalist.forEach(one => {
              one.img = one.img.split(",");
            });
          });
        }

        this.loadingDetail = false;
      });
    },

    //确认
    confirmFun() {
      this.textarea = this.$tools.goEmpty(this.textarea);
      if (this.textarea.length === 0) {
        this.$message.error("回复内容不能为空，请重新输入提交！");
        return;
      }
      this.$confirm("请确认回复此单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            planId: this.planId,
            storeId: this.storeId,
            replyContent: this.textarea //回复内容
          };

          this.$api.shopReply(params).then(res => {
            // this.getDetails();
            this.$router.push("shopReplyManage");
            this.$message({
              type: "success",
              message: "回复此单成功，正在刷新页面!"
            });
          });
        })
        .catch(() => {});
    },
    titleFun() {
      if (this.orderAllData.storeStatus === 0) {
        return "待反馈";
      } else if (this.orderAllData.storeStatus === 1) {
        return "待回复";
      } else if (this.orderAllData.storeStatus === 2) {
        return "已回复";
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

.replyContentStyle {
  font-size: 14px;
  font-weight: 400;
  color: rgba(46, 48, 51, 1);
}

.btnWrap {
  display: flex;
  justify-content: space-between;
}

.imgWrap {
  display: inline-block;
  margin-right: 16px;
}

.fullMark {
  color: #9e0029;
  // display: inline-block;
  // margin-right: 30px;
  position: absolute;
  top: 0px;
  left: -35px;
}
</style>

