console.log("**** dynamic.js loaded ****");
var containerElement = document.getElementById("container");
if (containerElement) {
    var html = containerElement.innerHTML;
    containerElement.innerHTML = html + "**** dynamic.js loaded ****" + "<br>";
}
console.log(containerElement);