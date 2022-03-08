<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="openAddCateDiglog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        class="treetable"
        >
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-circle-close" v-if="scope.row.cat_deleted === false" style="color: red"></i>
          <i class="el-icon-circle-check" v-else style="color: green"></i>
        </template>
        <template slot="sort" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0" type="success">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="info">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="handle" slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row)">编辑</el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCate(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 9]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateDialogClose"
      >
      <!-- 添加分类表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectCateValue"
            :options="parentCateList"
            :props="{
              expandTrigger: 'click',
              children: 'children',
              value: 'cat_id',
              label: 'cat_name',
              checkStrictly: true
            }"
            @change="handleChange"
            clearable
            ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  created () {
    this.getCateList()
  },
  data () {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'handle'
        }
      ],
      addCateDialogVisible: false,
      // 添加分类的表单数据
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类表单校验规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请添加分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类
      parentCateList: [],
      selectCateValue: []
    }
  },
  methods: {
    // 添加商品分类
    openAddCateDiglog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 请求商品分类信息
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('请求分类信息失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 请求父级商品分类信息
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('请求父级分类信息失败')
      }
      this.parentCateList = res.data
    },
    // 编辑分类
    editCate () {},
    // 删除分类
    delCate () {},
    // newPageSize
    handleSizeChange (newPagesize) {
      this.queryInfo.pagesize = newPagesize
      this.getCateList()
    },
    // newPagenum
    handleCurrentChange (newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getCateList()
    },
    handleChange () {
      if (this.selectCateValue.length) {
        this.addCateForm.cat_pid = this.selectCateValue[this.selectCateValue.length - 1]
        this.addCateForm.cat_level = this.selectCateValue.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请合法输入')
        }
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.getCateList()
        this.addCateDialogVisible = false
        this.$message.success('添加分类成功')
      })
    },
    addCateDialogClose () {
      this.$refs.addCateFormRef.resetFields()
      this.selectCateValue = []
    }
  }
}
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
