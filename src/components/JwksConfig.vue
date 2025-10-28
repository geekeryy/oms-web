<script setup lang="ts">
import { ref } from 'vue'

// jwks数据
const jwksData = ref([])
</script>

<template>
  <div class="content-section">
    <div class="content-header">
      <h2 class="content-title">
        <el-icon :size="24" color="#409EFF"><Key /></el-icon>
        jwks公钥管理
      </h2>
      <el-button type="primary" :icon="'Plus'">添加公钥</el-button>
    </div>
    
    <el-card shadow="never" class="content-card">
      <el-table :data="jwksData" style="width: 100%" empty-text="暂无数据">
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

