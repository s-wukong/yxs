#!/bin/sh

if ([ $1  = "mock" ] || [ $1 = "dev" ] || [ $1 = "qa" ] || [ $1 = "prod" ] || [ $1 = "local" ]); then
 echo "module.exports = '$1'" > ./config/env.js
else
  echo "参数只有: mock, dev, qa, prod 四种, 正确命令:'npm run env prod'"
fi
