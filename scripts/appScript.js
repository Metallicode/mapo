var CHAT_IS_UP = false;
var LOGIN_IS_UP = false;
var NEW_ITEM_DIV = false;
var CAM_DIV = false;
var ABOUT_DIV = false;
var LEARN_MORE_DIV = false;
var USER_DIV = false;
var SHOW_ITEM_DIV = false;


$(function () {

    $("#start_login_btn").click(function (e) {

        if (!NEW_ITEM_DIV) {

            console.log("start_login_btn");

            if (CHAT_IS_UP) {
                $("#chatDiv").animate({ top: '3000px' });

                CHAT_IS_UP = false;
            }

            if (SHOW_ITEM_DIV) {
                $("#showItemDiv").animate({ top: '3000px' });
                SHOW_ITEM_DIV = false;
            }

            if (ABOUT_DIV) {
                $("#aboutDiv").animate({ top: '3000px' });
                ABOUT_DIV = false;

            }
            if (LEARN_MORE_DIV) {
                $("#learnMoreDiv").animate({ top: '3000px' });
                LEARN_MORE_DIV = false;

            }
            if (LOGIN_IS_UP) {
                $("#userLoginDiv").animate({ top: '3000px' });
                LOGIN_IS_UP = false;

            } else {
                $("#userLoginDiv").animate({ top: '160px' });
                LOGIN_IS_UP = true;
            }
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
        raise_chat = true;

        if (ABOUT_DIV) {
            $("#aboutDiv").animate({ top: '3000px' });
            ABOUT_DIV = false;
            $("#chatDiv").animate({ top: '3000px' });
            raise_chat = false;
            CHAT_IS_UP = false;
        } 

        if (SHOW_ITEM_DIV) {
            $("#showItemDiv").animate({ top: '3000px' });
            SHOW_ITEM_DIV = false;
            $("#chatDiv").animate({ top: '3000px' });
            raise_chat = false;
            CHAT_IS_UP = false;
        } 
        if (LEARN_MORE_DIV) {
            $("#learnMoreDiv").animate({ top: '3000px' });
            LEARN_MORE_DIV = false;
            $("#chatDiv").animate({ top: '3000px' });
            raise_chat = false;
            CHAT_IS_UP = false;
        } 

        if (NEW_ITEM_DIV) {
            $("#newItemDiv").animate({ top: '3000px' });
            NEW_ITEM_DIV = false;
            raise_chat = false;
        }
        if (CAM_DIV) {
            $("#camDiv").animate({ top: '3000px' });
            CAM_DIV = false;
            raise_chat = false;
        }

        if (LOGIN_IS_UP) {
            $("#userLoginDiv").animate({ top: '3000px' });
            LOGIN_IS_UP = false;
            raise_chat = false;
        }


        if (CHAT_IS_UP) {
            $("#chatDiv").animate({ top: '3000px' });

            CHAT_IS_UP = false;

        } else if(raise_chat) {
            $("#chatDiv").animate({ top: '160px' });
            CHAT_IS_UP = true;
        }


    });

    $("#app_logo").click(function (e) {
        console.log("app_logo");
        if (ABOUT_DIV) {
            $("#aboutDiv").animate({ top: '3000px' });
            ABOUT_DIV = false;
            CHAT_IS_UP = false;
            LEARN_MORE_DIV = false;
        } else {
            $("#aboutDiv").animate({ top: '160px' });
            ABOUT_DIV = true;

        }

        if (SHOW_ITEM_DIV) {
            $("#showItemDiv").animate({ top: '3000px' });
            SHOW_ITEM_DIV = false;
        }


        if (LOGIN_IS_UP) {
            $("#userLoginDiv").animate({ top: '3000px' });
            LOGIN_IS_UP = false;
        }

        if (CHAT_IS_UP) {
            $("#chatDiv").animate({ top: '3000px' });

            CHAT_IS_UP = false;

        }

        if (LEARN_MORE_DIV) {
            $("#learnMoreDiv").animate({ top: '3000px' });
            LEARN_MORE_DIV = false;
        } 

        e.stopPropagation();

    });

    $("#learn_more_btn").click(function () {

        console.log("learn_more_btn");
        $("#learnMoreDiv").animate({ top: '160px' });
        LEARN_MORE_DIV = true;
        $("#aboutDiv").animate({ top: '3000px' });
        ABOUT_DIV = false;
        if (CHAT_IS_UP) {
            $("#chatDiv").animate({ top: '3000px' });

            CHAT_IS_UP = false;

        }



    });

    $("#addNewDiv").click(function () {
        console.log("addNewDiv");
        $("#newItemDiv").animate({ top: '160px' });
            NEW_ITEM_DIV = true;
    });

    $("#cancel_save_btn").click(function () {
        console.log("cancel_save");
        $("#newItemDiv").animate({ top: '3000px' });
        NEW_ITEM_DIV = false;
    });

    $("#finish_save_btn").click(function () {
        console.log("finish_save");
        $("#newItemDiv").animate({ top: '3000px' });
        NEW_ITEM_DIV = false;
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

    $("#show_map_btn").click(function () {

        if (ABOUT_DIV) {
            $("#aboutDiv").animate({ top: '3000px' });
            ABOUT_DIV = false;
            $("#chatDiv").animate({ top: '3000px' });
            CHAT_IS_UP = false;
        }
        if (LEARN_MORE_DIV) {
            $("#learnMoreDiv").animate({ top: '3000px' });
            LEARN_MORE_DIV = false;
            $("#chatDiv").animate({ top: '3000px' });
            CHAT_IS_UP = false;
        }

        if (CHAT_IS_UP) {
            $("#chatDiv").animate({ top: '3000px' });

            CHAT_IS_UP = false;

        }


    });

    $("#show_item_exit_btn").click(function () {
            $("#showItemDiv").animate({ top: '3000px' });
            SHOW_ITEM_DIV = false;
        });
    
});


function show_item_on_marker_click(e, mapo_item) {

    //$("#showItemDiv")
    console.log("showItemDiv " + e + " " + mapo_item);

    $('#show_item_user_name').text(mapo_item.user);
    $('#show_item_date').text(return_time_string_from_timestamp(mapo_item.time));
    //$('#show_item_img').attr('src', GET_IMAGE_FROM_ID_URL + mapo_item.id);
    $('#show_item_img').attr('src', GET_IMAGE_FROM_ID_URL + "fakeItem.png");
    $('#show_item_text').text(mapo_item.text);

    $("#showItemDiv").animate({ top: '160px' });
    SHOW_ITEM_DIV = true;

}