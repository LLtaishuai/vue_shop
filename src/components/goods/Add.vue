<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        center
        show-icon
        >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="stepNum - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 商品添加form表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"  label-width="0px" label-position="top">
        <!-- tabs标签页 -->
        <el-tabs v-model="stepNum" :tab-position="'left'" @tab-click="tabsClick" :before-leave="beforeLeaveTab">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children'
                }"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyList" :label="item.attr_name"  :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="d" v-for="(d, i) in item.attr_vals" :key="i"  border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyList" :label="item.attr_name"  :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="uploadImgSuccess"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce">

            </quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="50%"
      >
      <img :src="picUrl" alt="" class="picbox">
    </el-dialog>
  </div>
</template>

<script>
import deepclone from '@/util/deepclone.js'
export default {
  created () {
    this.getCateList()
  },
  data () {
    return {
      stepNum: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类
        goods_cat: [],
        // 分类参数
        attrs: [],
        pics: [],
        goods_introduce: ''
      },
      // 表单检验规则
      addFormRules: {
        goods_name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      cateList: [],
      // 参数列表
      manyList: [],
      // 属性列表
      onlyList: [],
      dialogVisible: false,
      picUrl: ''
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('请求分类信息失败')
      }
      this.cateList = res.data
    },
    handleChange () {
      if (this.addForm.goods_cat.length < 3) {
        this.addForm.goods_cat = []
        this.$message.info('请选择三级分类')
      }
    },
    async tabsClick () {
      // 进入商品参数
      if (this.stepNum === '1') {
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyList = res.data
        console.log(this.manyList)
      }
      // 进入商品属性
      if (this.stepNum === '2') {
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取属性列表失败')
        }
        /* res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        }) */
        this.onlyList = res.data
        console.log(this.onlyList)
      }
    },
    beforeLeaveTab (activeName, oldActiveName) {
      if (this.addForm.goods_cat.length < 3 && oldActiveName === '0') {
        this.$message.info('请选择三级分类')
        return false
      }
    },
    uploadImgSuccess (response, file, fileList) {
      this.addForm.pics.push({ pic: response.data.tmp_path })
      this.$message.success('图片上传成功！')
    },
    handlePreview (file) {
      this.dialogVisible = true
      this.picUrl = file.url
    },
    handleRemove (file) {
      const imgpath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pic === imgpath)
      this.addForm.pics.splice(index, 1)
      this.$message.success('图片删除成功！')
    },
    addGoods () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请准确填写表单')
        }
        // 发送请求
        // const _addForm = JSON.parse(JSON.stringify(this.addForm))
        const _addForm = deepclone(this.addForm)
        _addForm.goods_cat = _addForm.goods_cat.join(',')
        this.manyList.forEach(item => {
          _addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          })
        })
        this.onlyList.forEach(item => {
          _addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        const { data: res } = await this.$http.post('goods', _addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功！')
        this.$router.push('/goods')
        console.log(_addForm)
      })
    }
  },
  computed: {
    headers () {
      return { Authorization: window.sessionStorage.getItem('token') }
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0;
}
.picbox {
  width: 100%;
}
.el-button {
  margin-top: 15px;
}
</style>
