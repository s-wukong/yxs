const temp = (content, initialState) => (
`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>研享社</title>
<meta content="yes" name="apple-touch-fullscreen">
<meta name="format-detection" content="telephone=no">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
<link rel="stylesheet" href="/style/app.css">
</head>
<body>
<div id="app" style="height: 100%"></div>
<script src="/library/react.js"></script>
<script src="/library/tools.js"></script>
<script src="/script/app.js"></script>
</body>
</html>`
)

module.exports = async (ctx, next) => {
  ctx.body = temp()
  await next()
}
