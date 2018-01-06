var getBrowser = (function getBrowser(){
    var i = 0;
    var result;
    var browsersArr = [{name:"browserRegger", mode: "kmeleon", proxyFor: "kl"}, {name:"browserRegger", mode: "avant", proxyFor: "ie"}, {name:"browserRegger", mode: "amigo", proxyFor: "ie"}, {name:"browserRegger", mode: "ya", proxyFor: "ie"},{name:"browserRegger", mode: "op", proxyFor: "ie"}, {name: "browserRegger", mode: "moz", proxyFor: "firefox"} /*, {name: "registerNewAccSmsArea", mode: "", proxyFor: "ie"} */];
    var initialize = browsersArr[Math.floor(Math.random() * browsersArr.length)];
    var flag = false;

    var func = function(){
        if(i == 0 && !flag){
            result = initialize;
            flag = true;
        }else {
            if(i > browsersArr.length-1){
                i = 0;
            }
            result = browsersArr[i]
        }
        i++;
        WScript.Echo(result);
        return result;
    };
    return func;
})();

export default getBrowser;