# 项目执行入口

开始/恢复先读 .ai-coding/project.json、services.json、docs/engineering/baseline.md 与 workflow.md、docs/progress/current.md。再按 manifest.designDirectory/specDirectory 定位本轮已确认 PRD/Canvas 和当前 spec；旧工程保留实际路径。机器私有接入来源见被忽略的 preparation.json/local.json，不依赖旧聊天，不扫描用户目录找秘密。

初始化/恢复调用 ai-coding-project，开发调用 ai-coding-development，Android 调用 ai-coding-android。服务失效分别调用 github/cloudbase/siliconflow 技能复查补缺。Skill 均在当前用户 .trae-cn/skills，不复制进项目。

按用户目标路由，不要求本人准确说技能名：“生成安卓版本/安装文件”就调用 ai-coding-android；“发布网页”先按本轮目标区分 github.io 原型展示与 CloudBase 正式作品。账号登录、管理授权、业务客户端身份分别处理。先查已有绑定和有效准备，只补缺项。

本地运行、Web 编译和 APK 构建统一使用 manifest/Compose 绑定的准备阶段镜像，不在宿主机安装项目工具链、不换 latest 或另建工具镜像。新准备采用 Podman CLI + 独立 Docker Compose，执行必须使用用户级 ai-coding-env/scripts/Course-Runtime.ps1 的受管 provider、显式 connection 和原镜像。已有 Docker/Podman 工程沿 manifest 原绑定，健康容器直接复用。

引擎未开先恢复已安装引擎和原 Compose；依赖错误先查卷、锁文件、Linux 平台模块，再在同一镜像修复。不能绕到宿主构建、重建工程、更换 appId/签名/remote，不能放宽 RLS/鉴权/TLS 或交旧包来绕过失败。恢复失败记录具体阻塞与下一步，避免无界重试。技术路线确需变更时说明原因、影响与替代方案，先核已有授权；普通配置修复不另索批准。

每轮先核对已确认 PRD/Canvas，助手维护技术 spec，再连续实现与实际检查，最后集中给本人试用。产品由本项目设计决定；仅明确选择案例才合并案例约束。保存方式、交互行为和限额参数按项目Spec确定，状态反馈及验收结论须有相应事实支持；通用方法读 ai-coding-development/implementation/efficient-execution.md，不把案例实现推广为公共要求。名称未定不阻塞初始化，补展示名不重建稳定标识。

中大型/跨端改动按 docs/specs/_template.md 维护目标、复用、实现顺序、不可变项、失败恢复与验收；小修复沿当前 spec/进度增量记录。确认过的材料直接实施，不重复设计审批。project/Compose/package/lockfile 是实际配置，规范/spec 是技术决定；冲突时保留工程、查差异并同步记录，不能拿旧文档覆盖现状。官方文档用于核接口，不能因示例不同擅自改选型。

本人只做需求取舍、必要登录/费用/位置决定和亲自试用；技术配置、测试、失败复现和记录由助手完成。服务配置、真实授权、模型调用、部署、构建、安装和本人试用分别留证，未验证不得说通过。

模型 Key/管理令牌仅在受保护凭证存储与服务端配置中使用，不进前端、Git、APK、镜像、打包或日志。发布 github.io 只用确认 HTML 和必要公开资源，腾讯云作品另验。

AI 沿本项目 callFunction→CloudBase 云函数→硅基流动 HTTPS 路线；模型/函数名来自本项目配置，不能切 CloudBase 内置 AI 或前端直连模型秘密。结束更新当前 spec 与 progress，分清准备、配置、运行、交付和本人试用，准确给出入口、当前动作和缺项。

AI 模型必须可配置：config/ai-models.defaults.json 提供初始 textModel/visionModel；运行时以服务端项目配置及 revision 为准。V4 在现有界面增加“设置 → AI 服务”，按用户级 ai-coding-development/implementation/model-settings.md 实施权限、验证、保存/恢复默认及网页/Android 同步。首次启用AI时生成默认文件；初始化已有明确AI需求可以接入，业务功能仍按本轮已确认PRD/Canvas实施。禁止把唯一有效模型写死在页面/APK或让业务请求随意传模型绕过配置；更换模型无需重打 APK。模型 ID 公开，API Key 仍只在受保护服务端使用。

## 2.1 执行与 AI 设置

项目运行、依赖安装/锁文件更新、测试和恢复通过用户级 ai-coding-env/scripts/Invoke-CourseProject.ps1；Android沿 Build-Android.ps1、发布沿现有专用入口，均使用项目绑定镜像。依赖损坏读取环境技能 references/project-execution.md，在同镜像原卷恢复，不宿主编译或临时拉镜像。

仅明确选择案例后合并业务；用户 Skill 已安装不代表选择案例。开始按当前 Skill assets/course-timing.json 说明估时，长等待和超时说明真实原因，不虚报通过。

AI本人注册/优惠/充值决定与程序配置按通用开发 Skill implementation/ai-service-setup.md；P-01先完成本地基础，再按本项目已确认需求接入能力，首次启用AI时再落默认文件和配置路线，V4由本人在“设置 → AI 服务”输入Key和模型，秘密仅服务端存储。模型有效配置/revision两端共享。


## 2.1.1 恢复与配置授权

缺本轮检查或故障时用环境Skill的Test-CourseReadiness一次定位实际绑定，已有标准命令当前结果直接接续；阶段开始/等待/结束用Update-CourseProgress保存具名Spec与接续，具体方法读development/implementation/efficient-execution.md。依赖或Node错误回同镜像Repair，不关闭engine约束。AI先按ai-settings-access.md验证后端PG身份，再落实项目已确认的配置编辑者。明确选定课堂案例后，指定课程用户可配置Key/模型和恢复默认，不另建管理员流程；其他身份仍由服务端拒绝，私有配置表不对浏览器开放。升级保留已有明确授权和有效配置。


按需能力：P-01先验本地底座，并按当前已确认需求接入能力；外部服务/Android/AI按本轮需求由项目Skill implementation/capability-activation.md接入。未启用项不作为缺项，未来计划留PRD/Spec。旧有效绑定与明确授权保留。


## 当前准备与项目接入分工（2.2.3）

环境准备完成本课程所需工具、云服务、GitHub、AI账号及必要授权并汇总；明确工具排障或缩小范围时才仅做该范围。项目初始化按当前已确认需求复用并接入能力，可在初始化时启用所需云服务/GitHub/AI；需求未明确时先建本地工程，不自动创建未来资源。AI Key在程序设置入口就绪后由本人填写；准备、接入、调用、发布和本人试用分别留证。

需求材料按 manifest 的真实路径定位；新文件推荐需求说明文档.md，已有 PRD.md / 需求说明.md 均接受，不自动改名或因名称不同重复设计。执行方法见 ai-coding-development/implementation/execution-route.md。
