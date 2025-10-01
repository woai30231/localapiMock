console.log("我要2秒才能加载");
const var1 = '我是script变量';
;(function(){
    const div = document.querySelectorAll(".div");
    console.log("script")
    console.log(div)
    if(div[0]){
        div[0].innerHTML = 'div的innerHTML被改！ ------ script'
    }
})();