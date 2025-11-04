# 运维管理系统web端

## firebase hosting使用方法

```shell
# 初始化配置
firebase init hosting

# 创建站点
firebase hosting:sites:create SITE_ID

# 设置部署目标
firebase target:apply hosting TARGET_NAME SITE_ID


# 为每个站点配置target
{
  "hosting": {
      "target": "TARGET_NAME",
      "public": "dist",
      "rewrites": [...]
  }
}

# 本地测试
firebase emulators:start --only hosting:TARGET_NAME

# 预览
firebase hosting:channel:deploy CHANNEL_ID --only TARGET_NAME

# 部署
firebase deploy --only hosting:TARGET_NAME
```