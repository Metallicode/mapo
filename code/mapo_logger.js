function mapo_log(log_message) {

    if (app.app_globals.mapo_debug_mode == true) {
        console.log(">>> " + log_message);
    }

}