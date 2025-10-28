<script setup lang="ts">
import { ref } from 'vue'

// B端登录注册配置表单
const configForm = ref({
  loginMethods: [],
  verificationMethod: '',
  passwordStrength: '',
  sessionTimeout: 30,
  allowMultiLogin: false
})
</script>

<template>
  <div class="content-section">
    <div class="content-header">
      <h2 class="content-title">
        <el-icon :size="24" color="#67C23A"><Setting /></el-icon>
        B端登录注册配置
      </h2>
      <el-button type="primary" :icon="'Plus'">添加配置</el-button>
    </div>
    
    <el-card shadow="never" class="content-card">
      <el-form :model="configForm" label-width="140px" label-position="left">
        <el-form-item label="登录方式">
          <el-checkbox-group v-model="configForm.loginMethods">
            <el-checkbox label="手机号登录" />
            <el-checkbox label="邮箱登录" />
            <el-checkbox label="第三方登录" />
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="注册验证方式">
          <el-radio-group v-model="configForm.verificationMethod">
            <el-radio label="短信验证" />
            <el-radio label="邮箱验证" />
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="密码强度要求">
          <el-select v-model="configForm.passwordStrength" placeholder="请选择">
            <el-option label="低（6位以上）" value="low" />
            <el-option label="中（8位以上，含字母数字）" value="medium" />
            <el-option label="高（10位以上，含字母数字特殊字符）" value="high" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="会话超时时间">
          <el-input-number v-model="configForm.sessionTimeout" :min="1" :max="1440" />
          <span style="margin-left: 8px; color: #909399;">分钟</span>
        </el-form-item>
        
        <el-form-item label="允许多端登录">
          <el-switch v-model="configForm.allowMultiLogin" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary">保存配置</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.content-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 4px;
}

.content-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.content-card {
  border-radius: 8px;
}

.content-card :deep(.el-card__body) {
  padding: 24px;
}

/* 表单样式优化 */
.content-card :deep(.el-form-item) {
  margin-bottom: 24px;
}

.content-card :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.content-card :deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-card :deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .content-title {
    font-size: 18px;
  }
}
</style>

