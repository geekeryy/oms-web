<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import JwksConfig from '@/components/JwksConfig.vue'
import BLoginConfig from '@/components/BLoginConfig.vue'

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
        <JwksConfig v-if="currentContent === 'jwks'" />

        <!-- B端登录注册配置 -->
        <BLoginConfig v-if="currentContent === 'b-login'" />
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
}

/* 平滑过渡效果 */
* {
  transition: background-color 0.3s, color 0.3s;
}
</style>

