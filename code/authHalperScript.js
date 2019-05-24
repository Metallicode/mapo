var mapo_user_signIn_profile;

function onSignIn(googleUser) {

    mapo_user_signIn_profile = googleUser.getBasicProfile();

    mapo_log('User Connected:  ' + mapo_user_signIn_profile.getName());

    app.app_globals.mapo_user.user_auth = googleUser.Zi.id_token;
    app.app_globals.mapo_user.user_name = mapo_user_signIn_profile.getName();
    app.app_globals.mapo_user.user_image_URL = mapo_user_signIn_profile.getImageUrl();
    app.app_globals.mapo_user.user_email = mapo_user_signIn_profile.getEmail();

    app.reset_http_headers();

    document.getElementById("mapo-navigator-userThumbnail").setAttribute("src", mapo_user_signIn_profile.getImageUrl());

    app.get_locations_obj_from_server();

    app.app_globals.mapo_user.set_anonymous_mode(false);
    $("#login-anonymous-div").prop('checked', false);


    if (app.app_globals.is_login_view) {
        app.cancel_login();
    }
}