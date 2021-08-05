<template>
  <div class="setWrap" v-loading="loadingList">
    <header>
      <div class="headerWrap">
        <div class="header">巡店报告设置</div>
        <el-button type="primary" size="small" plain @click="addBigTitle"  v-if="reportDataEdit">新增大标题</el-button>
      </div>
      <div class="line"></div>
    </header>

    <ul v-if="listData.length > 0">
      <li v-for="(item,index) in listData" :key="`a${index}`">
        <div class="titleWrap">
          <div class="bigTitleWrap">
            <!-- {{item.typeName}} -->
            <el-input
              v-model="item.name"
              placeholder="请输入标题"
              size="small"
              style="width:220px;font-weight: bold;font-size:14px"
              class="title"
              maxlength="10"
              show-word-limit
              @blur="goEmpty(item,'name')"
            ></el-input>

            <div class="statusWrap">
              <el-radio-group v-model="item.status">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </div>

            <div class="isButton">
              <div class="isButtonTitle">是否需要开启编辑：</div>
              <el-radio-group v-model="item.isButton" @change="selectEdit(item)">
                <el-radio :label="0">关闭</el-radio>
                <el-radio :label="1">开启</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div>
            <el-button
              type="warning"
              size="small"
              v-if="item.dataId == null && reportDataEdit"
              @click="deleFun(index)"
            >删除</el-button>
            <!-- <el-button type="primary" size="small" plain @click="addFun(index,item)">新增</el-button> -->
            <el-button type="primary" size="small" @click="saveFun(index)" :loading="loadingBtn" v-if="reportDataEdit">保存</el-button>
          </div>
        </div>
        <div class="topTitle">
          <div class="item1">标题</div>
          <div class="item2">分值/星</div>
          <div class="item3">是否需要上传图片</div>
          <div class="item4">是否启用</div>
        </div>

        <section
          class="contUL"
          v-for="(one,indexTwo) in item.reportContentData"
          :key="`b${indexTwo}`"
        >
          <div class="item1">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入标题"
              v-model="one.content"
              maxlength="100"
              show-word-limit
              style="width:80%"
              @blur="goEmpty(one,'content')"
            ></el-input>
          </div>
          <div class="item2">
            <!-- <el-radio-group v-model="one.commentType" :disabled="item.isTrue === 0">
              <el-radio :label="1">评分</el-radio>
              <el-radio :label="2">是否</el-radio>
              <el-radio :label="3">开关</el-radio>
            </el-radio-group>-->
            <el-input
              v-model="one.score"
              placeholder="分值必须大于0"
              size="small"
              style="width:120px"
              maxlength="3"
              @blur="scoreFun(one)"
            ></el-input>
          </div>
          <div class="item3">
            <el-checkbox v-model="one.isNeedImg" :disabled="one.imgDisabled">图片上传</el-checkbox>
          </div>
          <div class="item4">
            <el-radio-group v-model="one.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>

            <i
              class="el-icon-close closeStyle"
              v-if="one.id == null"
              @click="delFun(index,indexTwo)"
            ></i>
          </div>
        </section>

        <i class="el-icon-plus addChild" @click="addFun(index,item)" v-if="reportDataEdit">新增子标题</i>
      </li>
    </ul>
    <NoDataPage v-else></NoDataPage>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingBtn: false,
      loadingList: false,
      listData: [], //巡店数据
      mock: "",
      reportDataEdit:false
    };
  },
  created() {
    this.getReportData();
    this.getAuth();//权限判断
  },
  methods: {
    //权限判断
   getAuth(){
      let authObj = JSON.parse(sessionStorage.verify)
      this.reportDataEdit = false
      authObj.forEach(ielem=>{
        if(ielem === 'reportData:edit'){
          this.reportDataEdit = true
        }
      })
    },
    //获取巡店数据
    getReportData() {
      this.loadingList = true;
      this.$api.getReportData().then(
        res => {
          if (res.data) {
            this.listData = res.data;
            this.listData.forEach(item => {
              if (item.reportContentData.length > 0) {
                item.reportContentData.forEach(one => {
                  one.isNeedImg = !!one.isNeedImg;
                  one.imgDisabled = false;
                  if (item.isButton === 1) {
                    one.imgDisabled = true;
                  }
                });
              }
            });
          } else {
            this.listData = [];
          }
          this.loadingList = false;
        },
        err => {
          this.listData = [];
          this.loadingList = false;
        }
      );
    },
    //去空
    goEmpty(item, name) {
      item[name] = this.$tools.goEmpty(item[name]);
    },
    //分值校验
    scoreFun(item) {
      let score = String(item.score);
      let scoreData = this.$tools.goEmpty(score);
      let result = isNaN(scoreData);
      let result2 = Number(scoreData) <= 0;
      if (result || result2) {
        this.$message.warning("请输入正确的数字！");
        item.score = "";
        return;
      } else {
        item.score = scoreData;
      }
    },
    //新增
    addFun(index, item) {
      this.listData[index].reportContentData.push({
        content: "",
        isNeedImg: false,
        status: 0,
        score: "",
        imgDisabled: item.isButton === 0 ? false : true
      });
    },
    //保存
    saveFun(index) {
      let dataBoList = this.listData[index];

      if (dataBoList.name == "") {
        this.$message.warning("请填写大标题名称再保存！");
        return;
      }

      if (dataBoList.reportContentData.length > 0) {
        let result = dataBoList.reportContentData.some(item => {
          return item.content === "" || item.score === "";
        });
        if (result) {
          this.$message.warning("请填写子标题、分值再保存！");
          return;
        }
      }

      let params = JSON.parse(JSON.stringify(dataBoList));

      params.editData = params.reportContentData;
      delete params.reportContentData;

      this.loadingBtn = true;
      this.$api.saveReportData(params).then(
        res => {
          this.$message.success(res.message);
          this.loadingBtn = false;
          this.getReportData();
        },
        err => {
          this.$message.error(err.message);
          this.loadingBtn = false;
        }
      );
    },
    //删除
    delFun(index, indexTwo) {
      this.listData[index].reportContentData.splice(indexTwo, 1);
    },
    //新增大标题
    addBigTitle() {
      let newData = {
        name: "",
        status: 0,
        isButton: 0,
        reportContentData: []
      };
      this.listData.unshift(newData);
    },
    //删除大标题
    deleFun(index) {
      this.listData.splice(index, 1);
    },
    //选择编辑选项
    selectEdit(item) {
      if (item.reportContentData.length > 0) {
        let result = item.reportContentData.some(it => {
          return it.isNeedImg === true;
        });

        if (result) {
          item.isButton = 0;
          this.$message.warning(
            "小标题中存在图片上传，需要放弃图片上传功能才能开启"
          );
        }

        item.reportContentData.forEach(it => {
          if (item.isButton === 0) {
            it.imgDisabled = false;
          } else {
            it.imgDisabled = true;
          }
        });
      }

      this.$forceUpdate();
    }
  }
};
</script>


<style scoped lang="scss" >
.line {
  width: 100%;
  border-top: 1px solid rgba(218, 221, 229, 1);
  margin-top: 15px;
  margin-bottom: 8px;
}

.setWrap {
  font-family: Microsoft YaHei;
  .headerWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header {
      font-size: 16px;
      font-weight: bold;
    }
  }

  ul {
    padding-top: 40px;
    li {
      margin-bottom: 90px;
      .titleWrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // .title {
        //   font-size: 14px;
        //   font-weight: bold;
        //   color: rgba(46, 48, 51, 1);
        // }
        .bigTitleWrap {
          display: flex;
          align-items: center;
          .title {
          }
          .statusWrap {
            margin-left: 10px;
          }
          .isButton {
            margin-left: 456px;
            display: flex;
            align-items: center;
            .isButtonTitle {
              font-size: 12px;
              color: #606266;
            }
          }
        }
      }

      .topTitle {
        display: flex;
        border-bottom: 1px solid #e4e7f0;
        margin-top: 20px;
        padding-bottom: 10px;
        color: #8a8e99;
        font-size: 14px;

        .item1 {
          flex: 6;
        }
        .item2 {
          flex: 2;
        }
        .item3 {
          flex: 2;
        }
        .item4 {
          flex: 2;
        }
      }
      .contUL {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e4e7f0;
        margin-top: 20px;
        padding-bottom: 10px;

        .item1 {
          flex: 6;
        }
        .item2 {
          flex: 2;
        }
        .item3 {
          flex: 2;
        }
        .item4 {
          flex: 2;
        }
      }
    }
  }

  .closeStyle {
    color: #9e0029;
    cursor: pointer;
    margin-left: 60px;
  }

  .addChild {
    cursor: pointer;
    color: #9e0029;
    margin-top: 10px;
    font-size: 12px;
  }
}
</style>


<style>
.setWrap .bigTitleWrap .el-input__inner {
  font-weight: bold;
  font-size: 14px;
}
</style>

