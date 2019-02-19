var CHAT_IS_UP = false;
var LOGIN_IS_UP = false;
var NEW_ITEM_DIV = false;
var CAM_DIV = false;
var ABOUT_DIV = false;

$(function () {

    $("#start_login_btn").click(function (e) {
        console.log("start_login_btn");
        if (LOGIN_IS_UP) {
            $("#userLoginDiv").animate({ top: '3000px' });
            LOGIN_IS_UP = false;

        } else {
            $("#userLoginDiv").animate({ top: '160px' });
            LOGIN_IS_UP = true;
        }
        e.stopPropagation();
    });

    $("#login_btn_control").click(function (e) {
        $("#userLoginDiv").animate({ top: '3000px' });
        LOGIN_IS_UP = false;
    });

    
    $("#cam_click").click(function () {
            $("#camDiv").animate({ top: '3000px' });
            CAM_DIV = false;
    });


    $("#top_nav_bar").click(function () {
        console.log("top_nav_bar");
        if (CHAT_IS_UP) {
            $("#chatDiv").animate({ top: '3000px' });
            CHAT_IS_UP = false;

        } else {
            $("#chatDiv").animate({ top: '160px' });
            CHAT_IS_UP = true;
        }

        if (ABOUT_DIV) {
            $("#aboutDiv").animate({ top: '3000px' });
            ABOUT_DIV = false;

        } 

    });


    $("#app_logo").click(function (e) {
        console.log("app_logo");
        if (ABOUT_DIV) {
            $("#aboutDiv").animate({ top: '3000px' });
            ABOUT_DIV = false;

        } else {
            $("#aboutDiv").animate({ top: '160px' });
            ABOUT_DIV = true;
        }
        e.stopPropagation();

    });


    $("#addNewDiv").click(function () {
        console.log("addNewDiv");
        $("#newItemDiv").animate({ top: '160px' });
            NEW_ITEM_DIV = true;
    });


    $("#cancel_save_btn").click(function () {
        console.log("cancel_save");
        $("#newItemDiv").animate({ top: '3000px' });
        CAM_DIV = false;
    });


    $("#finish_save_btn").click(function () {
        console.log("finish_save");
        $("#newItemDiv").animate({ top: '3000px' });
        CAM_DIV = false;
    });


    $("#open_camera_btn").click(function () {
        console.log("open_camera_btn");
        if (CAM_DIV) {
            $("#camDiv").animate({ top: '3000px' });
            CAM_DIV = false;

        } else {
            $("#camDiv").animate({ top: '160px' });
            CAM_DIV = true;
        }
    });

});