<template>
  <div class="finish_order" ref="finish_order">
    <div class="finish_top">
      <div class="finish_top_time_area">
        <div style="color: #333333;font-size: 18px;font-weight: bold;">{{finish_time}}</div>
        <div style="color: #999999;font-size: 10px;">下单时间</div>
      </div>
      <div class="finish_tips">{{tags}}</div>
      <div class="finish_tips2">{{text}}</div>
      <div class="finish_tips3">{{name}}</div>
      <div class="finish_buttons">
        <div class="finish_button left" @click="$router.push({name: 'orderList'})">查看订单</div>
        <div class="finish_button right" @click="$router.push({name: 'shopMain'})">商家首页</div>
      </div>
      <div class="finish_luckyMoney" v-if="shareList.isShare === '0'">发红包</div>
    </div>
    <mt-popup
      v-model="popupVisible"
      class="luckyMoney_popup"
      popup-transition="popup-fade">
      <div class="luckyMoney_popup_title">{{couponList.title}}</div>
      <div class="luckyMoney_popup_amount"><span class="unit">￥</span>{{couponList.money}}</div>
      <div class="luckyMoney_popup_tips">{{couponList.name}}</div>
      <div class="luckyMoney_popup_button" @click="popupVisible = false">好的</div>
    </mt-popup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Popup, Toast } from 'mint-ui'
export default {
  name: 'shopMain',
  mounted () {
    if (this.$route.query.OrderId && !this.userInfo.openid) {
      this.query_params = this.$route.query
      this.setUserInfo({
        wid: this.$route.query.wid,
        shopid: this.$route.query.shopid,
        qrGID: this.$route.query.qrGID,
        openid: this.$route.query.openid
      })
      this.$http.post('/notify/payFinish.html', {
        data: this.userInfo,
        order: {
          OrderId: this.$route.query.OrderId
        }
      }).then((data) => {
        var result = data.data
        if (parseInt(result.errcode) !== 0) {
          Toast(result.errmsg)
          return
        }
        this.finish_time = result.orderList.payTime
        this.tags = result.orderList.tags
        this.text = result.orderList.text
        this.name = result.orderList.name
        this.couponList = result.couponList
        this.shareList = result.shareList
        if (result.couponList !== {}) {
          this.popupVisible = true
        }
      }).catch((e) => {
        console.log(e)
      })
    } else {
      this.$router.push({name: 'shopMain'})
    }
    this.$refs.finish_order.style.height = (document.documentElement.clientHeight - this.$refs.finish_order.getBoundingClientRect().top) + 'px'
  },
  components: {
    [Popup.name]: Popup
  },
  data () {
    return {
      popupVisible: false,
      finish_time: '',
      tags: '',
      text: '',
      name: '',
      couponList: {},
      shareList: {},
      query_params: {}
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'setUserInfo'
    ]),
    dateFormat (value, fmt) {
      var o = {
        'M+': value.getMonth() + 1, // 月份
        'd+': value.getDate(), // 日
        'h+': value.getHours(), // 小时
        'm+': value.getMinutes(), // 分
        's+': value.getSeconds(), // 秒
        'q+': Math.floor((value.getMonth() + 3) / 3), // 季度
        'S': value.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (value.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
      return fmt
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .finish_order {
    background: #F5F5F5;
  }
  .finish_top {
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .finish_top_time {
    width: 80px;
    display: flex;
    justify-content: center;
    position: relative;
  }
  .finish_top_time_area {
    height: 80px;
    border: 5px solid #0086ff;
    border-radius: 99px;
    width: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    margin: 10px 0;
  }
  .finish_tips {
    background: #00a9fe url("../assets/exclamation_mark@2x.png") no-repeat right;
    background-size: 16px 16px;
    background-position-x: 95%;
    font-size: 10px;
    border-radius: 4px;
    padding: 5px;
    padding-right: 25px;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .finish_tips2 {
    color: #2395ff;
    font-size: 10px;
    padding-top: 6px;
  }
  .finish_tips3 {
    font-weight: bold;
    font-size: 18px;
    padding-top: 15px;
  }
  .finish_buttons {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 24px;
  }
  .finish_button {
    width: 105px;
    height: 32px;
    border: 1px solid #d0d0d0;
    border-radius: 8px;
    color: #666666;
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .left {
    margin-right: 6px;
  }
  .right {
    margin-left: 6px;
  }
  .finish_luckyMoney {
    background: url("../assets/packet_icon@2x.png") no-repeat left;
    background-size: 16px 16px;
    background-position-x: 5%;
    font-size: 10px;

    margin-bottom: 12px;
    padding: 5px;
    padding-left: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .AD {
    margin: 8px;
    display: flex;
    justify-content: center;
  }
  .AD_img {
    height: 200px;
    margin: 8px;
  }
  .luckyMoney_popup {
    width: 100%;
    background: url("../assets/markbg@2x.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .luckyMoney_popup_title {
    padding-top: 50px;
    padding-bottom: 25px;
    color: #ffffff;
    font-size: 22px;
    font-weight: bold;
  }
  .luckyMoney_popup_amount {
    color: #fee991;
    font-size: 30px;
    padding-bottom: 10px;
  }
  .unit {
    font-size: 20px;
  }
  .luckyMoney_popup_tips {
    padding-bottom: 29px;
    font-size: 12px;
    color: #ffced1;
  }
  .luckyMoney_popup_button {
    font-size: 16px;
    height: 40px;
    width: 100px;
    margin-bottom: 15px;
    border: 1px solid #f5bd80;
    border-radius: 20px;
    color: #fee991;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
