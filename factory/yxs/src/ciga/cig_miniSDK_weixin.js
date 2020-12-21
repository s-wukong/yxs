(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cigTracker = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const ENV = require('./env');

function genID () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
   
    var uuid = s.join("").replace(/-/g, "");
    return uuid
}

const getSessionId = () => {
    const kklt = ENV;
    var exp = kklt.getStorageSync('expiration');
    var now = new Date().getTime();
    var duration = 60 * 30 * 1000;
    if (!exp) {
      // 设置30分钟过期
      exp = now + duration;
      kklt.setStorageSync('expiration', exp);
      kklt.setStorageSync('sid', genID());
      kklt.setStorageSync('startTime', now);
    }
    // 过期后重置sid, exp
    if (now > exp) {
      exp = now + duration;
      kklt.setStorageSync('expiration', exp);
      kklt.setStorageSync('sid', genID());
      kklt.setStorageSync('startTime', now);
    }else{
      exp = now + duration;
      kklt.setStorageSync('expiration', exp);
    }
    return kklt.getStorageSync('sid');
}

function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("").replace(/-/g, "");
  return uuid;
}

function messageModel(cid, uid, sid, context, packet) {
  return {
    cid: cid, 
    uid: uid,
    sid: sid,
    context: context,
    packet: [packet]
  }
}

function messageContext(ln, lv, ref, ua) {
  return {
    ln: ln,
    lv: lv,
    ref: ref,
    ua: ua
  }
}

function messagePacket(vid, ts, status, size, data) {
  return {
    vid: vid,
    ts: ts,
    status: status,
    size: size,
    data: data
  }
}

const excludeSpecial = (s)=> {
  var reg = /\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g;
  var s = s.replace(reg, "");
  return s;
};

const assembleCigEvent = (uid, sid, cid, event_list, referrer, userAgent, dataSource) => {
  console.log('event_list', event_list);
  let event_data =  JSON.stringify(event_list);
  let now = new Date();
  let utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
  console.log('utc_timestamp', utc_timestamp);
  let p1 = messagePacket(uuid(), utc_timestamp, 0, 0, event_data);
  let context = messageContext(dataSource, '1.0.0', referrer, userAgent);
  let data = messageModel(cid, uid, sid, context, p1);
  return data;
}

module.exports = {
  getSessionId: getSessionId,
  assembleCigEvent: assembleCigEvent
}
},{"./env":2}],2:[function(require,module,exports){
exports = module.exports = wx

},{}]},{},[1])(1)
});
