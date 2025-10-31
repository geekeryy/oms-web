<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginWithOTP } from '@/api/auth'

const router = useRouter()

// 登录模式：'phone' - 手机号+验证码, 'direct-otp' - 直接OTP验证码
const loginMode = ref<'phone' | 'direct-otp'>('direct-otp')

// 登录步骤：1-输入手机号，2-输入验证码
const step = ref<1 | 2>(1)

// 表单数据
const phone = ref('')
const verifyCode = ref(['', '', '', '', '', ''])

// 倒计时
const countdown = ref(0)
const canResend = computed(() => countdown.value === 0)

// code输入框引用
const codeInputs = ref<HTMLInputElement[]>([])

// 验证手机号
const isPhoneValid = computed(() => {
  return /^1[3-9]\d{9}$/.test(phone.value)
})

// 切换登录模式
const switchLoginMode = () => {
  loginMode.value = loginMode.value === 'phone' ? 'direct-otp' : 'phone'
  // 重置状态
  step.value = 1
  phone.value = ''
  verifyCode.value = ['', '', '', '', '', '']
  countdown.value = 0
}

// 发送验证码
const sendVerifyCode = async () => {
  if (!isPhoneValid.value) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  try {
    // TODO 这里调用你的API发送验证码
    console.log('发送验证码到:', phone.value)
    
    ElMessage.success('验证码已发送')
    step.value = 2
    startCountdown()
  } catch (error) {
    ElMessage.error('验证码发送失败')
  }
}

// 重新发送验证码
const resendVerifyCode = async () => {
  if (!canResend.value) return
  
  try {
    if (loginMode.value === 'phone') {
      console.log('重新发送验证码到:', phone.value)
    } else {
        ElMessage.error('登录模式错误,请切换登录模式')
        return
    }
    ElMessage.success('验证码已重新发送')
    startCountdown()
    verifyCode.value = ['', '', '', '', '', '']
  } catch (error) {
    ElMessage.error('验证码发送失败')
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 返回上一步
const goBack = () => {
  step.value = 1
  verifyCode.value = ['', '', '', '', '', '']
}

// OTP输入处理
const handleOTPInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // 只允许输入数字
  if (!/^\d*$/.test(value)) {
    input.value = verifyCode.value[index] || ''
    return
  }

  verifyCode.value[index] = value

  // 自动跳转到下一个输入框
  if (value && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }

  // 如果所有输入框都填写完毕，自动提交
  if (verifyCode.value.every(code => code !== '')) {
    doLogin()
  }
}

// 处理退格键
const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !verifyCode.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
}

// 处理粘贴
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')
  
  digits.forEach((digit, index) => {
    if (index < 6) {
      verifyCode.value[index] = digit
    }
  })

  // 如果粘贴的是完整的6位验证码，自动验证
  if (digits.length === 6) {
    doLogin()
  }
}

// 登录加载状态
const loginLoading = ref(false)

// 验证验证码并登录
const doLogin = async () => {
  const code = verifyCode.value.join('')
  
  if (code.length !== 6) {
    ElMessage.warning('请输入完整的验证码')
    return
  }

  // 防止重复提交
  if (loginLoading.value) {
    return
  }

  loginLoading.value = true

  try {
    // 调用OTP登录API
    const response = await loginWithOTP(code)
    
    // 保存token
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('isAuthenticated', 'true')
      
      // 如果是手机号登录模式,保存手机号
      if (loginMode.value === 'phone') {
        localStorage.setItem('userPhone', phone.value)
      }
      
      ElMessage.success('登录成功')
      
      // 跳转到首页
      setTimeout(() => {
        router.push('/')
      }, 500)
    } else {
      ElMessage.error('登录失败')
    }
  } catch (error) {
    // 处理错误
    const errorMessage = error instanceof Error ? error.message : '验证码错误或已过期'
    ElMessage.error(errorMessage)
    
    // 清空验证码输入
    verifyCode.value = ['', '', '', '', '', '']
    
    // 聚焦到第一个输入框
    setTimeout(() => {
      codeInputs.value[0]?.focus()
    }, 100)
  } finally {
    loginLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo和标题 -->
      <div class="login-header">
        <div class="logo">
          <img src="/logo.jpg" alt="Logo" class="logo-img" />
        </div>
        <h1 class="title">欢迎登录</h1>
        <p class="subtitle">OMS管理系统</p>
      </div>

      <!-- 登录模式切换 -->
      <div class="mode-switch">
        <el-button
          :type="loginMode === 'direct-otp' ? 'primary' : ''"
          :text="loginMode !== 'direct-otp'"
          @click="switchLoginMode"
          class="mode-btn"
        >
          <el-icon><Key /></el-icon>
          OTP登录
        </el-button>
        <el-button
          :type="loginMode === 'phone' ? 'primary' : ''"
          :text="loginMode !== 'phone'"
          @click="switchLoginMode"
          class="mode-btn"
        >
          <el-icon><Phone /></el-icon>
          手机号登录
        </el-button>
        
      </div>

      <!-- 手机号登录模式 - 步骤1: 输入手机号 -->
      <div v-if="loginMode === 'phone' && step === 1" class="login-form">
        <div class="form-item">
          <el-input
            v-model="phone"
            placeholder="请输入手机号"
            size="large"
            maxlength="11"
            clearable
            @keyup.enter="sendVerifyCode"
          >
            <template #prefix>
              <el-icon><Phone /></el-icon>
            </template>
          </el-input>
        </div>

        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :disabled="!isPhoneValid"
          @click="sendVerifyCode"
        >
          获取验证码
        </el-button>

        <div class="tips">
          <el-icon><InfoFilled /></el-icon>
          <span>验证码将发送至您的手机</span>
        </div>
      </div>

      <!-- 手机号登录模式 - 步骤2: 输入验证码 -->
      <div v-if="loginMode === 'phone' && step === 2" class="login-form">
        <div class="phone-info">
          <span>验证码已发送至</span>
          <strong>{{ phone }}</strong>
          <el-button type="primary" link @click="goBack">
            <el-icon><Edit /></el-icon>
            修改
          </el-button>
        </div>

        <div class="form-item">
          <div class="verify-code-inputs">
            <input
                v-for="(code, index) in verifyCode"
              :key="index"
              :ref="(el) => (codeInputs[index] = el as HTMLInputElement)"
              v-model="verifyCode[index]"
              type="text"
              maxlength="1"
              class="verify-code-input"
              @input="handleOTPInput(index, $event)"
              @keydown="handleKeydown(index, $event)"
              @paste="handlePaste"
            />
          </div>
        </div>

        <div class="resend-section">
          <span v-if="!canResend" class="countdown">
            {{ countdown }}秒后可重新发送
          </span>
          <el-button
            v-else
            type="primary"
            link
            @click="resendVerifyCode"
          >
            重新发送验证码
          </el-button>
        </div>

        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :loading="loginLoading"
          :disabled="loginLoading"
          @click="doLogin"
        >
          {{ loginLoading ? '登录中...' : '登录' }}
        </el-button>
      </div>

      <!-- 直接OTP登录模式 -->
      <div v-if="loginMode === 'direct-otp'" class="login-form">
        <div class="form-item">
          <div class="verify-code-inputs">
            <input
              v-for="(code, index) in verifyCode"
              :key="index"
              :ref="(el) => (codeInputs[index] = el as HTMLInputElement)"
              v-model="verifyCode[index]"
              type="text"
              maxlength="1"
              class="verify-code-input"
              @input="handleOTPInput(index, $event)"
              @keydown="handleKeydown(index, $event)"
              @paste="handlePaste"
            />
          </div>

          <div class="tips">
            <el-icon><InfoFilled /></el-icon>
            <span>请输入OTP验证码</span>
          </div>

        </div>


      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  overflow: hidden;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.login-form {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 12px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  margin-top: 8px;
}

.mode-switch {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.mode-btn {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 12px;
  font-weight: 500;
}

.tips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  font-size: 13px;
  color: #909399;
}

.tips-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
}

.phone-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #606266;
}

.phone-info strong {
  color: #409EFF;
  font-weight: 600;
}

.verify-code-inputs {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.verify-code-input {
  width: 48px;
  height: 56px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  border: 2px solid #dcdfe6;
  border-radius: 12px;
  outline: none;
  transition: all 0.3s;
  background: #f5f7fa;
}

.verify-code-input:focus {
  border-color: #409EFF;
  background: white;
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.1);
}

.verify-code-input:not(:placeholder-shown) {
  border-color: #409EFF;
  background: white;
}

.resend-section {
  text-align: center;
  margin: 20px 0;
  min-height: 24px;
}

.countdown {
  font-size: 14px;
  color: #909399;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 24px;
  }

  .verify-code-input {
    width: 40px;
    height: 48px;
    font-size: 20px;
  }

  .verify-code-inputs {
    gap: 8px;
  }
}
</style>

