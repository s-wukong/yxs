(function() {
    'use strict';
    //getParams uid token reportId
    const getParams = ()=>{
      // const url = 'https://cigrs-dev.cigdata.cn/viewer.html?file=https://cigrs-cdn-dev.cigdata.cn/pdf/12.pdf?uid=72&token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvdjZ2XzQ2d0FZOVBkLXVab3pPbmZSODMtVUlnIiwiaWF0IjoxNjAzMTc4NDU3LCJleHAiOjE2MDU3NzA0NTd9.CA_pNhbgL2JfAIzbFVJ51cK2eFyW3phFyuM8uU3QenQ&reportId=1000037&isAuth=1';
      const url = window.location.href;
      let params = url.split('viewer.html?')[1].split('?')[1];
      let obj = {};
      let parr = params.split('&'); 
      for(let i of parr) {        
          let arr = i.split('=');
          obj[arr[0]] = arr[1];
      }
      // console.log(obj)
      return obj;
    }
    const urlParams = getParams();

    const axios = require('axios').default;
    axios.defaults.headers.common['Authorization'] = urlParams.token;
    const $ = require('jquery');
    // const domin = '/api';//本地dev
    const domin = ''; //prod 线上

    let reportData = {};
    let reportDownloadLink = '';
    //设置弹窗
    const setModal = (data) => {
      if(!data.ButtomStr) $('.anModalContentHintButtom').css('display','none');
      $('.anModalContent0 .pp').html(data.hintStr);
      $('.anModalContentHintButtom').html(data.ButtomStr);
      $('.anModal').addClass('showModal');
    }

    //设置底部弹窗
    const setModal_b = (str) => {
      $('.anModalContent0_b p').html(str);
      $('.anModal_b').addClass('showModal');
    }

    //判端微信百度抖音环境
    function isWX(){
      var ua = navigator.userAgent.toLowerCase();
      if(ua.includes("micromessenger") || ua.includes("toutiaomicroapp") || ua.includes("baiduboxapp")) {
          wx.miniProgram.getEnv((res)=>{
             if (res.miniprogram) {
                //  alert("在小程序里");
             } else {
                //  alert("不在小程序里");
             }
          })
      }else{
          setModal({
            hintStr:'请前往微信/抖音/百度小程序访问',
            ButtomStr:''
          })
          setTimeout(()=>{
            $('#mainContainer, .user-collect-bot').css('display','none');
          },3000)
      }
    }

    //设置图标状态  '.collectBtn'
    const setTabMode = (className, img) => {
      $(className).attr('src',`./yxs/yxs-imgs/${img}.png`)
    }

    //getReportInfo
    const getReportInfo = () => {
      axios.post(domin+'/report/findbyid',{
        reportId: urlParams.reportId,
        userId: urlParams.uid
      })
      .then(function (res){
          if(res.status === 200 && res.data.status === 200){
            reportData = res.data.data;
            // console.log('document.title',reportData.title)
            document.title = reportData.title;
            setTabMode('.collectBtn',reportData.isCollect?'hasFavorites':'favorites');//设置收藏图标状态
            console.log(reportData)
          }
      })
      .catch(function (error){
          console.log(error);
      });
    }

    function initPage(){
      isWX();
      getReportInfo();
    }
    initPage();
    
    const goLogin = () => {
      // console.log(11111)
      var ua = navigator.userAgent.toLowerCase();
      if(ua.includes("micromessenger")){
        wx.miniProgram.navigateTo({url: '/pages/user-login/index'})
      }
      if(ua.includes("baiduboxapp")){
        swan.webView.navigateTo({url: '/pages/user-login/index'})
      }
      if(ua.includes("toutiaomicroapp")){
        tt.miniProgram.navigateTo({url: '/pages/user-login/index'})
      }
    }

    // 收藏
    $('.user-collect-bot-left').click(function() {
      // if(reportData.isCollect) return;
      if(urlParams.isAuth != 1){
        goLogin();
        return;
      }
      axios.post(`${domin}/report/collect`,{
        reportId: urlParams.reportId,
        userId: urlParams.uid,
        isCollect: !reportData.isCollect
      })
      .then(function (res){
          if(res.status === 200  && res.data.status === 200){
            let isCol = res.data.data.isCollect;
            reportData.isCollect = isCol;
            setTabMode('.collectBtn',isCol?'hasFavorites':'favorites');
            showToast(isCol?'已收藏':'取消收藏')
          }else{
            showToast(reportData.isCollect?'取消收藏失败':'收藏失败')
          }
      })
      .catch(function (error){
          console.log(error);
      });
    })
    
    //下载
    $('.user-collect-bot-right').click(function(){
      // setModal({
      //   hintStr:"daskldak",
      //   ButtomStr:'去邀请'
      // })
      // setModal_b('data.data.downLink')
      // console.log
      if(urlParams.isAuth != 1){
        goLogin();
        return;
      }
      axios.post(`${domin}/report/download`,{
        reportId: urlParams.reportId,
        userId: urlParams.uid
      })
      .then(function (res){
          if(res.status === 200  && res.data.status === 200){
            //下载成功
            reportDownloadLink = res.data.data.downloadLink;
            setModal_b(res.data.data.downloadLink)
          }else{
            switch (res.data.status) {
              case 60301:
              case 60302:
                setModal({
                  hintStr:res.data.message,
                  ButtomStr:'去邀请'
                })
                break;
              case 60303: 
              case 40301:
                setModal({
                  hintStr:res.data.message
                })
                break;
            }
          }
      })
      .catch(function (error){
          console.log(error);
      });
    })
    
    //复制链接
    $('.anModalContentHintButtom_b').click(function(){
      const input = document.createElement('input');
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('value', reportDownloadLink);
      document.body.appendChild(input);
      input.focus();
      input.setSelectionRange(0, 9999);
      input.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        showToast('已复制成功')
        // console.log($('#anCopyLink').html());
      }
      document.body.removeChild(input);
    })

    //隐藏引导页
    $('.guidePage').click(function(){
      $('.guidePage').removeClass('showModal');
    })

    //弹窗关闭按钮
    $('.anModalCloseButtom').click(function(){
      $('.anModal').removeClass('showModal');
    })
    //弹窗关闭按钮
    $('.anModalCloseButtom_b').click(function(){
      $('.anModal_b').removeClass('showModal');
    })

    //点击去邀请
    $('.anModalContentHintButtom').click(function(){
      $('.anModal').removeClass('showModal');
      $('.guidePage').addClass('showModal');
    })
    //toast
    function showToast(str) {
      $('.anToastTxt').html(str);
      $('.anToast').removeClass('clearToast');
      setTimeout(()=>{
        $('.anToastTxt').html('');
        $('.anToast').addClass('clearToast');
      },1500)
    }
})();


