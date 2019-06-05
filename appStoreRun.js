/**
*
* AppChecker.init(
*     "hancapMobile"
*   , "hancap"
*   , "kr.co.hankookcapital.m"
*   , "market://details?id="+this.packageName+"&hl=ko&rdid="+this.packageName
*   , "https://itunes.apple.com/kr/app/%ED%95%9C%EA%B5%AD%EC%BA%90%ED%94%BC%ED%83%88-%EB%AA%A8%EB%B0%94%EC%9D%BC/id1358958350?mt=8"
*   , "/ib20/mnu/HKMCOM050000"
*   , "MGPay"
* );
*
* //AppChecker.runApp(false,"http://www.naver.com");
* window.onload = function() {
*     AppChecker.init(
*         "hancapMobile"
*       , "hancap"
*       , "kr.co.hankookcapital.m"
*       , "market://details?id="+this.packageName+"&hl=ko&rdid="+this.packageName
*       , "https://itunes.apple.com/kr/app/%ED%95%9C%EA%B5%AD%EC%BA%90%ED%94%BC%ED%83%88-%EB%AA%A8%EB%B0%94%EC%9D%BC/id1358958350?mt=8"
*       , "/ib20/mnu/HKMCOM050000"
*       , "MGPay"
*     );
*
*     AppChecker.init(
*         "hancapMobile"
*       , "hancap"
*       , "kr.co.hankookcapital.m"
*       , "market://details?id="+this.packageName+"&hl=ko&rdid="+this.packageName
*       , "https://itunes.apple.com/kr/app/%ED%95%9C%EA%B5%AD%EC%BA%90%ED%94%BC%ED%83%88-%EB%AA%A8%EB%B0%94%EC%9D%BC/id1358958350?mt=8"
*       , "/ib20/mnu/HKMCOM050000"
*       , "MGPay"
*     );
*     document.getElementById("btnExec1").addEventListener("click",function() {
* //        alert('test');
*         AppChecker.runApp(true,"http://www.naver.com");
*     });
*
*     document.getElementById("btnExec2").addEventListener("click",function() {
* //        alert('test');
*         AppChecker.runApp(false,"http://www.naver.com");
*     });
* }
**/
var AppChecker = {
    urlSchemeName:null,
    urlHostName:null,
    packageName:null,
    googleMarketUrl:null,
    appleMarketUrl:null,
    fallbackUrl:null,
    appUserAgent:null,
    init:function(urlSchemeName,urlHostName,packageName,googleMarketUrl,appleMarketUrl,fallbackUrl,appUserAgent){
        this.urlSchemeName   = urlSchemeName  ;
        this.urlHostName     = urlHostName    ;
        this.packageName     = packageName    ;
        this.googleMarketUrl = googleMarketUrl;
        this.appleMarketUrl  = appleMarketUrl ;
        this.fallbackUrl     = fallbackUrl    ;
        this.appUserAgent    = appUserAgent   ;
        return this;
    },
    getAppType:function() {
        var phoneOS = "";
        var agent = navigator.userAgent;
        if(agent){
            var re = new RegExp(this.appUserAgent, 'i');
            if((agent.match(re))){
                if(agent.match(/IOS/i) || agent.match(/iPhone/i)){	// iOS
                    phoneOS = "I";
                }
                else if(agent.match(/ANDROID/i)){	// Android
                    phoneOS = "A";
                }
            }
            else{
                if(agent.match(/iPhone/i) || agent.match(/iPod/i)){
                    // iOS mobile
                    phoneOS = "MI";
                } else if(agent.match(/Android/i)){
                    // Android mobile
                    phoneOS = "MA";
                } else if( agent.match(/BlackBerry/i) ||
                   agent.match(/Windows CE/i) || agent.match(/SAMSUNG/i) ||
                   agent.match(/LG/i) || agent.match(/MOT/i) ||
                   agent.match(/SonyEricsson/i)){
                    phoneOS = "M";
                }else{
                    phoneOS = "X";
                }

            }
        }
        return phoneOS;
    },

    runApp:function(isRunApp,callBackUrl) {
        this.runAppResult = callBackUrl?{ "header":{ "api":"125" } , "body":{ "url":callBackUrl} }:{ "header":{ "api":"125" } , "body":{ "url":""} };
        this.iosScheme = this.urlSchemeName+"" + "://?"+JSON.stringify(this.runAppResult);
        this.androidScheme = "intent://"+this.urlHostName+"?" + JSON.stringify(this.runAppResult) + "#Intent;scheme="+this.urlSchemeName+";end";

        if(this.getAppType() == "MA"){
//            if( confirm("앱으로 이동하시겠습니까?") == true ) {
                this.is_installed_app_and(isRunApp);
//            }
        }else if(this.getAppType() == "MI") {
            this.is_installed_app_ios(isRunApp);
        }
    },
    is_installed_app_ios:function (isRunApp) {
        var clickedAt = +new Date;
        setTimeout(function() {
            if(isRunApp === false){
                if (+new Date - clickedAt < 2000)
                    this.goStore(this.appleMarketUrl);
            }
        }, 1500);
        if(isRunApp !== false)
            callApp("I");
    },
    is_installed_app_and:function (isRunApp){
        if(isRunApp === false)
            this.goStore(this.googleMarketUrl);
        if(isRunApp !== false)
            this.callApp("A");
    },
    callApp:function (appType) {
        if(appType === "A"){
            var chromeExcVer;
            var fireExcVer;
            if(navigator.userAgent.match(/Chrome/) != null){
                chromeExcVer = navigator.userAgent.match(/Chrome\/[\d+\.]{2,2}/)[0].replace('Chrome/','');
            }
            if(navigator.userAgent.match(/Firefox/) != null){
                fireExcVer = navigator.userAgent.match(/Firefox\/[\d+\.]{2,2}/)[0].replace('Firefox/','');
            }

            var iframe = document.createElement('IFRAME');
            iframe.style.display = 'none';
            console.info("AppChecker", chromeExcVer, fireExcVer );
//            alert("AppChecker : " + chromeExcVer + " / " + fireExcVer );
            if(chromeExcVer <= 25 || fireExcVer <= 40 || navigator.userAgent.match(/Daum/i)){
                var iframe;
                var start;
                iframe.src = this.androidScheme;
                document.body.appendChild(iframe);
                start = +new Date();
                setTimeout(function() {
                    var now = +new Date();
                    if (now - start < 2000) {
                        window.location.href = fallbackUrl;
                    }
                }, 500);
            }else if((chromeExcVer > 26 && chromeExcVer < 42)){
                if(navigator.userAgent.match(/SamsungBrowser/i)){
                    var intentURI = [
                        'intent://'+this.urlHostName+'?'+JSON.stringify(this.runAppResult)+'#Intent',
                        'scheme='+this.urlSchemeName,
                        'package='+this.packageName,
                        'S.browser_fallback_url='+this.fallbackUrl,
                        'end'
                    ].join(';');
                    window.location.href = intentURI;
                }else{
                    var SCHEME = 'intent://open#Intent;scheme=;end';
                    self = this;

                    iframe.addEventListener('load', function onload() {
                        if (iframe.src === SCHEME) {
                            self.isNotSupportedFallbackURL = true;
                        } else {
                            self.isPrepared = true;
                            iframe.removeEventListener('load', onload);
                            document.body.removeChild(iframe);
                        }
                    });
                    iframe.src = SCHEME;
                    document.body.appendChild(iframe);

                    setTimeout(function() {
                        iframe.src = this.androidScheme;
                    }, 100);
                }
            }else if(chromeExcVer >= 42){
                var intentURI = [
                    'intent://'+this.urlHostName+'?'+JSON.stringify(this.runAppResult)+'#Intent',
                    'scheme='+this.urlSchemeName,
                    'package='+this.packageName,
                    'S.browser_fallback_url='+this.fallbackUrl,
                    'end'
                ].join(';');
                // intent://hancap?{"header":{"api":"125"},"body":{"url":""}}#Intent;scheme=hancapMobile;package=com.lottecap.mweb.app;S.browser_fallback_url=https://m.lottecap.com/co/CO150000.do;end

                /**
                 * chrome 4.0이상의 버전에서 앱미설치 상태에서 모바일웹 페이지에서 스키마를 통해(intent) 설치화면으로 이동하면
                 * 빈화면이(blank) 뜨는 오류가 발생함 이를 해결 하기 위해 location.href가 아닌 window.open 함수 사용
                 * **/
                //window.open(intentURI);

                setTimeout(function() {
//                    alert(intentURI);
                    location.href = intentURI;
                },0);

            }else if(fireExcVer > 40){
                window.location = this.androidScheme;
            }

        }else{
            var visitedAt = (new Date()).getTime();

            setTimeout(
              function() {
                  if ((new Date()).getTime() - visitedAt < 2000) {
                      goStore(this.appleMarketUrl);
                  }
              }, 500);
            setTimeout(function() {
               location.href = iosScheme;
            }, 0);
        }
    },
    goStore:function (storeUrl) {
        console.info(storeUrl);
//        alert(appstoreurl);
        location.href = storeUrl;
    }
}