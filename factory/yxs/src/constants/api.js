/**
 * NOTE HOST、HOST_M 是在 config 中通过 defineConstants 配置的
 * 只所以不在代码中直接引用，是因为 eslint 会报 no-undef 的错误，因此用如下方式处理
 */
/* eslint-disable */
export const host = HOST
/* eslint-enable */

// pdfjs
// export const PDFJS = `https://cigrs-dev.cigdata.cn/viewer.html`
// export const PDFJS = `https://cigrs-qa.cigdata.cn/viewer.html`
export const PDFJS = `https://cigrs.cigdata.cn/viewer.html`
export const API_HOME = `${host}/xhr/index/index.json`

//inx
//视频列表 GET
export const API_VEDIO_LIST = `${host}/video/findall`

//视频详情
export const API_VEDIO_DETAIL = `${host}/video/findbyid`
//视频观看统计播放量
export const API_VEDIO_VIEW = `${host}/video/view`
//视频评论
export const API_VEDIO_COMMENT_LIST = `${host}/video/findcommentsbyid`
//发送评论 
export const API_VEDIO_COMMENT_COMMIT = `${host}/video/addcomment`
//视频点赞 
export const API_VEDIO_GIVE_LIKE = `${host}/video/like`
//视频收藏与取消
export const API_VEDIO_COLLECT = `${host}/video/collect`
//视频分享 记录用户分享次数
export const API_VEDIO_SHARE = `${host}/video/share`
//搜集用户分享链接引流用户
export const API_VEDIO_GET_SHARE_USER = `${host}/xhr/index/index.json`

//database
//报告宣传 GET
export const API_WIKI_BANNER = `${host}/report/publicity`
//报告热推 GET
export const API_WIKI_HOT = `${host}/report/recommended`
//报告搜索 
export const API_WIKI_SEARCH = `${host}/report/search`
//报告详情 
export const API_WIKI_DETAIL = `${host}/report/findbyid`
//报告观看统计浏览量
export const API_WIKI_VIEW = `${host}/report/view`

/**
 *  webView
 */
//报告下载 
export const API_WIKI_DOWNLOAD = `${host}/report/download`
//报告分享 
export const API_WIKI_SHARE = `${host}/report/share`
//收藏
export const API_WIKI_COLLECT = `${host}/report/collect`


//user
//用户登录 
export const API_USER_LOGIN = `${host}/user/login`
//查询用户 
export const API_USER_FINDUSER = `${host}/user/finduserbyid`
//用户签到 
export const API_USER_SIGNIN = `${host}/user/signin`
//用户粒子明细 
export const API_USER_FINDSCORE = `${host}/user/findscorebyid`
//用户收藏列表 
export const API_USER_FINDCOLLECT = `${host}/user/findcollectbyid`
//用户邀请成功
export const API_USER_INVIT = `${host}/user/invitation/add`
//用户加经验
export const API_USER_ADDSCORE = `${host}/user/score/add`
//已下载报告列表
export const API_USER_DOWNLOADLIST = `${host}/user/finddownloadbyid`
//用户个人信息修改
export const API_USER_UPDATE = `${host}/user/updatebyid`
//验证用户token是否有效
export const API_USER_TOKEN = `${host}/user/token`