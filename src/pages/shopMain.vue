<template>
  <div class="shopMain">
    <div class="shopMain_top">
      <img class="shopMain_top_icon" src="../assets/default_log.png">
      <div class="shopMain_top_info">
        <div class="shopMain_top_info_name">{{shop_name}}</div>
        <div class="shopMain_top_info_intro">{{shop_intro}}</div>
        <div class="shopMain_top_info_tips">{{shop_tips}}</div>
      </div>
    </div>
    <div class="shopMain_sales">
      <div class="shopMain_sales_line" v-for="(item, key) in salesList" :key="item.id" v-if="(key !== 0 && pullDown) || (key === 0)">
        <div class="shopMain_sales_line_detail" >{{item.name}}</div>
        <div :class="button_type" v-if="key === 0" @click="toggleType">{{salesList.length}}个活动</div>
      </div>
    </div>
    <div class="shopMain_list">
      <div class="shopMain_list_title">商品</div>
      <div class="shopMain_list_total" ref="list_frame">
        <div class="shopMain_list_total_kind">
          <div v-for="(item, key) in kindList" :key="item.type" :class="'kind_item ' + (key === chosenKind ? 'chosen' : '')" @click="chosenKind = key">
            {{item.name}}
            <div class="kind_item_line" v-if="(key !== chosenKind) && ((key + 1) !== chosenKind)"></div>
            <mt-badge class="kind_item_badge" color="red" v-if="item.count > 0" size="small">{{item.count}}</mt-badge>
          </div>
        </div>
        <div class="shopMain_list_total_menu">
          <div v-for="(item, key) in menuList" :key="item.id" class="menu_item">
            <div class="menu_item_left">
              <img class="menu_item_left_img" :src="item.img || defaultImg"/>
            </div>
            <div class="menu_item_right">
              <div class="menu_item_right_title">{{item.name}}</div>
              <div class="menu_item_right_line">
                <div class="menu_item_right_line_left">￥{{item.price}}</div>
                <div class="menu_item_right_line_right">
                  <div v-if="item.count > 0" class="menu_item_right_line_right_button"  @click="modifyCount('del', item)">-</div>
                  <div v-if="item.count > 0" class="menu_item_right_line_right_count">{{item.count}}</div>
                  <div class="menu_item_right_line_right_button" @click="modifyCount('add', item)">+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="shopMain_list_bottom">
        <div class="shopMain_list_bottom_icon" @click="selected_menu.length > 0 ? (popupVisible = true) : ''">
          <mt-badge class="kind_item_badge" color="red" v-if="totalCount > 0" size="small">{{totalCount}}</mt-badge>
          <img class="kind_item_badge_img" :src="defaultImg"/>
        </div>
        <div class="shopMain_list_bottom_amount">￥{{totalAmount}}元</div>
        <div class="shopMain_list_bottom_pay">去结算</div>
      </div>
    </div>
    <mt-popup
      v-model="popupVisible"
      class="selected_detail"
      position="bottom">
      <div>
        <div class="bottom_detail_title">
          <div>已选商品</div>
          <div class="bottom_detail_clear" @click="clear"><img class="bottom_detail_clear_icon" src="../assets/clear.png"/>清空</div>
        </div>
        <div v-for="(item, key) in selected_menu" class="bottom_detail_item">
          <div>{{item.name}}</div>
          <div>{{item.price}}</div>
          <div v-if="item.count > 0" class="menu_item_right_line_right_button"  @click="modifyCount('del', item)">-</div>
          <div v-if="item.count > 0" class="menu_item_right_line_right_count">{{item.count}}</div>
          <div class="menu_item_right_line_right_button" @click="modifyCount('add', item)">+</div>
        </div>
        <div class="bottom_detail_tips"></div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Popup, Badge, PaletteButton } from 'mint-ui'
export default {
  name: 'shopMain',
  mounted () {
    this.resizeList()
    this.getCurrentMenuList(0)
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
      chosenKind: 0,
      totalCount: 0,
      totalAmount: 0,
      shop_name: '店铺名称店铺名称',
      shop_intro: '店铺介绍信息',
      shop_tips: '店铺提示信息',
      defaultImg: require('../assets/default_log.png'),
      salesList: [
        {id: '1', name: '满20减12'},
        {id: '2', name: '满100减20'},
        {id: '3', name: '满500减100'},
        {id: '4', name: '满1000减200'}
      ],
      kindList: [
        {type: '1', name: '热销', count: 0},
        {type: '2', name: '优惠', count: 0},
        {type: '3', name: '满20减12', count: 0},
        {type: '4', name: '折扣单品', count: 0},
        {type: '5', name: '折扣小食', count: 0},
        {type: '6', name: '折扣套餐', count: 0},
        {type: '7', name: '热菜', count: 0},
        {type: '8', name: '凉菜', count: 0},
        {type: '9', name: '汤粥', count: 0},
        {type: '10', name: '主食', count: 0},
        {type: '11', name: '饮料', count: 0}
      ],
      menuList: [],
      allMenuList: [
        {id: '1', kind: '1', name: '热销菜单1', img: '', price: 10, count: 0},
        {id: '2', kind: '1', name: '热销菜单2', img: '', price: 11, count: 0},
        {id: '3', kind: '1', name: '热销菜单3', img: '', price: 20, count: 0},
        {id: '4', kind: '1', name: '热销菜单4', img: '', price: 25, count: 0},
        {id: '5', kind: '2', name: '优惠菜单5', img: '', price: 100, count: 0},
        {id: '6', kind: '2', name: '优惠菜单6', img: '', price: 70, count: 0},
        {id: '7', kind: '3', name: '满20减12菜单7', img: '', price: 45, count: 0},
        {id: '8', kind: '3', name: '满20减12菜单8', img: '', price: 23, count: 0},
        {id: '9', kind: '3', name: '满20减12菜单9', img: '', price: 16, count: 0},
        {id: '10', kind: '3', name: '满20减12菜单10', img: '', price: 87, count: 0},
        {id: '11', kind: '3', name: '满20减12菜单11', img: '', price: 45, count: 0},
        {id: '12', kind: '3', name: '满20减12菜单12', img: '', price: 23, count: 0},
        {id: '13', kind: '3', name: '满20减12菜单13', img: '', price: 16, count: 0},
        {id: '14', kind: '1', name: '热销菜单14', img: '', price: 87, count: 0},
        {id: '15', kind: '1', name: '热销菜单15', img: '', price: 87, count: 0},
        {id: '16', kind: '1', name: '热销菜单16', img: '', price: 45, count: 0},
        {id: '17', kind: '1', name: '热销菜单17', img: '', price: 23, count: 0},
        {id: '18', kind: '1', name: '热销菜单18', img: '', price: 16, count: 0},
        {id: '19', kind: '1', name: '热销菜单19', img: '', price: 87, count: 0}
      ]
    }
  },
  computed: {
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
            val.count ++
          }
        })
        this.kindList.forEach((val) => {
          if (val.type === item.kind) {
            val.count ++
          }
        })
      } else {
        this.allMenuList.forEach((val) => {
          if (val.id === item.id) {
            val.count --
          }
        })
        this.kindList.forEach((val) => {
          if (val.type === item.kind) {
            val.count --
          }
        })
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
    }
  },
  watch: {
    selected_menu (newVal) {
      var tmpTotalCount = 0
      var tmpTotalAmount = 0
      newVal.forEach((val) => {
        tmpTotalCount += val.count
        tmpTotalAmount += val.count * val.price
      })
      this.totalCount = tmpTotalCount
      this.totalAmount = tmpTotalAmount
      if (newVal.length === 0) {
        this.popupVisible = false
      }
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
    height: 100%;
    display: flex;
    justify-content: center;
    font-size: 16px;
    color: #FFFFFF;
    text-align: left;
    background: #34A1FB;
    background-size: cover;
    padding-top: 15px;
  }
  .shopMain_top_icon {
    width: 60px;
    height: 60px;
    margin: 10px 15px;
    align-self: center;
  }
  .shopMain_top_info {
    width: 70%;
    padding: 10px 0 10px 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .shopMain_top_info_name {
    font-size: 20px;
    background: url("../assets/more.png") no-repeat;
    background-position: right;
    background-size: contain;
  }
  .shopMain_sales {
    font-size: 15px;
    padding: 15px 0;
  }
  .shopMain_sales_line {
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
  }
  .shopMain_sales_line_button1 {
    background: url("../assets/unfold.png") no-repeat;
    background-position: right;
    background-size: contain;
    padding-right: 20px;
  }
  .shopMain_sales_line_button2 {
    background: url("../assets/packup.png") no-repeat;
    background-position: right;
    background-size: contain;
    padding-right: 20px;
  }
  .shopMain_list {
    position: relative;
  }
  .shopMain_list_total {
    display: flex;
    justify-content: center;
    padding-bottom: 50px;
    border-top: 1px solid #34A1FB;
  }
  .shopMain_list_title {
    padding: 0 0 5px 15px;
    font-size: 20px;
    color: #34A1FB;
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
  .shopMain_list_bottom {
    height: 50px;
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #34A1FB;
    display: flex;
    justify-content: space-between;
    color: #FFFFFF;
  }
  .shopMain_list_bottom_icon {
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: relative;
    padding-left: 15px;
  }
  .shopMain_list_bottom_amount {
    font-size: 20px;
    align-self: center;
  }
  .shopMain_list_bottom_pay {
    font-size: 20px;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-self: center;
    height: 100%;
    background: #00D762;
  }
  .kind_item {
    font-size: 15px;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    background: #F8F8F8;
    position: relative;
  }
  .kind_item_line {
    position: absolute;
    bottom: 0;
    margin: auto 15%;
    width: 70%;
    height: 1px;
    background-color: #34A1FB;
    opacity: 0.3;
  }
  .kind_item_badge {
    position: absolute;
    top: 0;
    right: 0;
  }
  .kind_item_badge_img {
    height: 50px;
  }
  .chosen {
    background: #ffffff;
  }
  .menu_item {
    font-size: 15px;
    height: 100px;
    display: flex;
    justify-content: center;
    text-align: center;
    padding-bottom: 5px;
  }
  .menu_item_left {
    width: 30%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .menu_item_left_img {
    width: 100%;
  }
  .menu_item_right {
    width: 70%;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .menu_item_right_title {
    font-size: 20px;
    text-align: left;
  }
  .menu_item_right_line {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    color: #34A1FB;
  }
  .menu_item_right_line_left {
    align-self: center;
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
  }
  .menu_item_right_line_right_button {
    border-radius: 99px;
    background-color: #34A1FB;
    color: #FFFFFF;
    font-size: 15px;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-self: center;
    align-items: center;
    flex-direction: column;
  }
  .selected_detail {
    width: 100%;
    bottom: 50px;
  }
  .bottom_detail_title {
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    font-size: 20px;
    color: #34A1FB;
    background: #ECECEE;
    height: 45px;
    align-items: center;
  }
  .bottom_detail_clear {
    height: 100%;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bottom_detail_clear_icon {
    height: 50%;
    opacity: 0.5;
    padding-right: 10px;
  }
  .bottom_detail_item {
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
  }
  .bottom_detail_tips {
    background: #ECECEE;
    height: 15px;
  }
</style>
