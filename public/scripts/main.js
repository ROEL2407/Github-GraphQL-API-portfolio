function menuOpen() {
    const menu_btn = document.querySelector("#chooseBG");
    const color_list = document.querySelector("#colorArray");
    
    menu_btn.addEventListener("click", function() {
        color_list.classList.toggle("hidden");
    });
}
menuOpen();

function colorPicker() {
    const color_btns = document.querySelectorAll("#colorArray button");
    console.log(color_btns);
    color_btns.forEach(function (element) {
        console.log(element);
        element.addEventListener("click", function() {
           
        });
    });
}
colorPicker();