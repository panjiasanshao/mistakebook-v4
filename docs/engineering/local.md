# local

本地 IndexedDB 通过 Repository 隔离。保持确认原型，检查实际热更新、持久保存、修改删除与失败输入保留。执行细节读 ai-coding-development/implementation/local.md。

先将本轮确认Canvas映射到现有组件/样式与Repository接口，再增量实现；不默认引入另一导航结构。启动/构建从Compose根运行，版本依实际package/lockfile，新增依赖在准备镜像内安装。页面没更新先核URL、端口、挂载及watch，不反复重建/清缓存掩盖原因。
