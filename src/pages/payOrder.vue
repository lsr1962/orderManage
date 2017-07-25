<template>
  <div>
    <div class="pay_order" ref="pay_order">
      <div class="pay_order_top_section">
        <div class="pay_order_top">
          <div class="pay_order_top_text">支付剩余时间</div>
          <div class="pay_order_top_time" ref="remain_time">{{remain_time}}</div>
        </div>
        <div class="pay_order_name">
          <div class="pay_order_name_text">{{shopInfo.name}}</div>
          <div class="pay_order_name_amount"><span class="unit">￥</span>{{orderInfo.orderList ? orderInfo.orderList.TradeAmount : ''}}</div>
        </div>
      </div>
      <div class="choose_method">
        选择支付方式
      </div>
      <div class="pay_method_list">
        <div class="pay_method_list_item" v-for="(item, key) in pay_method_list" :key="item.name" v-if="(key !== 0 && pullDown) || (key === 0)"
              @click="choosePayMethod(item, key)">
          <img class="pay_method_list_item_icon" :src="item.img"/>
          <div class="pay_method_list_item_text">{{item.name}}</div>
          <div class="pay_method_list_item_right no_select" :class="{isSelect: (key === payIndex)}"></div>
        </div>
        <div class="pay_method_more" v-if="!pullDown" >
          <div class="pay_method_more_text" @click="pullDown = true">查看更多支付方式</div>
        </div>
      </div>
    </div>
    <div class="shopMain_list_bottom_line2" ref="pay_display_whole" @click="pay">
      <div class="shopMain_list_bottom_pay" ref="pay_display">确认支付<span class="unit">￥</span>{{orderInfo.orderList ? orderInfo.orderList.TradeAmount : ''}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Toast } from 'mint-ui'
export default {
  name: 'shopMain',
  mounted () {
    if (this.orderInfo.orderList) {
      this.now_time = new Date(this.orderInfo.orderList.startTime.replace(/-/g, '/'))
      var intervalFun = () => {
        this.now_time = new Date(this.now_time.setSeconds(this.now_time.getSeconds() + 1))
        this.remain_time = this.dateFormat(new Date(new Date(this.orderInfo.orderList.endTime.replace(/-/g, '/')).getTime() - this.now_time.getTime()), 'mm:ss')
        if (this.remain_time === '00:00') {
          this.$refs.pay_display.innerHTML = '重新下单'
          this.$refs.pay_display.style.background = '#595959'
          this.$refs.pay_display_whole.style.background = '#595959'
          this.$refs.remain_time.innerHTML = '订单已关闭'
          window.clearInterval(this.timer)
        }
      }
      intervalFun()
      this.timer = window.setInterval(intervalFun, 1000)
    } else {
      this.$router.push({name: 'shopMain', query: this.$route.query})
    }
    this.$refs.pay_order.style.height = (document.documentElement.clientHeight - this.$refs.pay_order.getBoundingClientRect().top) + 'px'
    this.$refs.pay_order.style.overflow = 'auto'
  },
  components: {
  },
  data () {
    return {
      timer: '',
      now_time: '',
      remain_time: '',
      shop_name: '店铺名称店铺名称',
      pullDown: true,
      payIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'shopInfo',
      'orderInfo'
    ]),
    pay_method_list () {
      if (this.isWeiXin() === 'wx') {
        return [
          {name: '微信', img: require('../assets/ico_weixinzhifu@1x.png'), payType: 1}
        ]
      } else {
        return [
          {name: '支付宝', img: require('../assets/ico_zhifubao@1x.png'), payType: 2}
        ]
      }
    }
  },
  methods: {
    ...mapActions([
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
    },
    choosePayMethod (item, key) {
      this.payIndex = key
    },
    pay () {
      if (this.remain_time === '00:00') {
        this.$router.push({name: 'shopMain', query: this.$route.query})
      } else {
        this.$http.post('/order/doPay.html', {
          data: this.userInfo,
          order: {
            OrderId: this.orderInfo.orderList.OrderId,
            OrderNo: this.orderInfo.orderList.OrderNo,
            payType: this.pay_method_list[this.payIndex].payType
          }
        }).then((data) => {
          var result = data.data
          if (parseInt(result.errcode) !== 0) {
            Toast(result.errmsg)
            return
          }
          window.localStorage.setItem('yjiatech_menu', JSON.stringify([]))
          this.setOrderInfo({})
          window.location.href = result.pay_url
        }).catch((e) => {
          console.log(e)
        })
      }
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pay_order {
    background: #F5F5F5;
    padding-bottom: 48px;
  }
  .pay_order_top_section {
    background: #ffffff;
  }
  .pay_order_top {
    height: 90px;
    text-align: center;
    margin: 0 15px;
    border-bottom: 1px solid #eeeeee;
  }
  .pay_order_top_text {
    padding-top: 20px;
    color: #666666;
  }
  .pay_order_top_time {
    padding-top: 10px;
    color: #333333;
    font-size: 24px;
    font-weight: bold;
  }
  .pay_order_name {
    padding: 0 15px;
    color: #333333;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
  }
  .pay_order_name_text {
    font-size: 15px;
  }
  .pay_order_name_amount {
    color: #ff5339;
    font-size: 16px;
  }
  .unit {
  }
  .choose_method {
    padding: 10px 16px;
    color: #6d6d72;
  }
  .pay_method_list {
    border-top: 1px solid #eeeeee;
  }
  .pay_method_list_item {
    display: flex;
    padding: 10px 15px;
    height: 53px;
    border-bottom: 1px solid #eeeeee;
    background: #ffffff;
  }
  .pay_method_list_item_icon {
    flex: 0 0 auto;
    padding-left: 7px;
    padding-right: 22px;
  }
  .pay_method_list_item_text {
    flex: 1;
    font-size: 15px;
    color: #333333;
    align-self: center;
  }
  .pay_method_list_item_right {
    flex: 1;
  }
  .pay_method_more {
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffff;
  }
  .pay_method_more_text {
    background: url("../assets/packup.png") no-repeat;
    background-position: right;
    background-size: contain;
    padding-right: 20px;
    color: #666666;
    font-size: 12px;
  }
  .no_select {
    background: #ffffff url('../assets/packet_radio_grey@3x.png') no-repeat right;
    background-size: 24px 24px;
    background-position-x: 98%;
  }
  .isSelect {
    background: #ffffff url('../assets/packet_radio@3x.png') no-repeat right;
    background-size: 24px 24px;
    background-position-x: 98%;
  }
  .shopMain_list_bottom_line2 {
    height: 48px;
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #00D762;
    color: #FFFFFF;
    font-weight: bold;
    z-index: 1999;
  }
  .shopMain_list_bottom_pay {
    font-size: 16px;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
