<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const userInfo = ref({
  phone: '138****8888',
  name: '用户'
})

// 菜单折叠状态
const isCollapse = ref(false)

// 当前激活的菜单
const activeMenu = ref('jwks')

// 当前显示的内容
const currentContent = ref('jwks')

// 从localStorage获取用户信息
onMounted(() => {
  const phone = localStorage.getItem('userPhone')
  if (phone) {
    // 隐藏中间4位
    const maskedPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    userInfo.value.phone = maskedPhone
  }
})

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 清除认证状态
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userPhone')
    
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 取消操作
  }
}

// 菜单选择事件
const handleMenuSelect = (key: string) => {
  activeMenu.value = key
  currentContent.value = key
}

// 切换菜单折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-content">
        <div class="header-left">
          <el-button 
            :icon="isCollapse ? 'Expand' : 'Fold'" 
            @click="toggleCollapse"
            circle
            class="collapse-btn"
          />
          <h1 class="system-title">
            <el-icon :size="32" color="#409EFF">
              <Platform />
            </el-icon>
            运维管理系统
          </h1>
        </div>
        <div class="user-section">
          <el-dropdown>
            <div class="user-info">
              <el-avatar :size="40" style="background-color: #409EFF">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userInfo.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <el-icon><Phone /></el-icon>
                  {{ userInfo.phone }}
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主体布局 -->
    <div class="layout-container">
      <!-- 左侧菜单 -->
      <div class="sidebar" :class="{ 'is-collapse': isCollapse }">
        <el-menu
          :default-active="activeMenu"
          :default-openeds="['1', '2']"
          :collapse="isCollapse"
          :collapse-transition="false"
          @select="handleMenuSelect"
          class="sidebar-menu"
        >
          <!-- 密钥管理 -->
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Key /></el-icon>
              <span>密钥管理</span>
            </template>
            <el-menu-item index="jwks">
              <el-icon><Document /></el-icon>
              <span>jwks公钥</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- 配置管理 -->
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>配置管理</span>
            </template>
            <el-menu-item index="b-login">
              <el-icon><UserFilled /></el-icon>
              <span>B端登录注册</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>

      <!-- 右侧内容区 -->
      <div class="main-content">
        <!-- JWKS公钥管理 -->
        <div v-if="currentContent === 'jwks'" class="content-section">
          <div class="content-header">
            <h2 class="content-title">
              <el-icon :size="24" color="#409EFF"><Key /></el-icon>
              jwks公钥管理
            </h2>
            <el-button type="primary" :icon="'Plus'">添加公钥</el-button>
          </div>
          
          <el-card shadow="never" class="content-card">
            <el-table :data="[]" style="width: 100%" empty-text="暂无数据">
              <el-table-column prop="kid" label="Key ID" min-width="150" />
              <el-table-column prop="kty" label="Key Type" min-width="100" />
              <el-table-column prop="alg" label="算法" min-width="100" />
              <el-table-column prop="use" label="用途" min-width="100" />
              <el-table-column prop="createTime" label="创建时间" min-width="180" />
              <el-table-column label="操作" width="180" fixed="right">
                <template #default>
                  <el-button type="primary" link :icon="'View'">查看</el-button>
                  <el-button type="warning" link :icon="'Edit'">编辑</el-button>
                  <el-button type="danger" link :icon="'Delete'">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>

        <!-- B端登录注册配置 -->
        <div v-if="currentContent === 'b-login'" class="content-section">
          <div class="content-header">
            <h2 class="content-title">
              <el-icon :size="24" color="#67C23A"><Setting /></el-icon>
              B端登录注册配置
            </h2>
            <el-button type="primary" :icon="'Plus'">添加配置</el-button>
          </div>
          
          <el-card shadow="never" class="content-card">
            <el-form label-width="140px" label-position="left">
              <el-form-item label="登录方式">
                <el-checkbox-group>
                  <el-checkbox label="手机号登录" />
                  <el-checkbox label="邮箱登录" />
                  <el-checkbox label="第三方登录" />
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="注册验证方式">
                <el-radio-group>
                  <el-radio label="短信验证" />
                  <el-radio label="邮箱验证" />
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="密码强度要求">
                <el-select placeholder="请选择">
                  <el-option label="低（6位以上）" value="low" />
                  <el-option label="中（8位以上，含字母数字）" value="medium" />
                  <el-option label="高（10位以上，含字母数字特殊字符）" value="high" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="会话超时时间">
                <el-input-number :min="1" :max="1440" />
                <span style="margin-left: 8px; color: #909399;">分钟</span>
              </el-form-item>
              
              <el-form-item label="允许多端登录">
                <el-switch />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary">保存配置</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* 顶部导航栏 */
.header {
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  transition: all 0.3s;
}

.system-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

/* 主体布局 */
.layout-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 250px;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  transition: width 0.3s;
  overflow-x: hidden;
}

.sidebar.is-collapse {
  width: 64px;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 250px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f5f7fa;
}

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
  .header {
    padding: 0 12px;
  }

  .header-left {
    gap: 8px;
  }

  .system-title {
    font-size: 16px;
  }

  .sidebar {
    width: 64px;
  }

  .sidebar.is-collapse {
    width: 0;
  }

  .main-content {
    padding: 16px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .content-title {
    font-size: 18px;
  }
}

/* 平滑过渡效果 */
* {
  transition: background-color 0.3s, color 0.3s;
}
</style>

