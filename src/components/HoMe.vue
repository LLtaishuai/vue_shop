<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="@/assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <el-container class="content">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 菜单展开收缩按钮 -->
        <div class="toggle-button" @click="isCollapse = !isCollapse">|||</div>
        <!-- 侧边菜单 -->
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu :index="data.id + ''" v-for="data in menulist" :key="data.id">
            <template slot="title">
              <i :class="fontobj[data.id]"></i>
              <span>{{data.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + item.path" v-for="item in data.children" :key="item.id" @click="saveActiveState('/' + item.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      fontobj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activeIndex: ''
    }
  },
  created () {
    this.getMeunList()
    this.activeIndex = window.sessionStorage.getItem('activeIndex')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMeunList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
      // console.log(res)
    },
    // 保存被选中的二级菜单的index
    saveActiveState (activeIndex) {
      window.sessionStorage.setItem('activeIndex', activeIndex)
      this.activeIndex = activeIndex
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  color: #fff;
  line-height: 24px;
  letter-spacing: 3px;
  text-align: center;
  cursor: pointer;
  background-color: #4a5064;
}
.content{
   height: calc(100vh - 60px);
}
</style>
