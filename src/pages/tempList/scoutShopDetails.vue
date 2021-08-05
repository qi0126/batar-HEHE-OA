<template>
  <div>
    <section class="upperBlock">
      <div>
        <span class="leftTip" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          详情 | {{name}} ｜ 巡店计划详情
        </span>
      </div>
      <div>
        <el-button type="primary" size="small" plain @click="replaceDataFun">替换数据</el-button>
        <el-button type="primary" size="small" @click="exportFun">导出</el-button>
      </div>
    </section>
    <section class="middleBlock">
      <el-input
        placeholder="请输入内容"
        style="width:250px"
        size="small"
        v-model="searchValue"
        @keydown.enter.native="selectFun('searchValue')"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <el-table
        :data="detailsData"
        style="width: 100%;margin-top: 16px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="报考人员信息" header-align="center" align="center">
          <el-table-column type="selection" width="45" header-align="center" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>
          <el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
          <el-table-column prop="idCard" label="身份证号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="phone" label="联系电话" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="考试信息" header-align="center" align="center">
          <el-table-column prop="certName" label="考试职业(工种)" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="certGrade"
            label="考试职业技能等级"
            header-align="center"
            align="center"
            width="150"
          ></el-table-column>
          <el-table-column prop="examTime" label="考试时间" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="考核结果" header-align="center" align="center">
          <el-table-column prop="achieveResult" label="业绩考核结果" header-align="center" align="center"></el-table-column>
          <el-table-column prop="theoryResult" label="理论考核结果" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="practicalResult"
            label="实操考核结果"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column prop="wholeResult" label="整体考核结果" header-align="center" align="center"></el-table-column>
        </el-table-column>
        <el-table-column label="报考结果" header-align="center" align="center">
          <el-table-column prop="examNumber" label="准考证号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="examResult" label="报考结果" header-align="center" align="center"></el-table-column>
          <el-table-column prop="reason" label="未通过原因" header-align="center" align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </section>

    <div class="elPageWrap">
      <el-pagination
        :current-page.sync="pageCurrent"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[12, 30, 50, 100]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>
    <!-- 弹框 -->
    <el-dialog
      width="480px"
      title="替换报考与成绩管理报表"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
    >
      <section class="dialogWrap">
        <div class="title">上传模板文件</div>
        <!-- <div>
          <div>
            PPT产品介绍(25.5K)
            <span class="redColor">替换</span>
          </div>
          <div class="progressWrap">
            <el-progress :percentage="50"></el-progress>
          </div>
        </div>-->

        <!-- <div>
          <el-button type="primary" plain size="small">上传附件数据</el-button>
        </div>-->

        <div class="fileWrap">
          <div class="fileUL" v-if="file !== ''">
            <div>
              {{file.name}}
              <span class="redColor" @click="deleteFun">删除</span>
              <span class="redColor" @click="replaceFun">替换</span>
            </div>
          </div>

          <label for="fileDom" class="global-el-btn" v-else>上传附件</label>
          <input
            type="file"
            ref="fileDom"
            id="fileDom"
            @change="uploadFun"
            v-show="false"
            accept=".xls, .xlsx"
          />
        </div>
        <div style="color: #9e0029;">提示：替换数据会对之前的数据进行替换和更新，请确认后操作</div>
      </section>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogFormVisible = false" plain>取 消</el-button>
        <el-button size="small" type="primary" @click="confirmFun" :loading="btnloading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectData: [], //选中的数据
      btnloading: false,
      file: "",
      searchValue: "",
      id: "",
      name: "",
      dialogFormVisible: false,
      detailsData: [], //详情数据
      pageCurrent: 1,
      pageSize: 12,
      total: 0
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.name = this.$route.query.name;
    if (this.id) {
      this.getDetails();
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    //替换
    replaceDataFun() {
      this.dialogFormVisible = true;
      this.file = "";
      if (this.$refs.fileDom != null) {
        this.$refs.fileDom.value = "";
      }
    },
    //获取详情
    getDetails() {
      let params = {
        pageNum: this.pageCurrent,
        pageSize: this.pageSize,
        examResultsId: this.id,
        condition: this.searchValue
      };
      this.$api.getExamResultsExamineesListPage(params).then(res => {
        this.detailsData = res.data.pageInfo.list;
        this.total = res.data.pageInfo.total;
      });
    },
    //选择证书
    selectFun(name) {
      if ((name = "searchValue")) {
        this.goEmpty(name);
      }
      this.getDetails();
    },
    //去空
    goEmpty(name) {
      this[name] = this.$tools.goEmpty(this[name]);
    },
    //分页事件开始
    handleSizeChange(val) {
      this.pageCurrent = 1;
      this.pageSize = val;
      this.getDetails();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getDetails();
    },
    //上传
    uploadFun(e) {
      if (e.target.files[0] == null) {
        return;
      }
      this.file = e.target.files[0];
      this.$refs.fileDom.value = "";
    },
    //删除
    deleteFun() {
      this.file = "";
    },
    //替换
    replaceFun() {
      this.$refs.fileDom.click();
    },
    //确认
    confirmFun() {
      if (this.file === "") {
        this.$message.warning("请上传附件！");
        return;
      }
      let params = {
        id: this.id,
        file: this.file
      };

      this.btnloading = true;
      this.$api.updateExamResultsExaminees(params).then(
        res => {
          this.$message.success(res.msg);
          this.dialogFormVisible = false;
          this.btnloading = false;
          this.getDetails();
        },
        err => {
          this.btnloading = false;
        }
      );
    },
    handleSelectionChange(val) {
      this.selectData = val;
    },
    exportFun() {
      if (this.selectData.length === 0) {
        window.location.href = `${this.$GlobalApiHost}/results/getExamResultsExamineesListExport?examResultsId=${this.id}`;
      } else {
        let idStr = [];
        this.selectData.forEach(item => {
          idStr.push(item.id);
        });
        window.location.href = `${
          this.$GlobalApiHost
        }/results/getExamResultsExamineesListExport?examResultsId=${
          this.id
        }&pageNum=${this.pageCurrent}&pageSize=${this.pageSize}&condition=${
          this.searchValue
        }&idStr=${idStr.join()}`;
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
  display: flex;
  justify-content: space-between;
  .leftTip {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(34, 36, 38, 1);
    cursor: pointer;
  }
}

.middleBlock {
  margin-top: 50px;
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

