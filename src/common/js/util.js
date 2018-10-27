var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

export default {
    getQueryStringByName: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    formatDate: {


        format: function (date, pattern) {
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                    case 'y': return padding(date.getFullYear(), $0.length);
                    case 'M': return padding(date.getMonth() + 1, $0.length);
                    case 'd': return padding(date.getDate(), $0.length);
                    case 'w': return date.getDay() + 1;
                    case 'h': return padding(date.getHours(), $0.length);
                    case 'm': return padding(date.getMinutes(), $0.length);
                    case 's': return padding(date.getSeconds(), $0.length);
                }
            });
        },
        parse: function (dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP);
            var matchs2 = dateString.match(/(\d)+/g);
            if (matchs1.length == matchs2.length) {
                var _date = new Date(1970, 0, 1);
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i]);
                    var sign = matchs1[i];
                    switch (sign.charAt(0)) {
                        case 'y': _date.setFullYear(_int); break;
                        case 'M': _date.setMonth(_int - 1); break;
                        case 'd': _date.setDate(_int); break;
                        case 'h': _date.setHours(_int); break;
                        case 'm': _date.setMinutes(_int); break;
                        case 's': _date.setSeconds(_int); break;
                    }
                }
                return _date;
            }
            return null;
        }

    },
    formatTime: function(time, format) {
        if (!time) {
            return '';
        }
        if (typeof time === 'string') {
            time = time.toString().replace(/-/g, '/'); // ios下new Date(2016-10-31)报错:invalid date...要改为: 2016/10/31样式
        }
        if (typeof time === 'number' && (time.toString().length) === 10) {
            time = parseInt(time + '000');
        }
        // 过去
        var stamp = new Date(time),
            cur = new Date(),
            year = stamp.getFullYear(),
            month = (stamp.getMonth() + 1) > 9 ? (stamp.getMonth() + 1) : '0' + (stamp.getMonth() + 1),
            day = stamp.getDate() > 9 ? stamp.getDate() : '0' + stamp.getDate(),
            hour = stamp.getHours() > 9 ? stamp.getHours() : '0' + stamp.getHours(),
            minute = stamp.getMinutes() > 9 ? stamp.getMinutes() : '0' + stamp.getMinutes(),
            sec = stamp.getSeconds() > 9 ? stamp.getSeconds() : '0' + stamp.getSeconds(),
            ms = stamp.getMilliseconds() < 100 ? '0' + (stamp.getMilliseconds() < 10 ? '0' + stamp.getMilliseconds() : stamp.getMilliseconds()) : stamp.getMilliseconds(),
            weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            week = weeks[stamp.getDay()];
        if (format) {
            format = format.replace('yyyy', year);
            format = format.replace('MM', month);
            format = format.replace('dd', day);
            format = format.replace('hh', hour);
            format = format.replace('mm', minute);
            format = format.replace('ss', sec);
            format = format.replace('ms', ms);

            if (year === cur.getFullYear() && stamp.getMonth() === cur.getMonth() && stamp.getDate() === cur.getDate()) {
                week = '今天';
            }
            format = format.replace('week', week);
        } else {
            format = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        }

        return format;
    },
    strToStamp: function(timeStr){
        return new Date(timeStr).getTime();
    },
    setCookie(account, password, expireDays, rememberFlag) {
        let now = new Date();
        now.setTime(now.getTime() + 24*60*60*1000*expireDays);
        window.document.cookie="loginName" + "=" + account + ";path=/;expires=" + now.toGMTString();
        window.document.cookie="loginPassword" + "=" + password + ";path=/;expires=" + now.toGMTString();
        window.document.cookie="rememberFlag" + "=" + rememberFlag + ";path=/;expires=" + now.toGMTString();
    },
    getCookie:function () {
        var cookie = {
            rememberFlag: false,
            account: '',
            password: '',
        };
        if (document.cookie.length>0) {
            var arr=document.cookie.split('; ');
            for(var i=0;i<arr.length;i++){
                var arr2=arr[i].split('=');
                if(arr2[0]=='rememberFlag'){
                    cookie.rememberFlag=arr2[1] === 'TRUE' ? true : false;
                }else if(arr2[0]=='loginName'){
                    cookie.account=arr2[1];
                }else if(arr2[0]=='loginPassword'){
                    cookie.password=arr2[1];
                }
            }
        }
        return cookie;
    },
    clearCookie:function () {
        this.setCookie("", "", -1, 'FALSE');
    }
};
