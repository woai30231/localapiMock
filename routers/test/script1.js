(function(){
    console.log("script",var1)
    const div = document.querySelectorAll(".div");
    console.log("script1")
    console.log(div)
    if(div[0]){
        div[0].innerHTML = 'div的innerHTML被改！ ------ script1'
    }
})();