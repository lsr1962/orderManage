<template>
  <div>
    <div class="order_confirm" ref="order_confirm">
      <div class="order_confirm_top">
        <div class="title">
          <div class="title_line"></div>
          <div class="title_text">{{shopInfo.name}}</div>
          <div class="title_line"></div>
        </div>
        <div v-for="item in list" class="order_line">
          <div class="order_name">{{item.name}}</div>
          <div class="order_acount"><span class="unit">×</span>{{item.count}}</div>
          <div class="order_amount"><span class="unit">￥</span>{{(item.count * (item.price * 100)) / 100}}</div>
        </div>
        <div style="margin: 0 15px;border-bottom: 1px solid #eeeeee;">
          <div class="order_line" style="margin: 0">
            <div class="order_name reduce_icon" :class="'icon_' + discount.type">{{discount.name}}</div>
            <div class="order_acount"></div>
            <div class="order_amount reduce"><span class="unit">-￥</span>{{discount.reduce}}</div>
          </div>
          <div class="order_line" style="margin: 0" v-for="(item, key) in otherSalesList" :key="item.id" :class="{total_line: (key === (otherSalesList.length - 1))}">
            <div class="order_name reduce_icon" :class="'icon_' + item.type" >{{item.name}}</div>
            <div class="order_amount reduce"><span class="unit">￥</span>0</div>
          </div>
        </div>
        <div class="lucky_money_line" @click="popupVisible = true">
          <div class="lucky_money_line_text">红包</div>
          <div class="lucky_money_line_amount reduce isLink">
            <template v-if="luckyIndex === -1">
              <div v-if="luckyMoneyList.length === 0" class="noReadyCount">无可用优惠券</div>
              <div v-else class="hasReadyCount">{{luckyMoneyList.length}}个可用</div>
            </template>
            <template v-else>
              <div class="unit">-￥</div>
              <div>{{luckyMoney.reduce}}</div>
            </template>
          </div>
        </div>
        <div class="lucky_money_line total_line">
          <div class="discount_detail discount_icon">优惠说明</div>
          <div class="order_acount"></div>
          <div class="order_amount total_amount"><span class="unit2">小计￥</span><span class="total_amount">{{totalAmount}}</span></div>
        </div>
      </div>
      <div class="order_confirm_other">
        <div class="lucky_money_line" style="border-top: 0;">
          <div class="order_confirm_other_select">在线支付</div>
        </div>
        <div class="lucky_money_line total_line" @click="order_other = true">
          <div class="order_confirm_other_select other_Link">口味偏好/餐具份数</div>
        </div>
      </div>
    </div>
    <div class="shopMain_list_bottom_line2">
      <div class="shopMain_list_bottom_amount">
        <div>￥{{totalAmount}}</div>
        <div class="discount_display">已优惠{{parseFloat(discount.reduce) + parseFloat(luckyMoney.reduce)}}</div></div>
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
      <div class="no_luckyMoney" @click="chooseLukyMoney('', -1)">
        <div>不使用红包</div>
        <div class="no_select" :class="{isSelect: (luckyIndex === -1)}" style="height: 100%;width: 40%"></div>
      </div>
      <div class="luckyMoney_count">
        <div style="color: #757575">有&nbsp;&nbsp;<span style="color: #fe6251;">{{luckyMoneyList.length}}</span>&nbsp;&nbsp;个红包可用</div>
        <div class="luckyMoney_count_detail">红包说明</div>
      </div>
      <div v-for="(item, key) in luckyMoneyList" class="luckyMoney_list luckyMoney_main" @click="chooseLukyMoney(item, key)">
        <div class="order_name" style="width: 30%;text-align: center;color: #ff0034;font-size: 25px;display: flex;flex-direction: column;justify-content: center;align-items: center;">
          <div><span class="unit">￥</span>{{item.reduce}}</div>
          <div class="luckyMoney_name">{{item.name}}</div>
        </div>
        <div class="order_acount no_select" :class="{isSelect: (key === luckyIndex)}" style="width: 70%;text-align: left;padding-left: 15px;">
          <div style="color: #333333;font-weight: bold;">{{item.title}}</div>
          <div style="color: #666666;font-size: 12px;padding-top: 5px;">{{item.times}}</div>
        </div>
      </div>
    </mt-popup>
    <mt-popup
      v-model="order_other"
      class="discount"
      :modal="false"
      position="right">
      <mt-header style="fontSize: 20px;z-index: 9999" title="订单备注">
        <div slot="left" class="backBtn" @click="order_other = false"></div>
      </mt-header>
      <div class="taste_content">
        <div class="taste_title">口味偏好</div>
        <div class="taste_tags">
          <template v-for="(item, key) in mark.tags">
            <div v-if="!item.children" class="taste_tags_button" :class="{taste_tags_button_selected: item.selected}" @click="item.selected = !item.selected">
              {{item.name}}
            </div>
            <div v-else class="taste_tags_button no_padding">
              <template v-for="(childrenItem, childrenKey) in item.children" >
                <span class="taste_tags_children_button2" :class="{taste_tags_button_selected: (item.selected === childrenKey)}" @click="(item.selected === childrenKey ? (item.selected = false) : (item.selected = childrenKey))">{{childrenItem.preName}}{{item.name}}</span>
                <span v-if="childrenKey !== (item.children.length - 1)" class="divide_line"></span>
              </template>
            </div>
            <div class="divide_space"></div>
          </template>
        </div>
        <textarea v-model="mark.remark" class="taste_marks" rows="4" placeholder="请输入备注内容(可不填)" maxlength="50"></textarea>
        <div class="remark_tips">{{mark.remark.length}}/50</div>
      </div>
      <div class="customer_number">
        <div class="taste_title">餐具份数</div>
        <div class="customer_number_content">
          <div class="taste_tags_button2" style="flex: 0 0 auto" :class="{taste_tags_button_selected: (mark.number === 0)}" @click="mark.number = 0">无特殊要求</div>
          <div class="taste_tags_button2 no_padding" style="margin-left: 15px;overflow-x: auto;text-overflow: ellipsis; white-space: nowrap;">
            <div class="taste_tags_children_button2" style="padding: 5px 12px;" v-for="(item, key) in [1,2,3,4,5,6,7,8,9,10]" :class="{taste_tags_button_selected: (mark.number === item)}" @click="mark.number === item ? (mark.number = 0) : (mark.number = item)">
              <span>{{item}}</span>
              <span class="divide_line" style=" position: absolute;right: -1px;top: 5px;" v-if="key !== 9"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="other_confirm">
        <button class="other_confirm_button" @click="order_other = false">确定</button>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Popup, Header, Toast } from 'mint-ui'
export default {
  name: 'shopMain',
  mounted () {
    if (this.orderInfo.order) {
      this.list = this.orderInfo.order
      this.discount = this.orderInfo.discount
      this.otherSalesList = []
      this.shopInfo.salesList.forEach((val) => {
        if (val.type === 2 || val.type === 4) {
          this.otherSalesList.push(val)
        }
      })
      this.$http.post(this.$urlConfig.getCoupon, {data: this.userInfo}).then((data) => {
        var result = data.data
        if (parseInt(result.errcode) !== 0) {
          Toast(result.errmsg)
          return
        }
        this.luckyMoneyList = result.couponList
        var tmpTotalAmount = 0
        this.list.forEach((val) => {
          tmpTotalAmount += (val.count * (val.price * 100))
        })
        tmpTotalAmount = tmpTotalAmount / 100
        this.luckyMoneyList.forEach((val, key) => {
          if (tmpTotalAmount < val.gate) {
            this.luckyMoneyList.splice(key, 1)
          }
        })
      }).catch((e) => {
        console.log(e)
      })
    } else {
      this.$router.push({name: 'shopMain', query: this.$route.query})
    }

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
      order_other: false,
      otherSalesList: [],
      list: [],
      luckyMoneyList: [],
      discount: {},
      luckyIndex: -1,
      luckyMoney: {reduce: 0, title: '', name: ''},
      mark: {
        remark: '',
        number: 0,
        tags: [
          {name: '测试', selected: false},
          {
            name: '辣',
            selected: false,
            children: [
              {preName: '不要'},
              {preName: '少点'},
              {preName: '多点'}
            ]
          },
          {name: '不要香菜', selected: false},
          {name: '不要洋葱', selected: false},
          {name: '多点醋', selected: false},
          {name: '多点葱', selected: false}
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'orderInfo',
      'shopInfo'
    ]),
    totalAmount () {
      var tmpTotalAmount = 0
      this.list.forEach((val) => {
        tmpTotalAmount += (val.count * (val.price * 100))
      })
      tmpTotalAmount = tmpTotalAmount - (this.discount.reduce * 100) - (this.luckyMoney.reduce * 100)
      tmpTotalAmount = tmpTotalAmount / 100
      if (tmpTotalAmount < 0) {
        tmpTotalAmount = 0
      }
      this.orderInfo.totalAmount = tmpTotalAmount
      return tmpTotalAmount
    }
  },
  methods: {
    chooseLukyMoney (item, key) {
      if (key === -1) {
        this.popupVisible = false
        this.luckyIndex = -1
        this.luckyMoney = {reduce: 0, title: '', name: ''}
      } else {
        this.popupVisible = false
        this.luckyIndex = key
        this.luckyMoney = item
      }
    },
    pay () {
      this.orderInfo.mark = this.mark
      this.orderInfo.luckyMoney = this.luckyMoney
      var tags = []
      this.mark.tags.forEach((val) => {
        if (!val.children) {
          val.selected ? tags.push(val.name) : ''
        } else {
          val.children.forEach((val1, key) => {
            key === val.selected ? tags.push(val1.preName + val.name) : ''
          })
        }
      })
      tags = tags.join(',')
      this.$http.post(this.$urlConfig.createOrder, {
        data: this.userInfo,
        items: this.orderInfo.order,
        discount: this.orderInfo.discount,
        coupon: this.luckyMoney,
        remark: {
          remark: this.mark.remark,
          number: this.mark.number,
          tags: tags
        }
      }).then((data) => {
        var result = data.data
        if (parseInt(result.errcode) !== 0) {
          Toast(result.errmsg)
          return
        }
        this.orderInfo.orderList = result.orderList
        this.$router.push({name: 'payOrder', query: this.$route.query})
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .order_confirm {
    background: #F5F5F5;
    padding: 10px 8px;
    padding-bottom: 58px;
  }
  .order_confirm_top {
    background: #ffffff;
  }
  .order_confirm_other {
    background: #ffffff;
    margin-top: 10px;
  }
  .order_confirm_other_select {
    width: 100%;
  }
  .other_Link {
    padding-right: 25px;
    background: url('../assets/store@2x.png') no-repeat right;
    background-size: 15px 15px;
    display: flex;
    align-items: center;
    height: 50%;
  }
  .title {
    display: flex;
    justify-content: center;
    padding: 10px 15px;
  }
  .title_line {
    width: 100%;
    height: 5px;
    padding-bottom: 5px;
    border-top: 2px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    align-self: flex-end;
  }
  .title_text {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    flex: 0 0 auto;
    padding: 0 15px;
  }
  .order_line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #eeeeee;
    margin: 0 15px;
    color: #333333;
    padding: 10px 0;
  }
  .discount_line {
    padding-bottom: 10px;
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
    background-size: 16px 16px;
    padding-left: 20px;
  }
  .lucky_money_line {
    margin-top: 2px;
    margin-left: 15px;
    margin-right: 15px;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
  }
  .lucky_money_line_text {
    font-size: 15px;
    font-weight: bold;
  }
  .lucky_money_line_amount {
    font-size: 14px;
    text-align: right;
  }
  .isLink {
    padding-right: 25px;
    background: url('../assets/store@2x.png') no-repeat right;
    background-size: 15px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .total_line {
    border: 0;
  }
  .mark_line {
    border: 0;
    padding: 5px 0;
    min-height: 50px;
    height: auto;
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
    border: 1px solid #dddddd;
    font-size: 15px;
    margin: 10px 8px;
    height: 48px;
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
    border: 1px solid #dddddd;
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
  .luckyMoney_name {
    font-size: 12px;
    color: #666666;
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
  }
  .isSelect {
    background: #ffffff url('../assets/packet_radio@3x.png') no-repeat right;
    background-size: 24px 24px;
  }
  .mark_input {
    width: 70%;
    border: 1px solid #dddddd;
    border-radius: 8px;
    padding: 5px 5px;
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
  .taste_content {
    background: #ffffff;
    padding: 0 15px 15px 15px;
    position: relative;
  }
  .taste_title {
    color: #333333;
    font-weight: bold;
    padding: 14px 0;
    font-size: 15px;
  }
  .taste_tags {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
  .taste_tags_button {
    padding: 5px 10px;
    border: 1px solid #F2F2F2;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .taste_tags_button2 {
    padding: 5px 10px;
    border: 1px solid #F2F2F2;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .no_padding {
    padding: 0;
  }
  .taste_tags_children_button2 {
    border-radius: 4px;
    padding: 5px 10px;
    flex: 1 0 auto;
    text-align: center;
    display: inline-block;
    position: relative;
  }
  .taste_tags_button_selected {
    color: #ffffff;
    background: #2395FA;
  }
  .divide_line {
    border-left: 1px solid #F2F2F2;
    height: 16px;

  }
  .divide_space {
    width: 0;
  }
  .taste_marks {
    -webkit-appearance: none;
    width: 100%;
    border: 1px solid #F2F2F2;
    border-radius: 4px;
    background: #FAFAFA;
    padding: 5px;
  }
  .remark_tips {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  .customer_number {
    background: #ffffff;
    padding: 0 15px 15px 15px;
    margin-top: 15px;
  }
  .customer_number_content {
    display: flex;
    position: relative;
  }
  .other_confirm {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .other_confirm_button {
    border-radius: 4px;
    color: #ffffff;
    background: #00D762;
    width: 90%;
    font-size: 15px;
    height: 40px;
  }
  .noReadyCount {
    color: #c4c4c4;
    font-size: 12px;
  }
  .hasReadyCount {
    background: #ff5339;
    color: #ffffff;
    font-size: 12px;
    border-radius: 2px;
    padding: 0 2px;
  }
</style>
