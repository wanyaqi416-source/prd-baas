# Design QA

- Reference: `C:/Users/Administrator/AppData/Local/Temp/codex-clipboard-afbede6f-9f71-43ea-9616-f44543123c9d.png`
- Prototype: `/admin/product-manual/recommended-articles-prototype`
- Compared state: 新增/编辑文章弹窗与首页推荐替换确认
- Comparison viewport: 1009 x 1243

## Visual Comparison

- 弹窗采用单一纵向内容流，所有表单区块等宽向下排列。
- 弹窗宽度、顶部间距、圆角、遮罩和内部滚动方式与参考图一致。
- 展示设置、封面图片、文章信息、文章正文按区块顺序展示。
- 已移除右侧发布栏和客户端卡片预览，不存在顶层左右分栏。
- 弹窗内部可纵向滚动，页面本身无横向溢出。
- 标题栏与底部操作区固定，长表单滚动时保存操作保持可用。

- 「展示设置」位于弹窗首个配置区块；新增和编辑不提供发布字段，上架与下架统一在列表操作。
- 列表不再展示“当前首页热门推荐”提示区域，筛选区后直接进入文章表格。
- 展示位置实时显示特色推荐 `3 / 3`、首页热门推荐 `1 / 1` 的占用数量。
- 特色推荐满额时，新文章选项置灰并展示明确提示；编辑原本属于特色推荐的文章时仍保持选中并可保存。
- 特色推荐排序仅在勾选特色推荐时展示，选项限制为 `1`、`2`、`3`。
- 首页热门推荐被占用时弹出二次确认，确认后才替换原文章；取消不会改变当前选择。
- 保存与列表上架操作均再次校验推荐位容量，满额时保持原状态并展示错误信息。
- 列表上架或下架成功后不再展示右上角成功提示，容量校验失败提示仍保留。

## Severity Check

- P0: none
- P1: none
- P2: none
- P3: none

final result: passed

## Client Recommendation Article Interaction

- Prototype home: `/admin/product-manual/recommended-articles-prototype/client`
- Fund page: `/admin/product-manual/recommended-articles-prototype/client/funds`
- Article detail: `/admin/product-manual/recommended-articles-prototype/client/articles/:articleId`
- Verified viewport: `1280px`; document width `1265px`, no horizontal overflow.

### Interaction Verification

- The admin list and client recommendation surfaces share one article state keyed by unique `articleId`.
- The homepage hot recommendation renders the published article assigned to `home`.
- The fund page renders up to three published `featured` articles in configured sort order.
- Clicking the homepage card, fund card, or visible CTA copy opens the shared detail route for that `articleId`.
- `ARTICLE-001` opens the same detail URL from both homepage and fund recommendation positions.
- The detail page renders the configured cover image, English title, summary, and rich-text body.
- Direct access to unpublished `ARTICLE-004` shows an unavailable state instead of article content.
- Unpublishing a featured article in admin immediately removes it from the fund page and updates the count from `3 / 3` to `2 / 3` without duplicating article pages.
- Browser console contains no application errors; only Vite connection and React DevTools informational messages were present.

final result: passed
