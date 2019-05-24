function calcVH() {
    var vH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.getElementById("mapo-chat").setAttribute("style", "height:80vh;");
    document.getElementById("user-login-element").setAttribute("style", "height:90vh;");
    document.getElementById("camDiv").setAttribute("style", "height:90vh;");
    document.getElementById("mapo-show-image-element").setAttribute("style", "height:90vh;");
    document.getElementById("mapo-map").setAttribute("style", "height:90vh;");
    document.getElementById("mapo-map").setAttribute("style", "bottom:0px;");

}

window.addEventListener('resize', calcVH, true);