<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Key, Refresh, Delete, View } from '@element-plus/icons-vue'
import { getJWKSList, rotateKey, deleteKey, getKeyUsage, type JWKSKey, type KeyUsageRecord } from '@/api/jwks'

// jwks数据
const jwksData = ref<JWKSKey[]>([])
const loading = ref(false)

// 使用记录对话框
const usageDialogVisible = ref(false)
const currentKeyId = ref('')
const usageRecords = ref<KeyUsageRecord[]>([])
const usageLoading = ref(false)

// 查看公钥详情对话框
const detailDialogVisible = ref(false)
const currentKeyDetail = ref<JWKSKey | null>(null)

/**
 * 加载JWKS列表
 */
const loadJWKSList = async () => {
  loading.value = true
  try {
    const response = await getJWKSList()
    jwksData.value = response.data || []
  } catch (error: any) {
    ElMessage.error(error.message || '加载JWKS列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 轮换公钥
 */
const handleRotate = async () => {
  try {
    await ElMessageBox.confirm('确定要生成新的公钥吗?', '轮换公钥', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })

    loading.value = true
    await rotateKey()
    ElMessage.success('公钥轮换成功')
    await loadJWKSList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '公钥轮换失败')
    }
  } finally {
    loading.value = false
  }
}

/**
 * 删除公钥
 */
const handleDelete = async (row: JWKSKey) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除密钥 ${row.kid} 吗?删除后无法恢复!`,
      '删除公钥',
      {
        type: 'error',
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
      }
    )

    loading.value = true
    await deleteKey(row.kid)
    ElMessage.success('删除成功')
    await loadJWKSList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  } finally {
    loading.value = false
  }
}

/**
 * 查看公钥详情
 */
const handleViewDetail = (row: JWKSKey) => {
  currentKeyDetail.value = row
  detailDialogVisible.value = true
}

/**
 * 查看使用记录
 */
const handleViewUsage = async (row: JWKSKey) => {
  currentKeyId.value = row.kid
  usageDialogVisible.value = true
  
  usageLoading.value = true
  try {
    const response = await getKeyUsage(row.kid)
    usageRecords.value = response.records || []
  } catch (error: any) {
    ElMessage.error(error.message || '加载使用记录失败')
    usageRecords.value = []
  } finally {
    usageLoading.value = false
  }
}

/**
 * 复制到剪贴板
 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadJWKSList()
})
</script>

<template>
  <div class="content-section">
    <div class="content-header">
      <h2 class="content-title">
        <el-icon :size="24" color="#409EFF"><Key /></el-icon>
        JWKS公钥管理
      </h2>
      <el-button 
        type="primary" 
        :icon="Refresh" 
        @click="handleRotate"
        :loading="loading"
      >
        轮换公钥
      </el-button>
    </div>
    
    <el-card shadow="never" class="content-card">
      <el-table 
        :data="jwksData" 
        style="width: 100%" 
        empty-text="暂无数据"
        v-loading="loading"
      >
        <el-table-column prop="kid" label="密钥ID (KID)" min-width="200" show-overflow-tooltip />
        <el-table-column prop="kty" label="密钥类型 (KTY)" min-width="120" />
        <el-table-column prop="alg" label="算法 (ALG)" min-width="100" />
        <el-table-column prop="crv" label="曲线 (CRV)" min-width="100" />
        <el-table-column prop="x" label="公钥 (X)" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tooltip :content="row.x" placement="top">
              <span class="truncate-text">{{ row.x }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              link 
              :icon="View"
              @click="handleViewDetail(row)"
            >
              查看详情
            </el-button>
            <el-button 
              type="success" 
              link 
              :icon="View"
              @click="handleViewUsage(row)"
            >
              使用记录
            </el-button>
            <el-button 
              type="danger" 
              link 
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 公钥详情对话框 -->
    <el-dialog 
      v-model="detailDialogVisible" 
      title="公钥详情" 
      width="600px"
      destroy-on-close
    >
      <div v-if="currentKeyDetail" class="key-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="密钥ID (KID)">
            <div class="detail-value">
              <span>{{ currentKeyDetail.kid }}</span>
              <el-button 
                type="primary" 
                link 
                size="small"
                @click="copyToClipboard(currentKeyDetail.kid)"
              >
                复制
              </el-button>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="密钥类型 (KTY)">
            {{ currentKeyDetail.kty }}
          </el-descriptions-item>
          <el-descriptions-item label="算法 (ALG)">
            {{ currentKeyDetail.alg }}
          </el-descriptions-item>
          <el-descriptions-item label="曲线 (CRV)">
            {{ currentKeyDetail.crv }}
          </el-descriptions-item>
          <el-descriptions-item label="公钥 (X)">
            <div class="detail-value">
              <span class="public-key-text">{{ currentKeyDetail.x }}</span>
              <el-button 
                type="primary" 
                link 
                size="small"
                @click="copyToClipboard(currentKeyDetail.x)"
              >
                复制
              </el-button>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 使用记录对话框 -->
    <el-dialog 
      v-model="usageDialogVisible" 
      title="公钥使用记录" 
      width="700px"
      destroy-on-close
    >
      <div class="usage-info">
        <p><strong>密钥ID:</strong> {{ currentKeyId }}</p>
      </div>
      <el-table 
        :data="usageRecords" 
        style="width: 100%"
        v-loading="usageLoading"
        empty-text="暂无使用记录"
      >
        <el-table-column prop="time" label="时间" min-width="180" />
        <el-table-column prop="count" label="使用次数" min-width="120">
          <template #default="{ row }">
            <el-tag type="success">{{ row.count }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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

/* 表格文本截断 */
.truncate-text {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

/* 公钥详情 */
.key-detail {
  padding: 8px 0;
}

.detail-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  word-break: break-all;
}

.public-key-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #606266;
  word-break: break-all;
}

/* 使用记录信息 */
.usage-info {
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.usage-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.usage-info strong {
  color: #303133;
  font-weight: 600;
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

  .truncate-text {
    max-width: 120px;
  }
}
</style>

