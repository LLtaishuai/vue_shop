<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="@/assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <div class="login_form">
                <!-- :model 绑定表单的数据对象 -->
                <!-- :rules 绑定表单的验证规则对象 -->
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px">
                    <!-- 用户名 -->
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 登录成功后保存服务端颁发的token, 存在会话级别的sessionStorage
        // 用编程式导航跳转的Home
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
        console.log(res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
    background: #2b4b6b;
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        box-shadow: 0 0 10px #ddd;
        background-color: #fff;
        padding: 10px;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
    }
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
