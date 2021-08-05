<template>
  <div class="index">
    <div class="headerWrapper">
      <div class="headerLeft">
        <span class="title">百泰OA管理系统</span>
        <el-menu
          :default-active="menuIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          style
        >
          <el-menu-item
            v-for="item in menusMenu"
            v-if="item.showTF"
            :index="item.id+''"
            :key="item.id+''"
          >
            <span>{{item.menuName}}</span>
          </el-menu-item>
          			<el-submenu v-if="isProprietary" index="proprietary">
						<template slot="title"> 自营系统 </template>
						<el-menu-item
							v-for="proprietary in proprietaryList"
							:key="'proprietary' + proprietary.app"
							:index="'proprietary' + proprietary.app"
						>
							<span>{{ proprietary.appName }}</span>
						</el-menu-item>
					</el-submenu>
        </el-menu>
      </div>
      <div class="headerRight">
        <div style="margin-right: 22px;">
        </div>
        <span class="accoutName">欢迎你，{{ realName }}</span>
        <i class="el-icon-menu" @click="loginOut"></i>
      </div>
    </div>
    <div class="buttomWrapper">
      <div class="leftWrapper">
        <el-row class="menu">
          <el-col style="margin-top: 13px;">
            <el-menu :router="true" @select="subMenuSelect" :default-active="defaultIndex">
              <!-- <div v-for="item in subMenuData" :key="item.menuUrl+''" > -->
              <div v-for="item in subMenuData" :key="item.menuName">
                <span v-if="item.menuUrl == null">
                  <!-- <el-submenu :index="item.menuUrl+''"> -->
                  <el-submenu :index="item.id+''">
                    <template slot="title">
                      <!-- <i class="el-icon-caret-right"></i> -->
                      <span :style="{'paddingLeft':'14px'}">{{item.menuName}}</span>
                    </template>
                    <span
                      v-for="(itemSub,index) in item.childs"
                      :key="index"
                      :style="{'paddingLeft':'35px'}"
                    >
                      <el-menu-item :index="itemSub.menuUrl+''">
                        <div
                          style="padding-left:0px;"
                          :index="itemSub.menuUrl+''"
                        >- {{itemSub.menuName}}</div>
                      </el-menu-item>
                    </span>
                  </el-submenu>
                </span>
                <el-menu-item :index="item.menuUrl+''" v-else :style="{'paddingLeft':'35px'}">
                  <!-- <i class="el-icon-arrow-right"></i> -->
                  <span slot="title">{{item.menuName}}</span>
                </el-menu-item>
              </div>
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <div class="rightWrapper">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>

  </div>
</template>


<script type="text/ecmascript-6">
// import { mapMutations } from "vuex";
import _ from "lodash";
import { menu } from "./menuConfig";
export default {
	data() {
		return {
			realName: "", //用户名
			newMenuData: [],
			isProprietary: false, // 自营菜单
			proprietaryList: [], // 自营菜单
			menuIndex: "4",
			defaultIndex: "", //二级目录下默认打开第一个子目录
			menus: {
				menu: _.cloneDeep(menu),
			},
			subMenuData: [], //左边菜单数据
		};
	},

	computed: {
		menusMenu: function () {
			return this.menus.menu.filter((item) => item.showTF).filter(item => item.menuName !== '自营系统')
		},
	},

	methods: {
		// ...mapMutations(["updataQueryVerify"]),
		//退出登录
		loginOut() {
			this.$confirm("请确认是否要退出登录？", "提示", {
				type: "warning"
			})
				.then(() => {
					this.$api.loginOut().then(res => {
							localStorage.removeItem("pathData");
							localStorage.removeItem("threeMenu");
							localStorage.removeItem("threeMenuURL");
							localStorage.removeItem("standWeight");
							localStorage.removeItem("orderSourceCode");
							localStorage.removeItem("accessToken");
							localStorage.removeItem("sjyUserId");
							localStorage.removeItem("sjyUserName");
							localStorage.removeItem("sarkData");
							localStorage.accessToken = "";
							// self.setCookie("heheToken", "");
							// this.$Storage.setCookie("heheToken", "");

							// localStorage.removeItem("menuTwo");
							// localStorage.removeItem("menuOne");
							// localStorage.removeItem("authTxt");
							// this.$Storage.remove("heheToken");
							// this.$Storage.setCookie("heheToken", "");
							this.$router.push("/login");
					})
				})
				.catch(() => {});
    	},

    	// 判断是否是自营系统的菜单
		isProprietaryMenuItemFn(option) {
			return option.slice(0, 11) === "proprietary";
		},

		// 跳转自营系统
		// eg: http://192.168.16.19:9390?refreshToken=3967dde0a71d41969005d86440864ea9&route=/app/company/main
		goProprietart({ origin, refreshToken }) {
			// origin = "http://192.168.33.79:8013";
			let url = `${origin}/#/index?refreshToken=${refreshToken}&route=`;
			window.open(`${url}`);
		},

		/**
		 * 获取refreshToken
		 * @param {type} targetAppName 自营系统标识
		 * @param {type} route 需要跳转的路由
		 */
		getRefreshToken(targetAppName, route = "") {
			let params = {
				targetAppName,
				route,
				
			};
			return new Promise((reslove, reject) => {
				this.$api.getRedirectionUrl(params).then((res)=>{
					reslove(res)
				}).catch((err)=>{
					reject(err)
				})
			});
		},

		//一级菜单选择
		handleSelect(key) {
			if (this.isProprietaryMenuItemFn(key)) {
				this.getRefreshToken(key.slice(11, key.length)).then((res) => {this.goProprietart(res)});
				return;
			}
			this.menuIndex = key;
			let { currentMenuUrl, subMenuData } = this.getOneMenu();
			this.subMenuData = subMenuData;
			this.$router.push(currentMenuUrl);
			this.defaultIndex = currentMenuUrl;
			localStorage.pathData = currentMenuUrl;
		},

		// 获取选中菜单的信息
		getOneMenu() {
			let currentMenuUrl = "",
				subMenuData = "";
			this.menus.menu.forEach((item) => {
				if (Number(item.id) !== Number(this.menuIndex)) {
					return;
				}
				subMenuData = item.childs;
				let fistMenu = item.childs[0];
				if (fistMenu.menuUrl) {
					currentMenuUrl = fistMenu.menuUrl;
				} else {
					// 如果只设置了目录 没有设置菜单 则默认到index
					let secondMenu = fistMenu.childs[0] || {
						menuUrl: "/index",
					};
					currentMenuUrl = secondMenu.menuUrl;
				}
			});
			return {
				subMenuData,
				currentMenuUrl,
			};
		},

		//二级菜单选择
		subMenuSelect(key) {
			let currentMenuUrl = "";
			this.menus.menu.forEach((ielem) => {
				if (ielem.childs) {
					ielem.childs.forEach((item) => {
						if (item.menuUrl === key) {
							this.defaultIndex = item.menuUrl;
							currentMenuUrl = item.menuUrl;
						}
						if (item.childs) {
							item.childs.forEach((Kelem) => {
								if (Kelem.menuUrl === key) {
									this.defaultIndex = Kelem.menuUrl;
									currentMenuUrl = Kelem.menuUrl;
								}
							});
						}
					});
				}
			});
			localStorage.pathData = currentMenuUrl;
		},

		// TODO:
		// 给菜单上面权限点showTF赋值 当菜单权限匹配到权限点时候为true
		getNewMenus(authList, menusList) {
			let newMenus = [];
			menusList.forEach((oneMenuItem) => {
				// 一级菜单权限设置
				oneMenuItem.showTF = authList.includes(oneMenuItem.auth);
				oneMenuItem.childs.forEach((twoMenuItem) => {
					// 二级菜单权限设置
					twoMenuItem.showTF = authList.includes(twoMenuItem.auth);
					twoMenuItem.childs.forEach((threeMenuItem) => {
						// 三级级菜单权限设置
						threeMenuItem.showTF = authList.includes(threeMenuItem.auth);
						// 四级级菜单权限设置
						threeMenuItem.childs.forEach((fourMenuItem) => {
							fourMenuItem.showTF = authList.includes(fourMenuItem.auth);
						});
					});
				});
			});
			return menusList;
		},

		//菜单数据读取
		getMenus(self) {
			// self.$axios
			// 	.get(self.$portMain + "/sso/myAuthVals")
			self.$api.myAuthVals()
				.then((res) => {
					let authList = res,
						newMenus = [];
					// self.updataQueryVerify(authList);
					sessionStorage.setItem("verify", JSON.stringify(authList));
					newMenus = self.getNewMenus(authList, self.menus.menu);
					newMenus = self.getAuthTrueMenus(newMenus, self);
					self.newMenuData = newMenus.filter((item) => item.showTF);
					self.isProprietary = newMenus.some(
						(item) => item.menuName === "自营系统"
					);
					self.menus.menu = newMenus;
					if (localStorage.pathData) {
						self.goNext(self);
					} else {
						self.goFirstNext(self);
					}
				});
		},

		// 没有缓存路径
		goFirstNext(self) {
			let id = self.menus.menu.length > 0 ? self.menus.menu[0].id : "";
			self.handleSelect(id);
    	},

    	// 获取自营系统
		getProprietary() {
			// this.$axios.get(this.$portMain + "/sso/getAddressableApp")
			 this.$api.getAddressableApp().then((res) => {
				this.proprietaryList = res;
			});
		},

		// 有缓存路径
		goNext(self) {
			let currentMenuUrl = "";
			let {
				rootItem,
				rootItem: { id },
				nextItem,
				threeItem,
			} = self.getCurrentMenu(localStorage.pathData, self);
			if (threeItem) {
				currentMenuUrl = threeItem.menuUrl;
			} else {
				currentMenuUrl = nextItem.menuUrl;
			}
			self.menuIndex = id;
			self.subMenuData = rootItem.childs;
			// console.log(self.$route.path === currentMenuUrl, currentMenuUrl, self.$route.path)

			// 如果当前是二级或者三级菜单则根据缓存菜单跳转页面 否者不跳转页面
			if (self.$route.path === currentMenuUrl) {
				self.$router.push(currentMenuUrl);
			}
			self.defaultIndex = currentMenuUrl;
		},

		// 通过路径获取选中菜单信息
		getCurrentMenu(key, self) {
			let rootItem = "",
				nextItem = "",
				threeItem = "";
			self.menus.menu.forEach((ielem) => {
				if (ielem.childs) {
					ielem.childs.forEach((item) => {
						if (item.menuUrl === key) {
							rootItem = ielem;
							nextItem = item;
						}
						if (item.childs) {
							item.childs.forEach((Kelem) => {
								if (Kelem.menuUrl === key) {
									rootItem = ielem;
									nextItem = item;
									threeItem = Kelem;
								}
							});
						}
					});
				}
			});
			return {
				rootItem,
				nextItem,
				threeItem,
			};
		},

		// 删除为showTF为 false的菜单
		getAuthTrueMenus(oldMenuData) {
			oldMenuData.forEach((kelem) => {
				if (kelem.showTF) {
					let newSubMenuList = [];
					kelem.childs.forEach((qelem) => {
						//二級遍历
						if (qelem.showTF) {
							newSubMenuList.push(qelem);
							if (qelem.childs.length != 0) {
								let newThreeMenuList = [];
								qelem.childs.forEach((pelem) => {
									if (pelem.showTF) {
										newThreeMenuList.push(pelem);
									}
								});
								qelem.childs = newThreeMenuList;
							}
						}
					});
					kelem.childs = newSubMenuList;
				}
			});
			return oldMenuData.filter((item) => item.showTF);
		},

		// setCookie(c_name, value) {
		// 	document.cookie =
		// 		c_name + "=" + escape(value) + ";path=/;domain=localhost";
		// },
		//登录成功后查询用户信息和权限
		getUserInfo() {
			this.$api.myInfo().then(res => {
				this.realName = res.concat;
			});
		}
	},

	created() {
		let self = this;
		this.getMenus(this);
		this.getUserInfo(); //获取用户信息
		this.getProprietary();
	},

	beforeRouteEnter(to, from, next) {
		next((vm) => {});
	},

	beforeRouteUpdate(to, from, next) {
		const { menu } = this.menus;
		next();
	},
};
</script>

<style>
.el-badge__content.is-fixed {
  right: -46px !important;
  top: 30px !important;
  width: 12px;
  height: 16px;
}
</style>
<style scoped lang="scss">
body {
  background-color: #f3f3f3;
}

.textCenter {
  text-align: center;
}

.index {
  overflow: hidden;

  .title {
    background: #9e0029;
    color: #ffffff;
    height: 33px;
    width: 195px;
    text-align: center;
    padding-top: 17px;
    font-size: 14px;
  }

  .headerWrapper {
    background: #ffffff;
    margin-bottom: 15px;
    box-shadow: 0 1px 5px #EBEBEB;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .headerLeft {
      color: rgb(230, 14, 50);
      margin-left: 0px;
      display: flex;
      align-items: center;

      i.logoIcon:after {
        content: '\e61a';
        font-size: 1.5rem;
        margin-right: 5px;
      }
    }

    .headerRight {
      color: #2D2F33;
      margin-right: 25px;
      display: flex;
      align-items: center;
      font-size: 0.6rem;

      .noLoginIcon {
        width: 25px;
        height: 25px;
        border-radius: 50%;
      }

      i {
        cursor: pointer;
      }

      i.outLoginIcon:after {
        content: '\e654';
        transition: color 0.5s;
      }

      i.outLoginIcon {
        &:hover {
          color: rgb(230, 14, 50)
        }
      }

      .accoutName {
        margin: 0 12px 0 5px;
        font-size: 14px;
        // cursor: pointer;
      }
    }
  }

  .el-menu-demo {
    height: 50px;

    li {
      height: 50px;
      line-height: 49px;
    }

    /deep/ .el-submenu__title {
			height: 50px;
			line-height: 52px;
		}
  }

  .buttomWrapper {
    display: flex;

    .leftWrapper {
      width: 200px;
      box-shadow: 1px 0 5px #EBEBEB;
      background: #ffffff;
      overflow: auto;
      overflow-x: hidden;
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 0;
      border-top-right-radius: 8px;

      .iconfont {
        margin-right: 0.5rem;
      }
    }

    .rightWrapper {
      border-top-left-radius: 8px;
      padding: 15px 15px 0 15px;
      flex: 1;
      box-shadow: -1px 0 5px #EBEBEB;
      background: #ffffff;
      overflow: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      position: absolute;
      top: 60px;
      left: 210px;
      right: 0;
      bottom: 0;
    }
  }

  .editUserDiv {
    line-height: 40px;

    .editUserLeft {
      color: #999999;
    }

    .editUserRight {
      color: #333333;

      .userInp {
        width: 200px;
        margin-right: 30px;
        float: left;
      }
    }
  }

  .gold_999, .gold_9999, .platinum_950 {
    color: #878d99;
    font-size: 14px;
  }

  .gold_999:hover {
    color: red;
  }

  .gold_9999:hover {
    color: red;
  }

  .platinum_950:hover {
    color: red;
  }
}

i.bt-proManagerIcon:after {
  content: '\e601';
}

i.bt-genManagerIcon:after {
  content: '\e650';
}

i.bt-genColumnIcon:after {
  content: '\e61c';
}

i.bt-homePageCmIcon:after {
  content: '\e608';
}

i.bt-sellManagerIcon:after {
  content: '\e604';
}

i.bt-custManagerIcon:after {
  content: '\e607';
}

i.bt-orderManagerIcon:after {
  content: '\e602';
}

i.bt-systemManagerIcon:after {
  content: '\e61b';
}

i.bt-dataStatisticsIcon:after {
  content: '\e603';
}

i.bt-userFeedBackIcon:after {
  content: '\e60d';
}

i.bt-userManagerIcon:after {
  content: '\e61d';
}

i.bt-companyManagerIcon:after {
  content: '\e606';
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}

.newsPicTwo {
  margin-top: -10px;
}

.newsWrap {
  position: relative;

  .newsPic {
    width: 15px;
    height: 16px;
  }

  .spot {
    width: 6px;
    height: 6px;
    background: red;
    display: inline-block;
    border-radius: 50%;
    position: absolute;
    top: -2px;
    right: -4px;
  }
}

</style>
