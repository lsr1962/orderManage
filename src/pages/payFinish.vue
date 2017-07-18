<template>
  <div class="finish_order" ref="finish_order">
    <div class="finish_top">
      <div class="finish_top_time_area">
        <div style="color: #333333;font-size: 18px;font-weight: bold;">{{finish_time}}</div>
        <div style="color: #999999;font-size: 10px;">下单时间</div>
      </div>
      <div class="finish_tips">准时达订单</div>
      <div class="finish_tips2">{{deadline_time}}前未送达，可获得赔付</div>
      <div class="finish_tips3">商家正在备货</div>
      <div class="finish_buttons">
        <div class="finish_button left" @click="$router.push({name: 'orderList'})">查看订单</div>
        <div class="finish_button right" @click="$router.push({name: 'shopMain'})">商家首页</div>
      </div>
      <div class="finish_luckyMoney">发红包</div>
    </div>
    <div class="AD">
      <img class="AD_img" src="../assets/markbg@2x.png">
    </div>
    <mt-popup
      v-model="popupVisible"
      class="luckyMoney_popup"
      popup-transition="popup-fade">
      <div class="luckyMoney_popup_title">恭喜获得商家代金券</div>
      <div class="luckyMoney_popup_amount"><span class="unit">￥</span>{{luckyMoney_amount}}</div>
      <div class="luckyMoney_popup_tips">限金百万烤鸭(丽泽路店)使用</div>
      <div class="luckyMoney_popup_button" @click="popupVisible = false">好的</div>
    </mt-popup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Popup } from 'mint-ui'
export default {
  name: 'shopMain',
  mounted () {
    if (this.orderInfo.orderId) {
      this.setOrderInfo({order: []})
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
      popupVisible: true,
      finish_time: this.dateFormat(new Date(), 'hh:mm'),
      deadline_time: this.dateFormat(new Date(new Date().setMinutes(new Date().getMinutes() + 15)), 'hh:mm'),
      luckyMoney_amount: 10
    }
  },
  computed: {
    ...mapGetters([
      'orderInfo'
    ])
  },
  methods: {
    ...mapActions([
      'setOrderInfo'
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
    margin-top: 24px;
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
