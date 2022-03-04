<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table
        :data="rolesList"
        border
        stripe
      >
        <!-- 列表展开项 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row v-for="(item1, i1) in props.row.children" :key="item1.id" :class="['el-bottom', i1 === 0 ? 'el-top' : '', 'VCenter' ]">
              <el-col :span="5" >
                <el-tag closable @close="delRightById(props.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="['el-top', i2 === 0 ? 'el-no-top' : '', 'VCenter' ]">
                  <el-col :span="10">
                    <el-tag type="info" closable @close="delRightById(props.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="14">
                    <el-tag type="warning"  v-for="(item3) in item2.children" :key="item3.id" closable @close="delRightById(props.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole(scope.row.id)">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRole(scope.row)">删除</el-button>
            <!-- 分配权限按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="openSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
      >
      <!-- 树形控件 -->
      <el-tree
        :data="rolesTreeList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="rolesTreeRefs"
        >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色列表
      rolesList: [],
      rolesTreeList: [],
      // 控制分配角色对话框显示
      setRightDialogVisible: false,
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: '',
      keys: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败')
      }
      this.rolesList = res.data
    },
    // 添加角色
    addRole () {},
    // 编辑角色
    editRole (id) {
      console.log(id)
    },
    // 删除角色
    delRole () {},
    // 根据ID删除权限
    async delRightById (role, id) {
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes === 'cancel') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      role.children = res.data
    },
    // 打开分配角色对话框
    async openSetRightDialog (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败')
      }
      this.rolesTreeList = res.data
      this.getLeafId(role, this.defKeys)
      this.setRightDialogVisible = true
      this.roleId = role.id
    },
    // 递归得到角色的所有三级权限的ID
    getLeafId (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafId(item, arr))
    },
    // 关闭分配角色对话框
    setRightDialogClose () {
      this.defKeys = []
    },
    // 给角色分配权限
    async setRoleRight () {
      this.keys = [
        ...this.$refs.rolesTreeRefs.getCheckedKeys(),
        ...this.$refs.rolesTreeRefs.getHalfCheckedKeys()
      ]
      const keyStr = this.keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keyStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-bottom {
  border-bottom: 1px solid rgba(192, 180, 180, 0.5);
}
.el-top {
  border-top: 1px solid rgba(192, 180, 180, 0.5);
}
.el-no-top {
  border-top: none;
}
.el-tag {
  margin: 5px 0;
}
.VCenter {
  display: flex;
  align-items: center;
}
</style>
