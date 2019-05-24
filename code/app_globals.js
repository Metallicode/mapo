function AppGlobals() {

    this.app_environment = "DEV"; // "PROD", "TEST"...
    this.app_language = "ENG";
    this.mapo_debug_mode = true;

    this.mapo_texts = MapoTextsMaker(this.app_language);
    this.mapo_API_urls = MapoApiUrlsMaker(this.app_environment);


    this.app_is_busy = true;
    this.mapo_app_views = ["map_view", "chat_view", "login_view", "logout_view", "about_view", "item_view", "image_view", "item_menu_open", "creating_item_view", "camera_view"];
    this.is_chat_view = false;
    this.is_login_view = false;
    this.is_camera_view = false;
    this.is_image_view = false;
    this.is_about_view = false;
    this.is_input_view = true;
    this.is_filter_view = false;
    this.is_writeing_ = false;


    this.is_chat_item_private_message_view = false;

    this.mapo_user_types = ["developer", "basic", "pro"];
    this.mapo_item_types = ["text-message", "hazard", "second-hand", "event", "advertisement"];
    this.mapo_api_calls = ["get-items", "post-item", "post-image", "get-image", "report-item", "upvote-item", "downvote-item"];
    this.mapo_app_images = MapoImagesMaker();

    this.should_get_chat_items_images_while_scrooling = true;

    this.new_image_data_buffer = null;
    this.new_low_res_image_data_buffer = null;

    this.mapo_map = null;
    this.mapo_chat = null;
    this.mapo_user = null;
    this.mapo_camera = null;

    this.current_device_video_mediaDevices = new Array();
    this.current_device_video_mediaDevice_index = 0;

    this.mapo_time_to_wait_until_new_post = 50000;
    this.mapo_proximity_range = 0.01;
    this.mapo_refresh_rate = 600000; //10 minutes
    this.mapo_interval_id = null;
    this.latest_get_items_hash = "";
    this.mapo_popup_max_text_length = 15;

    this.should_get_items_after_get_topics = false;


    this.mapo_items_collection = null;
    this.mapo_items_with_uploading_image = new Array();

    this.set_location_a = true;
    this.set_location_b = true;

    this.mapo_chat_auto_scroll_on_get_items = true;
    this.mapo_topics_refresh_rate = 60000; //1 minute
    this.mapo_socket = null;
    this.mapo_socket_client = null;
    this.mapo_current_topic = null;
    this.mapo_latest_topics_hash = null;

    this.mapo_topics_manager = {};
    this.mapo_topics_interval_id = null;


    this.mapo_reconnect_to_socket_interval_id = null;

    this.current_mapo_item = null;

    this.latest_created_mapo_item_id = null;


    this.http_headers = null;



    //util methodes

    this.return_time_sorted_mapo_items_from_json = function (mapo_items_from_json) {


        things_to_put = mapo_items_from_json.items;

        mapo_items = Array();

        for (i = 0; i < things_to_put.length; i++) {

            mapo_item = things_to_put[i];

            new_mapo_item = {

                id: mapo_item._id,
                type: mapo_item.type,
                location: mapo_item.location,
                time: mapo_item.time,
                user: mapo_item.createdByUser,
                text: mapo_item.text,
                hasPhoto: mapo_item.hasPhoto,
                downVotes: mapo_item.downVotes,
                upVotes: mapo_item.upVotes


            }

            mapo_items.push(new_mapo_item);
        }

        //mapo_items.sort(function (a, b) { return b.time - a.time }); // for reverved order
        mapo_items.sort(function (a, b) { return a.time - b.time });

        return mapo_items;


    }

    this.parse_res_to_json = function (res) {

        return JSON.parse(res);

    }

    this.convert_time_to_nice_time = function (time_stamp) {

        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "dec"];
        i_day_sefix = " ";
        c_time = new Date();
        c_year = c_time.getFullYear();
        c_month = c_time.getMonth();
        c_day = c_time.getDate();

        i_time = new Date(time_stamp * 1);
        i_year = i_time.getFullYear();
        i_month = i_time.getMonth();
        i_day = i_time.getDate();
        if (c_year != i_year) {
            time_str = i_year + " " + months[i_month] + " " + i_day + i_day_sefix;
        } else {
            if (c_month != i_month || c_day != i_day) {
                time_str = months[i_month] + " " + i_day + i_day_sefix;
            } else { time_str = "" }
        }


        var m = i_time.getMinutes();
        if (m < 10) {
            m = "0" + m;
        }
        time_str = time_str + i_time.getHours() + ":" + m;

        return time_str;

    }

    this.convert_location_string_to_obj = function (locString) {

        newLocation = locString.split(",");
        m_lat = newLocation[0].trim() * 1;
        m_lon = newLocation[1].trim() * 1;

        return { lat: m_lat, lon: m_lon };

    }

    this.convert_location_objct_to_string = function (locObj) {

        if (locObj) {
            locationString = locObj.lat + ", " + locObj.lon;
            return locationString;
        }
   
    }



    this.popup_string_format_halper = function (message_text) {

        text_preview = ""
        if (this.is_null_or_white_space(message_text)) {
            text_preview = "No text"
        } else if (message_text.length < app.app_globals.mapo_popup_max_text_length) {
            text_preview = message_text;
        } else if (message_text.length >= app.app_globals.mapo_popup_max_text_length) {
            text_preview = message_text.substring(0, app.app_globals.mapo_popup_max_text_length) + "...";
        }

        return text_preview;
    }

    this.is_null_or_white_space = function (input) {

        if (typeof input === 'undefined' || input == null) return true;

        return input.replace(/\s/g, '').length < 1;

    }

    this.check_if_new_hash = function (new_hash) {

        return new_hash != this.latest_get_items_hash;

    }

    this.is_this_item_close_to_user_location = function (mapo_item) {

        item_location = this.convert_location_string_to_obj(mapo_item.location);
        distance_from_me = this.get_distance_from_LatLon_in_Km(this.mapo_user.user_location.lat, this.mapo_user.user_location.lon, item_location.lat, item_location.lon);

        is_close = false;

        if (distance_from_me < this.mapo_proximity_range) {
            
            is_close = true;
        }

        return is_close;
    }

    this.get_distance_from_LatLon_in_Km = function (lat1, lon1, lat2, lon2) {

        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;


    }

    this.get_latest_item_in_close_range = function () {

        close_items = [];

        for (var i = 0; i < this.mapo_items_collection.length; i++) {
            if (this.is_this_item_close_to_user_location(this.mapo_items_collection[i])) {

                close_items.push(this.mapo_items_collection[i]);

            }
        }



        return close_items[close_items.length-1];



    }

    this.sort_by_time = function () {



    }

    this.deg2rad = function(deg) {
        return deg * (Math.PI / 180)
    }

    this.get_mapo_item_from_id = function (mapo_id) {
        for (var i = 0; i < app.app_globals.mapo_items_collection.length; i++) {
            if (mapo_id == app.app_globals.mapo_items_collection[i].id) {
                return app.app_globals.mapo_items_collection[i] 
            }
        }
        return null;
    }

    this.mapo_chat_scroll = function () {

        if ($("#mapo-chat").prop("scrollHeight") - $("#mapo-chat").prop("scrollTop") > 5000) {

            if (app.app_globals.mapo_chat_auto_scroll_on_get_items == true) {
                mapo_log("don't auto scroll!");
            }

            app.app_globals.mapo_chat_auto_scroll_on_get_items = false;

        } else {

            if (app.app_globals.mapo_chat_auto_scroll_on_get_items == false) {
                mapo_log("do auto scroll!");
            }
            app.app_globals.mapo_chat_auto_scroll_on_get_items = true;  
        }
        

        if (app.app_globals.should_get_chat_items_images_while_scrooling == true) {

            $(".chatItem").each(function () {

                if (!$(this)[0].hasAttribute("mapo-image-is-shown")) {
                    if (app.app_globals.isScrolledIntoViewHalper($(this)[0])) {

                        var item_id = $(this)[0].id.substr(0, $(this)[0].id.indexOf("*"));

                        mapo_item = app.app_globals.get_mapo_item_from_id(item_id)

                        if (mapo_item) {
                            if (mapo_item.hasPhoto == true) {

                                //$(this)[0].querySelector(".chat_item_image_div").innerHTML += '<div id="' + item_id + '*mapo-chat-item-p-image" onclick="app.flip_image_view(event)" mapo_data_item_id="' + item_id + '" class="chat_item_image" style="background-image:url(' + app.app_globals.mapo_app_images.mapo_image_view_placeholder + ')"/>';

                                setTimeout(function () {

                                    document.getElementById(item_id + "*mapo-chat-item-p-image").style.backgroundImage = 'url(' + app.app_globals.mapo_API_urls.get_direct_image_from_id_url + item_id + ')';
                                    //$.ajax({
                                    //    type: 'GET',
                                    //    headers: app.app_globals.http_headers,
                                    //    url: app.app_globals.mapo_API_urls.get_image_from_id_url + "/" + item_id,
                                    //    success: function (res) {
                                    //        document.getElementById(item_id + "*mapo-chat-item-p-image").style.backgroundImage = 'url('+res+')';
                                    //    }
                                    //});

                                }, 200);

                                $(this)[0].setAttribute("mapo-image-is-shown", "true");

                            }
                        }
                    }

                }

            });
        }

    }

    this.isScrolledIntoViewHalper = function (chat_element) {
        rect = chat_element.getBoundingClientRect();
        elemTop = rect.top;
        elemBottom = rect.bottom;

        isVisible = (elemTop+500 >= 0) && (elemBottom-500 <= window.innerHeight);

        return isVisible;
    }

}



function AppGlobalsMaker() {

    return new AppGlobals();

}
