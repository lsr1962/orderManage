<template>
  <div>
    <div class="pay_order" ref="pay_order">
      <div class="pay_order_top_section">
        <div class="pay_order_top">
          <div class="pay_order_top_text">支付剩余时间</div>
          <div class="pay_order_top_time">{{remain_time}}</div>
        </div>
        <div class="pay_order_name">
          <div class="pay_order_name_text">{{shop_name}}</div>
          <div class="pay_order_name_amount"><span class="unit">￥</span>{{userInfo.totalAmount}}</div>
        </div>
      </div>
      <div class="choose_method">
        选择支付方式
      </div>
      <div class="pay_method_list">
        <div class="pay_method_list_item no_select" v-for="(item, key) in pay_method_list" :key="item.name" v-if="(key !== 0 && pullDown) || (key === 0)"
             :class="{isSelect: (key === payIndex)}" @click="choosePayMethod(item, key)">
          <img class="pay_method_list_item_icon" :src="item.img"/>
          <div class="pay_method_list_item_text">{{item.name}}</div>
        </div>
        <div class="pay_method_more" v-if="!pullDown" >
          <div class="pay_method_more_text" @click="pullDown = true">查看更多支付方式</div>
        </div>
      </div>
    </div>
    <div class="shopMain_list_bottom_line2" @click="pay">
      <div class="shopMain_list_bottom_pay">确认支付<span class="unit">￥</span>{{userInfo.totalAmount}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'shopMain',
  mounted () {
    if (this.userInfo.orderId) {

    } else {
      this.$router.push({name: 'shopMain'})
    }
    var intervalFun = () => {
      this.remain_time = this.dateFormat(new Date(this.deadLine.getTime() - new Date().getTime()), 'mm:ss')
      if (this.remain_time === '00:00') {
        window.clearInterval(this.timer)
      }
    }
    intervalFun()
    this.timer = window.setInterval(intervalFun, 1000)
    this.$refs.pay_order.style.height = (document.documentElement.clientHeight - this.$refs.pay_order.getBoundingClientRect().top) + 'px'
    this.$refs.pay_order.style.overflow = 'auto'
  },
  components: {
  },
  data () {
    return {
      timer: '',
      remain_time: '',
      deadLine: new Date(new Date().setMinutes(new Date().getMinutes() + 15)),
      shop_name: '店铺名称店铺名称',
      pay_method_list: [
        {name: '微信', img: require('../assets/ico_weixinzhifu@1x.png')},
        {name: '支付宝', img: require('../assets/ico_zhifubao@1x.png')},
        {name: 'QQ钱包', img: require('../assets/ico_QQ@1x.png')}
      ],
      pullDown: false,
      payIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
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
      window.localStorage.setItem('yjiatech_menu', JSON.stringify([]))
      this.$router.push({name: 'payFinish'})
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
  }
  .unit {
    padding: 0 10px;
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
    justify-content: flex-start;
    padding: 10px 16px;
    height: 53px;
    border-bottom: 1px solid #eeeeee;
  }
  .pay_method_list_item_icon {
    padding: 0 20px;
  }
  .pay_method_list_item_text {
    font-size: 15px;
    color: #333333;
    align-self: center;
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
    font-size: 17px;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
