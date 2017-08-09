<template>
  <div class="shopMain">
    <div class="shopMain_top" :style="{'background': 'url(' + shopInfo.bgpic + ')', 'background-size': 'cover'}" @click="$router.push({name: 'shopInfo', query: $route.query})">
      <div class="shopMain_top_icon">
        <img class="shopMain_top_icon_img" :src="shopInfo.logo">
      </div>
      <div class="shopMain_top_info">
        <div class="shopMain_top_info_name">{{shopInfo.name}}</div>
        <div class="shopMain_top_info_intro">{{shopInfo.notice}}</div>
        <div class="shopMain_top_info_tips"><span style="background: #0091ff;padding: 0 2px;border-radius: 3px;">{{shopInfo.tags}}</span></div>
      </div>
    </div>
    <div class="shopMain_sales" @click="toggleType">
      <div class="shopMain_sales_line" v-for="(item, key) in shopInfo.salesList" :key="item.id" v-if="(key !== 0 && pullDown) || (key === 0)">
        <div class="shopMain_sales_line_detail" :class="'icon_' + item.type" >{{item.name}}</div>
        <div :class="button_type" v-if="key === 0" >{{shopInfo.salesList.length}}个活动</div>
      </div>
    </div>
    <div class="shopMain_list">
      <div class="shopMain_list_title_line">
        <div class="shopMain_list_title">商品</div>
        <div class="shopMain_list_order" @click="$router.push({name: 'orderList', query: $route.query})">查看订单</div>
      </div>
      <div class="shopMain_list_total" ref="list_frame">
        <div class="shopMain_list_total_kind">
          <div v-for="(item, key) in kindList" :key="item.type" :class="'kind_item ' + (key === chosenKind ? 'chosen' : '')" @click="chosenKind = key">
            {{item.name}}
            <div class="kind_item_line" v-if="(key !== chosenKind) && ((key + 1) !== chosenKind)"></div>
            <mt-badge class="kind_item_badge" color="red" v-if="item.count > 0" size="small">{{item.count > 99 ? '99+' : item.count}}</mt-badge>
          </div>
        </div>
        <div class="shopMain_list_total_menu">
          <div class="shopMain_list_total_menu_title">{{kindList[chosenKind].name}}</div>
          <div v-for="(item, key) in menuList" :key="item.id" class="menu_item">
            <div class="menu_item_left" @click="displayItem(item)">
              <img class="menu_item_left_img" :src="item.img || defaultImg"/>
            </div>
            <div class="menu_item_right">
              <div class="menu_item_right_title">{{item.name}}</div>
              <div v-if="item.tags" class="menu_item_right_tags">{{item.tags}}</div>
              <div class="menu_item_right_line">
                <div class="menu_item_right_line_left"><span style="font-size: 11px;">￥</span>{{item.price}}</div>
                <div class="menu_item_right_line_right">
                  <div v-if="item.count > 0" class="menu_item_right_line_right_button_del"  @click="modifyCount('del', item)"></div>
                  <div v-if="item.count > 0" class="menu_item_right_line_right_count">{{item.count}}</div>
                  <div class="menu_item_right_line_right_button" @click="modifyCount('add', item)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="shopMain_list_bottom_line1" v-if="salesTips">
        <template v-if="salesType === 3">
          新用户首单立减<span style="color: #ff5339">{{salesTips2}}</span>元
        </template>
        <template v-else>
          已满{{salesTips}}元，结算减<span style="color: #ff5339">{{salesTips2}}</span>元
        </template>
      </div>
      <div class="shopMain_list_bottom_line2" :style="{background: shopMain_list_bottom_line2_background}">
        <div class="shopMain_list_bottom_icon" @click="selected_menu.length > 0 ? (popupVisible = !popupVisible) : ''">
          <span :class="(selected_menu.length > 0 ? 'kind_item_badge_img' : 'kind_item_badge_img_noSelect')">
            <mt-badge class="kind_item_badge" style="top: -10px; right: -10px;" color="red" v-if="totalCount > 0" size="small">{{totalCount > 99 ? '99+' : totalCount}}</mt-badge>
          </span>
        </div>
        <template v-if="totalAmount > 0">
          <div class="shopMain_list_bottom_amount">￥{{totalAmount}}</div>
          <div class="shopMain_list_bottom_pay" @click="pay">去结算</div>
        </template>
        <template v-else>
          <div class="shopMain_list_bottom_noSelected">未选择商品</div>
          <div class="shopMain_list_bottom_pay_noSelected">去结算</div>
        </template>
      </div>
    </div>
    <mt-popup
      v-model="chooseItem"
      class="chooseItem"
      >
      <img style="width: 100%" :src="largeItem.img || defaultImg">
      <div class="menu_item_right" style="padding: 10px;width: 100%">
        <div class="menu_item_right_title">{{largeItem.name}}</div>
        <div v-if="largeItem.tags" class="menu_item_right_tags" style="margin-top: 5px;">{{largeItem.tags}}</div>
        <div class="menu_item_right_line" style="padding-top: 5px;">
          <div class="menu_item_right_line_left"><span style="font-size: 11px;">￥</span>{{largeItem.price}}</div>
          <div class="menu_item_right_line_right">
            <div class="modal_add_item" @click="modifyCount('add', largeItem)">加入购物车</div>
          </div>
        </div>
      </div>
    </mt-popup>
    <mt-popup
      v-model="popupVisible"
      class="selected_detail"
      position="bottom">
      <div>
        <div class="shopMain_list_bottom_line3" v-if="salesTips">
          <template v-if="salesType === 3">
            新用户首单立减<span style="color: #ff5339">{{salesTips2}}</span>元
          </template>
          <template v-else>
            已满{{salesTips}}元，结算减<span style="color: #ff5339">{{salesTips2}}</span>元
          </template>
        </div>
        <div class="bottom_detail_title">
          <div class="bottom_detail_title_text">已选商品</div>
          <div class="bottom_detail_clear" @click="clear"><img class="bottom_detail_clear_icon" src="../assets/clear.png"/><div class="bottom_detail_clear_text">清空</div></div>
        </div>
        <div style="max-height: 270px;overflow: auto;">
          <div v-for="(item, key) in selected_menu" class="bottom_detail_item">
            <div class="bottom_detail_item_name">{{item.name}}</div>
            <div class="bottom_detail_item_price">￥{{(item.count * (item.price * 100)) / 100}}</div>
            <div v-if="item.count > 0" class="menu_item_right_line_right_button_del"  @click="modifyCount('del', item)"></div>
            <div v-if="item.count > 0" class="menu_item_right_line_right_count" style="text-align: center;">{{item.count}}</div>
            <div class="menu_item_right_line_right_button" @click="modifyCount('add', item)"></div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Popup, Badge, PaletteButton, Toast } from 'mint-ui'
export default {
  name: 'shopMain',
  mounted () {
    // this.setUserInfo(this.$urlConfig.default_userInfo)
    if (this.userInfo.wid) {
      this.getMainInfo()
    } else {
      if (this.isWeiXin() === 'wx') {
        var savedId = window.localStorage.getItem('yjiatech_id')
        var isSaved = true
        try {
          if (JSON.parse(savedId).openid && (JSON.parse(savedId).wid === this.$route.query.wid)) {
            this.setUserInfo(JSON.parse(savedId))
            this.getMainInfo()
          } else {
            isSaved = false
          }
        } catch (e) {
          isSaved = false
        }
        if (!isSaved) {
          this.$http.post(this.$urlConfig.openId, {
            data: {
              wid: this.$route.query.wid,
              shopid: this.$route.query.shopid,
              qrGID: this.$route.query.qrGID,
              openid: ''
            }
          }).then((data) => {
            var result = data.data
            if (parseInt(result.errcode) !== 0) {
              Toast(result.errmsg)
              return
            }
            window.localStorage.setItem('yjiatech_id', JSON.stringify({
              wid: this.$route.query.wid,
              shopid: this.$route.query.shopid,
              qrGID: this.$route.query.qrGID,
              openid: result.openid
            }))
            this.setUserInfo({
              wid: this.$route.query.wid,
              shopid: this.$route.query.shopid,
              qrGID: this.$route.query.qrGID,
              openid: result.openid
            })
            this.getMainInfo()
          }).catch((e) => {
            console.log(e)
          })
        }
      } else {
        this.setUserInfo({
          wid: this.$route.query.wid,
          shopid: this.$route.query.shopid,
          qrGID: this.$route.query.qrGID,
          openid: ''
        })
        this.getMainInfo()
      }
    }
  },
  components: {
    [PaletteButton.name]: PaletteButton,
    [Badge.name]: Badge,
    [Popup.name]: Popup
  },
  data () {
    return {
      pullDown: false,
      popupVisible: false,
      chooseItem: false,
      largeItem: {},
      chosenKind: 0,
      totalCount: 0,
      totalAmount: 0,
      salesType: '',
      salesTips: '',
      salesTips2: '',
      defaultImg: require('../assets/markbg@2x.png'),
      shopMain_list_bottom_line2_background: '',
      kindList: [{name: ''}],
      menuList: [],
      allMenuList: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'shopInfo'
    ]),
    button_type () {
      return this.pullDown ? 'shopMain_sales_line_button2' : 'shopMain_sales_line_button1'
    },
    selected_menu () {
      var selectedMenu = []
      this.allMenuList.forEach((val) => {
        if (val.count > 0) {
          selectedMenu.push(val)
        }
      })
      return selectedMenu
    }
  },
  methods: {
    ...mapActions([
      'setUserInfo',
      'setShopInfo',
      'setOrderInfo'
    ]),
    isWeiXin () {
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) + '' === 'micromessenger') {
        return 'wx'
      } else if (ua.match(/Alipay/i) + '' === 'alipay') {
        return 'alipay'
      } else {
        return 'wap'
      }
    },
    toggleType () {
      this.pullDown = !this.pullDown
      this.$nextTick(() => {
        this.resizeList()
      })
    },
    resizeList () {
      this.$refs.list_frame.style.height = (document.documentElement.clientHeight - this.$refs.list_frame.getBoundingClientRect().top) + 'px'
    },
    modifyCount (type, item) {
      if (type === 'add') {
        this.allMenuList.forEach((val) => {
          if (val.id === item.id) {
            if (val.count < 9) {
              val.count++
            }
          }
        })
        this.kindList.forEach((val) => {
          if (val.type === item.kind) {
            if (val.count < 9) {
              val.count ++
            }
          }
        })
      } else {
        this.allMenuList.forEach((val) => {
          if (val.id === item.id) {
            if (val.count > 0) {
              val.count--
            }
          }
        })
        this.kindList.forEach((val) => {
          if (val.type === item.kind) {
            if (val.count > 0) {
              val.count--
            }
          }
        })
      }
      if (this.chooseItem) {
        this.chooseItem = false
      }
    },
    getCurrentMenuList (newVal) {
      var tmpMenuList = []
      this.allMenuList.forEach((val) => {
        if (val.kind === this.kindList[newVal].type) {
          tmpMenuList.push(val)
        }
      })
      this.menuList = tmpMenuList
    },
    clear () {
      this.allMenuList.forEach((val) => {
        val.count = 0
      })
      this.kindList.forEach((val) => {
        val.count = 0
      })
    },
    pay () {
      this.$router.push({name: 'confirmOrder', query: this.$route.query})
    },
    displayItem (item) {
      this.chooseItem = true
      this.largeItem = item
    },
    getCode () {
      this.$http.post(this.$urlConfig.appId, {
        data: {
          wid: this.$route.query.wid,
          shopid: this.$route.query.shopid,
          qrGID: this.$route.query.qrGID,
          openid: ''
        }
      }).then((data) => {
        var result = data.data
        if (parseInt(result.errcode) !== 0) {
          Toast(result.errmsg)
          return
        }
        const APPID = result.AppId
        const redirectURL = encodeURIComponent(window.location.href)
        console.log(result)
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID + '&redirect_uri=' + redirectURL + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
      }).catch((e) => {
        console.log(e)
      })
    },
    getMainInfo () {
      this.$http.post(this.$urlConfig.getMain, {data: this.userInfo}).then((data) => {
        var result = data.data
        if (parseInt(result.errcode) !== 0) {
          Toast(result.errmsg)
          return
        }
        this.setShopInfo({
          name: result.shopInfo.name,
          logo: result.shopInfo.logo,
          notice: result.shopInfo.notice,
          tags: result.shopInfo.tags,
          bgpic: result.shopInfo.bgpic,
          phone: result.shopInfo.phone,
          address: result.shopInfo.address,
          times: result.shopInfo.times,
          info: result.shopInfo.info,
          pics: result.shopInfo.pics,
          salesList: result.salesList
        })
        this.kindList = result.menuList
        this.allMenuList = result.proList
        this.getCurrentMenuList(0)
        var lastMenu = window.localStorage.getItem('yjiatech_menu')
        if (lastMenu) {
          try {
            JSON.parse(lastMenu).forEach((item) => {
              this.allMenuList.forEach((val) => {
                if (val.id === item.id) {
                  val.count = item.count
                }
              })
              this.kindList.forEach((val) => {
                if (val.type === item.kind) {
                  val.count += item.count
                }
              })
            })
          } catch (e) {

          }
        }
        this.$nextTick(() => {
          this.resizeList()
        })
      }).catch((e) => {
        console.log(e)
      })
    }
  },
  watch: {
    selected_menu (newVal) {
      var tmpTotalCount = 0
      var tmpTotalAmount = 0
      newVal.forEach((val) => {
        tmpTotalCount += val.count
        tmpTotalAmount += (val.count * (val.price * 100))
      })
      tmpTotalAmount = tmpTotalAmount / 100
      this.totalCount = tmpTotalCount
      this.totalAmount = tmpTotalAmount
      if (newVal.length === 0) {
        this.popupVisible = false
        this.shopMain_list_bottom_line2_background = '#595959'
      } else {
        this.shopMain_list_bottom_line2_background = '#1b251f'
      }
      var flag = false
      var salesType = ''
      var salesTips = ''
      var salesTips2 = 0
      var salesItem = {reduce: 0}
      this.shopInfo.salesList.forEach((val) => {
        if ((parseFloat(val.gate) <= tmpTotalAmount) && (salesTips2 < parseFloat(val.reduce)) && ((val.type === 1) || (val.type === 3))) {
          flag = true
          salesType = val.type
          salesTips = parseFloat(val.gate)
          salesTips2 = parseFloat(val.reduce)
          salesItem = val
        }
      })
      this.salesType = salesType
      this.salesTips = salesTips
      this.salesTips2 = salesTips2
      window.localStorage.setItem('yjiatech_menu', JSON.stringify(newVal))
      this.setOrderInfo({order: newVal, discount: salesItem})
      this.$nextTick(() => {
        if (!flag) {
          this.salesTips = ''
          this.$refs.list_frame.style.paddingBottom = '48px'
        } else {
          this.$refs.list_frame.style.paddingBottom = '76px'
        }
      })
    },
    chosenKind (newVal) {
      this.getCurrentMenuList(newVal)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .shopMain_top {
    height: 120px;
    display: flex;
    justify-content: center;
    color: #FFFFFF;
    text-align: left;
    background-size: cover;
  }
  .shopMain_top_icon {
    width: 60px;
    height: 60px;
    margin: 10px 15px;
    align-self: center;
    display: flex;
    flex-direction: column;
  }
  .shopMain_top_icon_img {
    height: 100%;
    align-self: center;
  }
  .shopMain_top_info {
    font-size: 11px;
    width: 70%;
    padding: 10px 10px 10px 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: url("../assets/more.png") no-repeat;
    background-position: right;
    background-size: 25px 25px;
  }
  .shopMain_top_info_name {
    font-size: 18px;
    font-weight: bold;

    margin-bottom: 7px;
  }
  .shopMain_top_info_intro {
    padding-bottom: 7px;
    color: #f7f3ed;
  }
  .shopMain_top_info_tips {
  }
  .shopMain_sales {
    padding-top: 10px;
  }
  .shopMain_sales_line {
    display: flex;
    justify-content: space-between;
    padding: 3px 0;
    font-size: 12px;
  }
  .shopMain_sales_line_detail {
    height: 16px;
    background-image: url("../assets/reduce.png");
    background-repeat: no-repeat;
    background-position: left;
    background-size: 13px 13px;
    padding-left: 18px;
    margin-left: 20px;
    color: #666666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 70%;
  }
  .icon_1 {
    background-image: url("../assets/jian@2x.png");
    background-repeat: no-repeat;
  }
  .icon_2 {
    background-image: url("../assets/zeng.png");
    background-repeat: no-repeat;
  }
  .icon_3 {
    background-image: url("../assets/xin@2x.png");
    background-repeat: no-repeat;
  }
  .icon_4 {
    background-image: url("../assets/zhuan@2x.png");
    background-repeat: no-repeat;
  }
  .shopMain_sales_line_button1 {
    text-align: right;
    background: url("../assets/unfold.png") no-repeat;
    background-position: right;
    background-size: contain;
    padding-right: 20px;
    margin-right: 20px;
    color: #AEAEAE;
  }
  .shopMain_sales_line_button2 {
    text-align: right;
    background: url("../assets/packup.png") no-repeat;
    background-position: right;
    background-size: contain;
    padding-right: 20px;
    margin-right: 20px;
    color: #AEAEAE;
  }
  .shopMain_list {
    position: relative;
  }
  .shopMain_list_total {
    display: flex;
    justify-content: center;
    padding-bottom: 50px;
    border-top: 1px solid #F8F8F8;
  }
  .shopMain_list_title_line {
    display: flex;
    font-size: 15px;
  }
  .shopMain_list_title {
    width: 14%;
    padding: 10px 0;
    text-align: center;
    color: #2395ff;
    margin: 0 8%;
    border-bottom: 2px solid;
  }
  .shopMain_list_order {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 2px;
    font-size: 15px;
    margin: 10px;
    color: #333333;
  }
  .shopMain_list_total_kind {
    width: 30%;
    height: 100%;
    overflow: auto;
  }
  .shopMain_list_total_menu {
    width: 70%;
    height: 100%;
    overflow: auto;
    padding: 10px;
  }
  .shopMain_list_total_menu_title {
    padding-bottom: 5px;
    border-bottom: 1px solid #F8F8F8;
    color: #666666;
  }
  .shopMain_list_bottom_line1 {
    height: 28px;
    background: #FAF5D3;
    color: #333333;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 48px;
    width: 100%;
    font-weight: bold;
  }
  .shopMain_list_bottom_line2 {
    height: 48px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #595959;
    color: #FFFFFF;
    font-weight: bold;
    z-index: 9999;
  }
  .shopMain_list_bottom_line3 {
    height: 28px;
    background: #FAF5D3;
    color: #333333;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-weight: bold;
  }
  .shopMain_list_bottom_icon {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    position: relative;
    padding-left: 15px;
    width: 63px;
  }
  .shopMain_list_bottom_amount {
    font-size: 18px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 50%;
  }
  .shopMain_list_bottom_noSelected {
    font-size: 13px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 50%;
    color: #aca9a7;
  }
  .shopMain_list_bottom_pay {
    font-size: 17px;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-self: center;
    height: 100%;
    background: #00D762;
  }
  .shopMain_list_bottom_pay_noSelected {
    font-size: 15px;
    padding: 0 15px;
    display: flex;
    color: #b4b4b4;
    justify-content: center;
    flex-direction: column;
    align-self: center;
    height: 100%;
    background: #6a6a6a;
  }
  .kind_item {
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background: #F8F8F8;
    position: relative;
    color: #666666
  }
  .kind_item_line {
    position: absolute;
    bottom: 0;
    margin: auto 15%;
    width: 70%;
    height: 1px;
    background-color: #F0F0F0;
  }
  .kind_item_badge {
    position: absolute;
    top: 0;
    right: 0;
  }
  .kind_item_badge_img_noSelect {
    position: absolute;
    left: 10px;
    bottom: 10px;
    width: 48px;
    height: 48px;
    box-sizing: border-box;
    border-radius: 100%;
    background-image: radial-gradient(circle,#363636 43px,#444 0);
    border: 5px solid #444;
    box-shadow: 0 10px 5px 0 rgba(0,0,0,.1);
    will-change: transform;
  }
  .kind_item_badge_img_noSelect:before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1OCA1OCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxmaWx0ZXIgaWQ9ImEiIHdpZHRoPSIyMDAlIiBoZWlnaHQ9IjIwMCUiIHg9Ii01MCUiIHk9Ii01MCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCI+PGZlT2Zmc2V0IGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxLjUiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4wOCAwIiBpbj0ic2hhZG93Qmx1ck91dGVyMSIgcmVzdWx0PSJzaGFkb3dNYXRyaXhPdXRlcjEiLz48ZmVNZXJnZT48ZmVNZXJnZU5vZGUgaW49InNoYWRvd01hdHJpeE91dGVyMSIvPjxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIvPjwvZmVNZXJnZT48L2ZpbHRlcj48cGF0aCBpZD0iYiIgZD0iTTcuNjE0IDQuMDUxYy0xLjA2Ni4wODYtMS40NTItLjM5OC0xLjc1Mi0xLjU4NEM1LjU2MiAxLjI4LjMzIDUuODguMzMgNS44OGwzLjcxIDE5LjQ3NmMwIC4xNDgtMS41NiA3LjUxNS0xLjU2IDcuNTE1LS40ODkgMi4xOS4yOTIgNC4yNyAzLjU2IDQuMzIgMCAwIDM2LjkxNy4wMTcgMzYuOTIuMDQ3IDEuOTc5LS4wMTIgMi45ODEtLjk5NSAzLjAxMy0zLjAzOS4wMy0yLjA0My0xLjA0NS0yLjk3OC0yLjk4Ny0yLjk5M0w4LjgzIDMxLjE5MnMuODYtMy44NjUgMS4wNzctMy44NjVjMCAwLTUuNzg4LjEyMiAzMi4wNjUtMS45NTYuNjA2LS4wMzMgMi4wMTgtLjc2NCAyLjI5OC0xLjg0OCAxLjExMy00LjMxNyA0LjAwOC0xMy4yNiA0LjQ1OC0xNS42NC45MzItNC45MjUgMi4wNjEtOC41NTgtNC4yOC03LjQwNSAwIDAtMzUuNzY4IDMuNDg3LTM2LjgzMyAzLjU3M3oiLz48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWx0ZXI9InVybCgjYSkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMgMikiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuMDM4IDcuODA4KSI+PG1hc2sgaWQ9ImMiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI2IiLz48L21hc2s+PHVzZSBmaWxsPSIjNUY1RjYzIiB4bGluazpocmVmPSIjYiIvPjxwYXRoIGZpbGw9IiNFQkVFRjMiIGQ9Ik01My45NjIgNy43NzRsLTUuNzAxIDE5LjMwNS00MC43OCAxLjU3NHoiIG9wYWNpdHk9Ii4wNSIgbWFzaz0idXJsKCNjKSIvPjwvZz48cGF0aCBzdHJva2U9IiM1RjVGNjMiIHN0cm9rZS13aWR0aD0iNiIgZD0iTTkuMzc0IDE4LjcyMlM3Ljg2OCAxMS4yODMgNy4zMjMgOC43MUM2Ljc3OCA2LjEzNiA1Ljg2IDUuMzMgMy45NzggNC41MiAyLjA5NiAzLjcxMy4zNjcgMi4yODYuMzY3IDIuMjg2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48Y2lyY2xlIGN4PSI0NiIgY3k9IjUxIiByPSI0IiBmaWxsPSIjNUY1RjYzIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI1MSIgcj0iNCIgZmlsbD0iIzVGNUY2MyIvPjwvZz48L3N2Zz4=) 50% no-repeat;
    background-size: 50%;
    content: "";
  }
  .kind_item_badge_img {
    position: absolute;
    left: 10px;
    bottom: 10px;
    width: 48px;
    height: 48px;
    box-sizing: border-box;
    border-radius: 100%;
    background-color: #3190e8;
    border: 5px solid #444;
    box-shadow: 0 10px 5px 0 rgba(0,0,0,.1);
    will-change: transform;
  }
  .kind_item_badge_img:before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1OCA1OCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxmaWx0ZXIgaWQ9ImEiIHdpZHRoPSIyMDAlIiBoZWlnaHQ9IjIwMCUiIHg9Ii01MCUiIHk9Ii01MCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCI+PGZlT2Zmc2V0IGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxLjUiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4wOCAwIiBpbj0ic2hhZG93Qmx1ck91dGVyMSIgcmVzdWx0PSJzaGFkb3dNYXRyaXhPdXRlcjEiLz48ZmVNZXJnZT48ZmVNZXJnZU5vZGUgaW49InNoYWRvd01hdHJpeE91dGVyMSIvPjxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIvPjwvZmVNZXJnZT48L2ZpbHRlcj48cGF0aCBpZD0iYiIgZD0iTTcuNjE0IDQuMDUxYy0xLjA2Ni4wODYtMS40NTItLjM5OC0xLjc1Mi0xLjU4NEM1LjU2MiAxLjI4LjMzIDUuODguMzMgNS44OGwzLjcxIDE5LjQ3NmMwIC4xNDgtMS41NiA3LjUxNS0xLjU2IDcuNTE1LS40ODkgMi4xOS4yOTIgNC4yNyAzLjU2IDQuMzIgMCAwIDM2LjkxNy4wMTcgMzYuOTIuMDQ3IDEuOTc5LS4wMTIgMi45ODEtLjk5NSAzLjAxMy0zLjAzOS4wMy0yLjA0My0xLjA0NS0yLjk3OC0yLjk4Ny0yLjk5M0w4LjgzIDMxLjE5MnMuODYtMy44NjUgMS4wNzctMy44NjVjMCAwLTUuNzg4LjEyMiAzMi4wNjUtMS45NTYuNjA2LS4wMzMgMi4wMTgtLjc2NCAyLjI5OC0xLjg0OCAxLjExMy00LjMxNyA0LjAwOC0xMy4yNiA0LjQ1OC0xNS42NC45MzItNC45MjUgMi4wNjEtOC41NTgtNC4yOC03LjQwNSAwIDAtMzUuNzY4IDMuNDg3LTM2LjgzMyAzLjU3M3oiLz48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWx0ZXI9InVybCgjYSkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMgMikiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuMDM4IDcuODA4KSI+PG1hc2sgaWQ9ImMiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI2IiLz48L21hc2s+PHVzZSBmaWxsPSIjRkZGIiB4bGluazpocmVmPSIjYiIvPjxwYXRoIGZpbGw9IiMyMDczQzEiIGQ9Ik01My45NjIgNy43NzRsLTUuNzAxIDE5LjMwNS00MC43OCAxLjU3NHoiIG9wYWNpdHk9Ii4xIiBtYXNrPSJ1cmwoI2MpIi8+PC9nPjxwYXRoIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSI2IiBkPSJNOS4zNzQgMTguNzIyUzcuODY4IDExLjI4MyA3LjMyMyA4LjcxQzYuNzc4IDYuMTM2IDUuODYgNS4zMyAzLjk3OCA0LjUyIDIuMDk2IDMuNzEzLjM2NyAyLjI4Ni4zNjcgMi4yODYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjQ2IiBjeT0iNTEiIHI9IjQiIGZpbGw9IiNGRkYiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjUxIiByPSI0IiBmaWxsPSIjRkZGIi8+PC9nPjwvc3ZnPg==) 50% no-repeat;
    background-size: 50%;
    content: "";
  }
  .chosen {
    color: #000000;
    font-weight: bold;
    background: #ffffff;
  }
  .menu_item {
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 10px 0;
    border-bottom: 1px solid #F8F8F8;
  }
  .menu_item_left {
    width: 30%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .menu_item_left_img {
    width: 100%;
    max-height: 100%;
  }
  .menu_item_right {
    width: 70%;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .menu_item_right_title {
    font-weight: bold;
    text-align: left;
  }
  .menu_item_right_tags {
    font-size: 10px;
    color: #FF745E;
    text-align: left;
    border: 1px solid #FFBDB3;
    align-self: flex-start;
    padding: 0 1px;
    display: flex;
    align-items: flex-start;
  }
  .menu_item_right_line {
    display: flex;
    justify-content: space-between;
    color: #E46D5D;
    padding-top: 15px;
  }
  .menu_item_right_line_left {
    align-self: center;
    font-size: 16px;
  }
  .menu_item_right_line_right {
    display: flex;
    justify-content: center;
  }
  .menu_item_right_line_right_count {
    display: flex;
    justify-content: center;
    align-self: center;
    flex-direction: column;
    padding: 0 15px;
    color: #666666;
  }
  .menu_item_right_line_right_button {
    border-radius: 15px;
    background: #34A1FB url('../assets/add.png') no-repeat;
    background-position: center;
    background-size: 50%;
    font-size: 20px;
    height: 22px;
    width: 22px;
    display: flex;
    justify-content: center;
    align-self: center;
    align-items: center;
    flex-direction: column;
  }
  .menu_item_right_line_right_button_del {
    border-radius: 15px;
    background: #ffffff url('../assets/minus.png') no-repeat;
    background-position: center;
    background-size: 50%;
    border: 1px solid #34A1FB;
    font-size: 20px;
    height: 22px;
    width: 22px;
    display: flex;
    justify-content: center;
    align-self: center;
    align-items: center;
    flex-direction: column;
  }
  .selected_detail {
    width: 100%;
    bottom: 48px;
  }
  .bottom_detail_title {
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    font-size: 20px;
    color: #666666;
    background: #ECECEE;
    height: 45px;
    align-items: center;
  }
  .bottom_detail_title_text {
    font-size: 16px;
    font-weight: bold;
  }
  .bottom_detail_clear {
    height: 100%;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bottom_detail_clear_text {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .bottom_detail_clear_icon {
    height: 40%;
    opacity: 0.5;
    padding-right: 10px;
  }
  .bottom_detail_item {
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    height: 55px;
    font-size: 16px;
    border-bottom: 1px solid #eeeeee;
  }
  .bottom_detail_item_name {
    width: 50%;
    display: flex;
    align-self: center;
    align-items: left;
    flex-direction: column;
  }
  .bottom_detail_item_price {
    width: 15%;
    display: flex;
    justify-content: center;
    align-self: center;
    align-items: center;
    flex-direction: column;
    color: #E46D5D;
    font-weight: bold;
  }
  .bottom_detail_tips {
    background: #ECECEE;
    height: 15px;
  }
  .chooseItem {
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .modal_add_item {
    background: #34A1FB;
    color: #ffffff;
    border-radius: 15px;
    padding: 5px 10px;
  }
</style>
