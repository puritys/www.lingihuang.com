console.log("**** external.js loaded ****");
var containerElement = document.getElementById("container");
if (containerElement) {
    var html = containerElement.innerHTML;
    containerElement.innerHTML = html + "**** external.js loaded ****" + "<br>";
}
console.log(containerElement);