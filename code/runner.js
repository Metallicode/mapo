(function () {


    app = MapoMapProvider();
    app.app_init();

    document.getElementById("mapo-chat").addEventListener("scroll", app.app_globals.mapo_chat_scroll);


    //app.try_to_get_user_loc();




})();