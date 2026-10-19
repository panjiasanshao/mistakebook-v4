# baseline

技术基线版本 2.0.0。Ionic React + TypeScript + Vite，Tailwind 3 本地编译；Capacitor 复用 Web。实际版本以 app/package.json 和 lockfile 为准，镜像身份以 manifest 为准。准备镜像包含 Node/npm/JDK/Android/Gradle 工具，全部项目运行/编译在该镜像内。项目新增依赖在同一环境内锁定并验证，工具不兼容交环境维护。Skill 更新不能自动改写项目基线。

读取 manifest.sourceDirectory 定位实际 package/lockfile/Compose，旧项目不限于 app。助手在首次实现前记录精确版本与所需 API 的可用证据；不根据最新官网示例临时升级框架/SDK。新依赖先核已有能力、兼容性及需要，再在同一镜像安装并锁定；Windows依赖不挂进Linux容器。

启动/构建从 Compose 根执行，显式核实际镜像和源码挂载。引擎停止恢复现有引擎；依赖失败查独立卷/平台模块；无法兼容才提出基线变更，保留原工程。运行方式和恢复规则见 workflow.md，本轮具体实现由助手写 spec。
