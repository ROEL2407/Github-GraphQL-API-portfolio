// get values when loading
window.onload = () => {
  getValues();
};

// fill input fields
const getValues = () => {
  const body = document.querySelector("body");
  const item = localStorage.getItem("color");

  body.classList.add(item);
};

function menuOpen() {
  const menu_btn = document.querySelector("#chooseBG");
  const color_list = document.querySelector("#colorArray");

  menu_btn.addEventListener("click", function () {
    color_list.classList.toggle("hidden");
  });
}
menuOpen();

function colorPicker() {
  const color_btns = document.querySelectorAll("#colorArray button");
  const body = document.querySelector("body");

  color_btns.forEach(function (element) {
    element.addEventListener("click", function () {
      body.className = "";
      body.classList.add(this.value);
      localStorage.setItem("color", this.value);
    });
  });
}
colorPicker();
