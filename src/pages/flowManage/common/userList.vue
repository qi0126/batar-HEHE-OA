<template>
  <div>
    <div style="max-height:570px;overflow-y: auto;line-height:30px; margin-top:30px;">
      <div v-show="companyAllDataTF">
        <!-- <el-checkbox-group v-model="checkedDepart">
              <el-checkbox :label="items.deptName" :key="items.deptId" @change="handleCheckAllChange(items.members,items.deptId)" ref="deptId">{{items.deptName}}</el-checkbox>
        </el-checkbox-group>-->
        <el-checkbox-group v-model="authUsers">
          <el-row>
            <el-col :span="6" v-for="item in userVoList" :key="item.userId">
              <el-checkbox
                :label="item.userId"
                class="width25"
                v-if="!item.positionTF"
                :disabled="item.editTF"
                @change="changeUserFun"
              >
                {{item.concat}}
                <span v-if="item.editTF"></span>
              </el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userData: {
      type: Object,
      required: false
    },
    nodePersonData: {
      type: Array,
      required: false
    },
    checkedList: {
      type: Array,
      required: false
    },
    authUsersID: {
      type: Array,
      required: false
    },
    itemStamp: {}
  },
  data() {
    return {
      userVoList: this.userData.userVoList,
      authUsers: this.authUsersID,
      checkedDepart: [], //公司选择数组
      selectedTabId: "", //选中选项卡的id
      selectedPointName: { name: "", pointId: "" }, //选中节点类型名称
      companyAllDataTF: true,
      checkAll: false,
      checkedCities: []
    };
  },

  watch: {
    itemStamp: {
      handler(nv, ov) {
        this.authUsers = this.authUsersID;
        this.userVoList = this.userData.userVoList;
      },
      deep: true
    }
  },

  created() {
    // console.log("aa:",this.userData,this.checkedCities)
  },
  mounted() {},
  methods: {
    //选择节点多选事件开始
    // handleCheckAllChange(allData, subElem) {
    //   var self = this;
    //   setTimeout(function() {
    //     self.$refs.deptId.forEach((elem, index) => {
    //       if (elem.$vnode.data.key == subElem) {
    //         if (elem.isChecked) {
    //           allData.forEach(smElem => {
    //             if(smElem.editTF != true){
    //               self.checkedCities.push(smElem.userId);
    //             }
    //           });
    //           self.checkedCities = self.$tools.listUnique(self.checkedCities);
    //         } else {
    //           var newList = self.checkedCities;
    //           allData.forEach(smElem => {
    //             newList.forEach((sbElem, sbind) => {
    //               if (sbElem == smElem.userId) {
    //                 newList.splice(sbind, 1);
    //               }
    //             });
    //           });
    //         }
    //       }
    //     });
    //   }, 100);
    // },
    //选择节点多选事件结束
    changeUserFun() {
      this.$forceUpdate();
      let auditorName = [];

      this.authUsers.forEach(item => {
        this.nodePersonData.forEach(one => {
          if (item == one.userId) {
            auditorName.push(one.concat);
          }
        });
      });

      let params = {
        id: this.authUsers,
        name: auditorName
      };
      this.$emit("checkedFn", params);
    }
  }
};
</script>

<style scoped lang="scss">
.width25 {
  width: 18%;
  padding-left: 15px;
}
</style>
