<template>
  <div>
    <div class="order_confirm" ref="order_confirm">
      <div class="order_confirm_top">
        <div class="title">
          <div class="title_line"></div>
          <div class="title_text">{{shop_name}}</div>
          <div class="title_line"></div>
        </div>
        <div v-for="item in list" class="order_line">
          <div class="order_name">{{item.name}}</div>
          <div class="order_acount"><span class="unit">×</span>{{item.count}}</div>
          <div class="order_amount"><span class="unit">￥</span>{{item.count * item.price}}</div>
        </div>
        <div class="order_line" style="border-bottom: 1px solid #eeeeee;">
          <div class="order_name reduce_icon">满减优惠</div>
          <div class="order_acount"></div>
          <div class="order_amount reduce"><span class="unit">-￥</span>{{discount}}</div>
        </div>
        <div class="lucky_money_line" @click="popupVisible = true">
          <div class="order_name">红包</div>
          <div class="order_acount"></div>
          <div class="order_amount reduce isLink">
            <div v-if="luckyMoneyText" class="luckyMoneyText">{{luckyMoneyText}}</div>
            <div class="unit">-￥</div>
            <div>{{luckyMoney}}</div>
          </div>
        </div>
        <div class="lucky_money_line total_line">
          <div class="discount_detail discount_icon">优惠说明</div>
          <div class="order_acount"></div>
          <div class="order_amount total_amount"><span class="unit2">小计￥</span><span class="total_amount">{{totalAmount}}</span></div>
        </div>
      </div>
    </div>
    <div class="shopMain_list_bottom_line2">
      <div class="shopMain_list_bottom_amount">
        <div>￥{{totalAmount}}</div>
        <div class="discount_display">已优惠{{discount + luckyMoney}}</div></div>
      <div class="shopMain_list_bottom_pay" @click="pay">去支付</div>
    </div>
    <mt-popup
      v-model="popupVisible"
      class="discount"
      :modal="false"
      position="right">
      <mt-header style="fontSize: 20px;z-index: 9999" title="选择红包">
        <div slot="left" class="backBtn" @click="popupVisible = false"></div>
      </mt-header>
      <div class="no_luckyMoney no_select" :class="{isSelect: (luckyIndex === -1)}" @click="chooseLukyMoney('', -1)">
        不使用红包
      </div>
      <div class="luckyMoney_count">
        <div style="color: #757575">有<span style="color: #fe6251">{{luckyMoneyList.length}}</span>个红包可用</div>
        <div class="luckyMoney_count_detail">红包说明</div>
      </div>
      <div v-for="(item, key) in luckyMoneyList" class="luckyMoney_list luckyMoney_main no_select" :class="{isSelect: (key === luckyIndex)}" @click="chooseLukyMoney(item, key)">
        <div class="order_name" style="width: 25%;text-align: center;"><span class="unit">￥</span>{{item.amount}}</div>
        <div class="order_acount" style="width: 50%;text-align: left;"><div>{{item.name}}</div><div>{{item.startTime}}-{{item.endTime}}</div></div>
        <div class="order_amount"></div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Popup, Header } from 'mint-ui'
export default {
  name: 'shopMain',
  mounted () {
    this.list = this.$route.params.order
    this.discount = this.$route.params.discount
    this.luckyMoneyList.forEach((val, key) => {
      if ((new Date(val.startTime) > new Date()) || (new Date(val.endTime) < new Date())) {
        this.luckyMoneyList.splice(key, 1)
      }
    })
    this.$refs.order_confirm.style.height = (document.documentElement.clientHeight - this.$refs.order_confirm.getBoundingClientRect().top) + 'px'
    this.$refs.order_confirm.style.overflow = 'auto'
  },
  components: {
    [Popup.name]: Popup,
    [Header.name]: Header
  },
  data () {
    return {
      popupVisible: false,
      shop_name: '店铺名称店铺名称',
      list: [],
      luckyMoneyList: [
        {name: '超级会员专享', amount: 15, startTime: '2017-07-01', endTime: '2017-07-31'},
        {name: '超级会员专享', amount: 5, startTime: '2017-06-01', endTime: '2017-08-31'},
        {name: '超级会员专享', amount: 20, startTime: '2017-06-01', endTime: '2017-07-01'}
      ],
      discount: 0,
      luckyIndex: -1,
      luckyMoney: 0,
      luckyMoneyText: ''
    }
  },
  computed: {
    totalAmount () {
      var tmpTotalAmount = 0
      this.list.forEach((val) => {
        tmpTotalAmount += val.count * val.price
      })
      tmpTotalAmount = tmpTotalAmount - this.discount - this.luckyMoney
      if (tmpTotalAmount < 0) {
        tmpTotalAmount = 0
      }
      return tmpTotalAmount
    }
  },
  methods: {
    chooseLukyMoney (item, key) {
      if (key === -1) {
        this.popupVisible = false
        this.luckyIndex = -1
        this.luckyMoney = 0
        this.luckyMoneyText = ''
      } else {
        this.popupVisible = false
        this.luckyIndex = key
        this.luckyMoney = item.amount
        this.luckyMoneyText = item.name
      }
    },
    pay () {}
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .order_confirm {
    background: #F5F5F5;
    padding: 10px 8px;
    padding-bottom: 48px;
  }
  .order_confirm_top {
    background: #ffffff;
  }
  .title {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
  }
  .title_line {
    width: 20%;
    height: 5px;
    padding-bottom: 5px;
    border-top: 2px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    align-self: flex-end;
    margin: 0 10px;
  }
  .title_text {
    color: #333333;
    font-size: 15px;
    font-weight: bold;
  }
  .order_line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #eeeeee;
    height: 40px;
    margin: 0 21px;
    color: #333333;
  }
  .order_name {
    font-size: 15px;
    width: 60%;
  }
  .order_acount {
    font-size: 14px;
    width: 15%;
    text-align: right;
  }
  .order_amount {
    font-size: 14px;
    width: 25%;
    text-align: right;
  }
  .unit {
    font-size: 12px;
  }
  .unit2 {
    font-size: 14px;
  }
  .total_amount {
    font-size: 18px;
  }
  .reduce {
    color: #ff5339;
  }
  .reduce_icon {
    background: url("../assets/reduce.png") no-repeat;
    background-position: left;
    background-size: contain;
    padding-left: 25px;
  }
  .lucky_money_line {
    margin-top: 2px;
    margin-left: 21px;
    margin-right: 21px;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
  }
  .isLink {
    padding-right: 25px;
    background: url('../assets/store@2x.png') no-repeat right;
    background-size: contain;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 70%;
  }
  .total_line {
    border: 0;
  }
  .discount_detail {
    font-size: 12px;
    color: #999999;
  }
  .discount_icon {
    padding-right: 20px;
    background: url('../assets/why.png') no-repeat right;
    background-size: contain;
  }
  .discount {
    width: 100%;
    height: 100%;
    background: #F5F5F5;
  }
  .no_luckyMoney {
    margin: 10px 8px;
    height: 40px;
    background: #ffffff;
    display: flex;
    padding: 0 15px;
    align-items: center;
    justify-content: space-between;
  }
  .luckyMoney_count {
    margin: 10px 8px;
    height: 20px;
    display: flex;
    padding: 0 15px;
    align-items: center;
    justify-content: space-between;
  }
  .luckyMoney_count_detail {
    color: #0b9aff;
    padding-left: 15px;
    background: url('../assets/packet_problem@3x.png') no-repeat left;
    background-size: 12px 12px;
  }
  .luckyMoney_main {
    margin: 10px 8px;
    background: #ffffff;
  }
  .luckyMoney_list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 92px;
    padding: 0 15px;
  }
  .luckyMoneyText {
    height: 120%;
    font-size: 12px;
    border-radius: 4px;
    background: #d7c56f;
    color: #ffffff;
    padding: 5px;
    margin-right: 10px;
  }
  .shopMain_list_bottom_line2 {
    height: 48px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #1b251f;
    color: #FFFFFF;
    font-weight: bold;
    z-index: 1999;
  }
  .shopMain_list_bottom_amount {
    padding-left: 20px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
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
  .discount_display {
    margin-left: 10px;
    padding-left: 10px;
    border-left: 1px solid #aaaaaa;
    color: #aaaaaa;
    font-size: 15px;
  }
  .backBtn {
    background: url(../assets/btn_back@2x.png) no-repeat;
    background-size: 11px 18px;
    background-position: center left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 44px;
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
</style>
