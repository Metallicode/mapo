function MapoUser(instance) {

    this.user_email = null;
    this.user_auth = "";
    this.user_name = "";
    this.user_image_URL = "";
    this.user_type = instance.app_globals.mapo_user_types[1];
    this.user_location = instance.app_globals.mapo_map.app_default_location;
    this.anonymous_mode = false;
    this.radius_coefficient = 1;

    this.user_locations = {

        location_a: null,
        location_a_name: instance.app_globals.mapo_texts.defult_user_location_a_title,
        location_b: null,
        location_b_name: instance.app_globals.mapo_texts.defult_user_location_b_title

    };

    this.user_selected_location = "gps";


    this.user_current_filter_settings = {
        show_text_message:true,
        show_second_hand: true,
        show_hazard: true,
        show_help: true,
        show_event: true,
        show_coupon: true,
        show_advertisement: true
    }


    this.login = function (mapo_user_data) {

        this.user_email = mapo_user_data.user_email;
        this.user_auth = mapo_user_data.user_auth;
        this.user_name = mapo_user_data.user_name;
        this.user_image_URL = mapo_user_data.user_image_URL;
        this.user_type = mapo_user_data.user_type;
        this.user_location = mapo_user_data.user_location;
        this.anonymous_mode = mapo_user_data.anonymous_mode;

    }


    this.set_anonymous_mode = function (be_anonymous) {

        this.anonymous_mode = be_anonymous;


        if (be_anonymous) {

            $("#mapo-navigator-userThumbnail").attr("src", app.app_globals.mapo_app_images.mapo_navigator_anonymousThumbnail);
            $("#mapo-navigator-userThumbnail").css({ "width": "110px", "height": "110px" });


        } else {

            $("#mapo-navigator-userThumbnail").attr("src", app.app_globals.mapo_user.user_image_URL);
            $("#mapo-navigator-userThumbnail").css({ "width": "100px", "height": "100px" });
        }



    }


    this.reset_user_login_info = function () {

        this.user_email = null;
        this.user_auth = "";
        this.user_name = "";
        this.user_image_URL = "";
        this.user_type = instance.app_globals.mapo_user_types[1];

        this.anonymous_mode = true;

        $("#mapo-navigator-userThumbnail").attr("src", app.app_globals.mapo_app_images.mapo_navigator_userThumbnail);
        $("#mapo-navigator-userThumbnail").css({ "width": "100px", "height": "100px" });

    }


    this.set_current_location = function (user_position) {

        this.app.app_globals.mapo_user.user_location.lat = user_position.coords.latitude;
        this.app.app_globals.mapo_user.user_location.lon = user_position.coords.longitude;

    }


    this.set_current_location_and_get_items = function (user_position) {

        this.app.app_globals.mapo_user.user_location.lat = user_position.coords.latitude;
        this.app.app_globals.mapo_user.user_location.lon = user_position.coords.longitude;
        app.reset_http_headers();
        this.app.get_items_from_server(this.app.app_globals.mapo_user.user_location);
        app.app_globals.mapo_map.set_map_view_to_location(app.app_globals.mapo_user.user_location);

        //socket stuff

        //app.connect_to_socket_server();


    }



    this.set_map_to_user_current_location = function () {

        this.app.app_globals.mapo_map.set_map_view_to_location(this.app.app_globals.mapo_user.user_location);

    }


}

function MapoUserProvider(instance) {

    //fix?
    if (instance.mapo_user == null) {
        return new MapoUser(instance);
    }
    else  {
        return instance.mapo_user;
    }


}


