mapo_app = null;

function MapoApp() {

    this.app_data = AppDataMaker();

    this.app_globals = AppGlobalsMaker();


    ////App initial

    this.app_init = function () {



        app_element = document.getElementById("mapo-app");

        //do HTML...
        nav_element = get_navigator_html(this.app_globals);
        app_element.innerHTML += nav_element;
        this.map_html_element = document.createElement("div");
        this.map_html_element.id = "mapo-map";
        this.chat_html_element = document.createElement("div");
        this.chat_html_element.id = "mapo-chat";
        app_element.appendChild(this.map_html_element);
        app_element.appendChild(this.chat_html_element);


        input_elem = get_input_element_html(app.app_globals);
        document.getElementById("mapo-glob").innerHTML += input_elem;


        login_element = get_mapo_login_element();
        document.getElementById("mapo-glob").innerHTML += login_element;
      

        camera_element = get_camera_element();
        document.getElementById("mapo-glob").innerHTML += camera_element;

        show_image_elem = "<img onclick='app.mapo_UI_click(event)' id='mapo-show-image-element' src='" + app.app_globals.mapo_app_images.mapo_image_view_placeholder + "'/>";
        document.getElementById("mapo-glob").innerHTML += show_image_elem;


        about_mapo_elem = get_mapo_about_element();
        document.getElementById("mapo-glob").innerHTML += about_mapo_elem;

        filter_mapo_elem = get_filter_html();
        document.getElementById("mapo-glob").innerHTML += filter_mapo_elem;

        //camera
        this.app_globals.mapo_camera = MapoCameraProvider(this);


        //map

        this.app_globals.mapo_map = MapoAppProvider(this);


        //chat
        this.app_globals.mapo_chat = MapoChatProvider(this);


        //user
        this.app_globals.mapo_user = MapoUserProvider(this);

        set_user_locations_element();

        app.app_globals.http_headers = this.reset_http_headers();

        initial_about_element();


        //GET ALL MEDIA DEVICES
        navigator.mediaDevices.enumerateDevices()
            .then(function (deviceInfos) {

                app.app_globals.current_device_video_mediaDevices = new Array();

                for (var i = 0; i < deviceInfos.length; i++) {
                    if (deviceInfos[i].kind === 'videoinput') {

                        app.app_globals.current_device_video_mediaDevices.push(deviceInfos[i]);

                    }
                }
            });



        ///START RUNNING
        app.app_globals.app_is_busy = false;

        app.connect_to_socket_server();

        call_get_items_on_callback = true;

        this.try_to_get_user_loc(call_get_items_on_callback);
      
        $("#mapo-input-element-text").bind('DOMSubtreeModified', app.text_input_handler);
        $("#mapo-input-element-text").focus(function () {

            document.getElementById("mapo-chat").innerHTML += '<div id="empty-chat-place-holder"></div>';

        });
        $("#mapo-input-element-text").blur(function () {

            elem = document.getElementById("empty-chat-place-holder");
            elem.parentNode.removeChild(elem);

        });

        $("#mapo-input-element-post-item").hide();

        $(".user-location-obj-row-input").focus(function () {
            if (app.app_globals.is_input_view == true) {

                $("#mapo-input-element").animate({ bottom: '-50vh' });
               


                app.app_globals.is_input_view = false;
            }

        });
        $(".user-location-obj-row-input").blur(function () {
            if (app.app_globals.is_input_view == false) {

                $("#mapo-input-element").animate({ bottom: '0px' });
                app.app_globals.is_input_view = true;
            }

        });


        this.start_auto_get_topics();
        this.auto_refresh_topics();


        //this.start_auto_get_items_from_server();

        this.flip_chat_view();
   
    }
    


    //SOCKET STUFF
    this.connect_to_socket_server = function () {

        mapo_log("connectiong to mapo socket server");
        
        //creating socket globals [socket, clientOBJ]
        app.app_globals.mapo_socket = new SockJS(app.app_globals.mapo_API_urls.get_new_items_socket_server);
        app.app_globals.mapo_socket_client = Stomp.over(app.app_globals.mapo_socket);

        //connect client
        app.app_globals.mapo_socket_client.connect({}, function (frame) {

            mapo_log('Connected: ' + frame);

            clearInterval(app.app_globals.mapo_reconnect_to_socket_interval_id);
            app.app_globals.mapo_reconnect_to_socket_interval_id = null;
      
            app.auto_refresh_topics();

        });

    }

    ///SOCKET CALLBACK

    this.handle_full_image_finished_uploading = function (item_id) {

        $(".chatItem").each(function () {

            if ($(this).attr("id") == item_id +"*chat-item-id") {

                document.getElementById(item_id + "*mapo-chat-item-p-image").style.backgroundImage = 'url(' + app.app_globals.mapo_API_urls.get_direct_image_from_id_url + item_id + ')';

            }

        });

    }

    this.server_returns_message = function (server_message) {

        newParsedItem = JSON.parse(server_message.body);

        if (newParsedItem.messageAction != null) {

            //switch items image..
            app.handle_full_image_finished_uploading(newParsedItem._id);

        } else {

            newItem = {
                downVotes: newParsedItem.downVotes,
                hasPhoto: newParsedItem.hasPhoto,
                id: newParsedItem._id,
                location: newParsedItem.location,
                text: newParsedItem.text,
                time: newParsedItem.time,
                type: newParsedItem.type,
                upVotes: newParsedItem.upVotes,
                user: newParsedItem.createdByUser,
                photoPromise: newParsedItem.photoPromise
            }

            app.app_globals.mapo_items_collection.push(newItem);

            items_arr = [newItem];

            app.app_globals.mapo_map.put_items_as_markers_on_map(items_arr);
            app.app_globals.mapo_chat.put_items_as_chat_item_in_chat(items_arr);

            if (app.app_globals.is_chat_view == true && app.app_globals.mapo_chat_auto_scroll_on_get_items == true) {

                $("#mapo-chat").animate({ scrollTop: $("#mapo-chat").prop("scrollHeight") });
            }

        }

    }

    //AUTO GET TOPICS
    this.start_auto_get_topics = function () {

        app.app_globals.mapo_topics_interval_id = setInterval(this.auto_refresh_topics, this.app_globals.mapo_topics_refresh_rate);

    }

    this.auto_refresh_topics = function () {

        if (app.app_globals.app_is_busy==false) {

            app.get_topics_from_server();

        } else {

            setTimeout(app.auto_refresh_topics, 1000);

        }

    }

    this.on_socket_close = function () {

        mapo_log("on_socket_close Called...");

        app.app_globals.mapo_current_topics = new Array();
        app.app_globals.mapo_latest_topics_hash = null;
        app.app_globals.mapo_topics_manager = {};

        if (app.app_globals.mapo_reconnect_to_socket_interval_id == null) {
            app.app_globals.mapo_reconnect_to_socket_interval_id = setInterval(app.connect_to_socket_server, 5000);
        }
    }

    this.get_selected_location_to_use = function () {

        location_to_use = app.app_globals.mapo_user.user_location;

        switch (app.app_globals.mapo_user.user_selected_location) {
            case "gps":
                location_to_use=app.app_globals.mapo_user.user_location;
                break;
            case "a":
                if (app.app_globals.mapo_user.user_locations.location_a) {
                    location_to_use = app.app_globals.mapo_user.user_locations.location_a;
                }
                
                break;
            case "b":
                if (app.app_globals.mapo_user.user_locations.location_b) {
                    location_to_use = app.app_globals.mapo_user.user_locations.location_b;
                }
                
                break;
            default:
        }

        return location_to_use;

    }


    ///HTTP HEADERS
    this.reset_http_headers = function () {
        location_to_use = app.get_selected_location_to_use();
        current_headers = { "mapo-auth": app.app_globals.mapo_user.user_auth, "mapo-geohash": app.app_globals.convert_location_objct_to_string(location_to_use)};
        app.app_globals.http_headers = current_headers;
        return current_headers;
    }


    ////INPUT ELEMENT FLIP VIEW
    this.flip_input_view = function () {

        if (app.app_globals.is_input_view == true) {

            $("#mapo-input-element").animate({ bottom: '-50vh' });
            //$("#mapo-chat").animate({ height: '90vh' });

        } else {

            $("#mapo-input-element").animate({ bottom: '0px' });

            //$("#mapo-chat").animate({ height: '80vh' });
        }
        app.app_globals.is_input_view = !app.app_globals.is_input_view;
    }

    this.text_input_handler = function () {

        mapo_log($(this).text());

        if (app.app_globals.is_null_or_white_space($(this).text())) {
            $("#mapo-input-element-post-item").fadeOut();
        } else {
            $("#mapo-input-element-post-item").fadeIn();
        }

    }


    ///ABOUT FLIP
    this.flip_about_view = function () {

        if (this.app_globals.is_about_view) {

            $("#mapo-about-element").animate({ top: '150vh' });


        } else {
            $("#mapo-about-element").animate({ top: '10vh' });
        }
        this.app_globals.is_about_view = !this.app_globals.is_about_view;
    }


    ////CHAT FLIP

    this.flip_chat_view = function () {

        if (this.app_globals.is_chat_view) {

            $("#mapo-chat").animate({ top: '150vh' });
            $("#mapo-chat").animate({ scrollTop: $("#mapo-chat").prop("scrollHeight") });

            if (app.app_globals.is_chat_item_private_message_view) {

                this.remove_chat_item_message_element();   

            }


        } else {
            $("#mapo-chat").animate({ top: '10vh' });
        }
        this.app_globals.is_chat_view = !this.app_globals.is_chat_view;

        if (!this.app_globals.is_input_view) {

            this.flip_input_view();

        }

      
    }


    //FILTER
    this.flip_filter_view = function () {


        if (this.app_globals.is_filter_view) {

            $("#mapo-filter").animate({ left: '150vw' });
        } else {
            $("#mapo-filter").animate({ left: '0vw' });
        }
        this.app_globals.is_filter_view = !this.app_globals.is_filter_view;


    }

    this.render_filter_icons = function () {

        if (app.app_globals.mapo_user.user_current_filter_settings.show_text_message == true) {

            $("#mapo-filter-text-messages").css("filter","grayscale(0%)");

        } else {
            $("#mapo-filter-text-messages").css("filter","grayscale(100%)");
        }


        if (app.app_globals.mapo_user.user_current_filter_settings.show_second_hand == true) {

            $("#mapo-filter-second-hand").css("filter", "grayscale(0%)");

        } else {
            $("#mapo-filter-second-hand").css("filter", "grayscale(100%)");
        }



        if (app.app_globals.mapo_user.user_current_filter_settings.show_hazard == true) {

            $("#mapo-filter-hazard").css("filter", "grayscale(0%)");

        } else {
            $("#mapo-filter-hazard").css("filter", "grayscale(100%)");
        }




        if (app.app_globals.mapo_user.user_current_filter_settings.show_help == true) {

            $("#mapo-filter-help").css("filter", "grayscale(0%)");

        } else {
            $("#mapo-filter-help").css("filter", "grayscale(100%)");
        }



        if (app.app_globals.mapo_user.user_current_filter_settings.show_event == true) {

            $("#mapo-filter-event").css("filter", "grayscale(0%)");

        } else {
            $("#mapo-filter-event").css("filter", "grayscale(100%)");
        }


        if (app.app_globals.mapo_user.user_current_filter_settings.show_coupon == true) {

            $("#mapo-filter-coupon").css("filter", "grayscale(0%)");

        } else {
            $("#mapo-filter-coupon").css("filter", "grayscale(100%)");
        }



        if (app.app_globals.mapo_user.user_current_filter_settings.show_advertisement == true) {

            $("#mapo-filter-advertisement").css("filter", "grayscale(0%)");

        } else {
            $("#mapo-filter-advertisement").css("filter", "grayscale(100%)");
        }


    }

    this.filter_icon_clicked = function () {

        app.render_filter_icons();
        app.render_markers_and_chat_items();

    }

    this.range_slider_change = function (e) {
        app.app_globals.mapo_user.radius_coefficient = e.target.value * 1;

        mapo_log(app.app_globals.mapo_user.radius_coefficient);

    }


    ///ITEM MENU
    this.flip_item_menu_view = function () {

        //if (app.app_globals.is_chat_item_private_message_view) {

        //    $("#mapo-item-menu-div").animate({ top: '150vh' });
        //    $("#mapo-item-menu-div").animate({ scrollTop: 0 });

        //} else {
        //    $("#mapo-item-menu-div").animate({ top: '0vh' });
        //}
        //app.app_globals.is_chat_item_private_message_view = !app.app_globals.is_chat_item_private_message_view;
    }


    //AUTH
    this.signOut = function () {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {

            mapo_log('User signed out.');

            app.app_globals.mapo_user.reset_user_login_info();


            $("#user-login-element").animate({ top: '150vh' }, 500);
            this.app_globals.is_login_view = false;


        });

    }

    this.open_auth_element = function () {

        if (this.app_globals.is_login_view) {

            $("#user-login-element").animate({ top: '150vh' });

        } else {

            if (app.app_globals.mapo_user.user_auth == "") {

                $("#login-btn-login-div").show();
                $("#login-btn-login-div").show();
                $("#login-btn-logout").hide();
                $("#login-anonymous-div").hide();
                $(".user-location-obj-row").hide();
              
            } else {
                $("#login-btn-login-div").hide();
                $("#login-btn-login-div").hide();
                $("#login-btn-logout").show();
                //$("#login-anonymous-div").show();   
                $("#login-anonymous-div").hide();
                $(".user-location-obj-row").show();
            }

            //document.getElementById("login-anonymous-checkbox").checked = app.app_globals.mapo_user.anonymous_mode;

            $("#user-location-obj-row-title-a").show();
            $("#user-location-obj-row-input-a").hide();
            $("#user-location-obj-row-title-b").show();
            $("#user-location-obj-row-input-b").hide();

            $(".abcRioButtonIcon").remove();
            $(".abcRioButtonIconImage").remove();


            $("#user-login-element").animate({ top: '10vh' });

        }

        this.app_globals.is_login_view = !this.app_globals.is_login_view;

    }

    this.cancel_login = function () {


        $("#user-login-element").animate({ top: '150vh' });
        this.app_globals.is_login_view = false;
    }

    this.set_user_anonymous_mode = function (e) {

        app.app_globals.mapo_user.set_anonymous_mode(e.target.checked);

    }



    //AUTO GET ITEMS REFRESH

    this.start_auto_get_items_from_server = function () {

        this.app_globals.mapo_interval_id = setInterval(this.auto_refresh, this.app_globals.mapo_refresh_rate);

    }

    this.cancle_auto_get_items_from_server = function () {

        if (this.app_globals.mapo_interval_id) {
            clearInterval(this.app_globals.mapo_interval_id);
            this.app_globals.mapo_interval_id = null;
        }   
    }

    this.refresh_now = function (set_map_to_user_location=false) {

        if (!app.app_globals.app_is_busy) {

            app.try_to_get_user_loc();

            setTimeout(app.get_items_from_server, 100);

            if (set_map_to_user_location) {

                setTimeout(function () {
                    app.app_globals.mapo_map.set_map_view_to_location(app.app_globals.mapo_user.user_location);
                }, 500);
            }
        } else {

            setTimeout(app.refresh_now, 5000);

            mapo_log("app is busy... setting timeout for next refresh");

        }
    }

    this.auto_refresh = function () {
      app.refresh_now();
    }


    ////Get user location
    this.try_to_get_user_loc = function (should_get_items=false){

        if (navigator.geolocation) {

            if (should_get_items==false) {
                navigator.geolocation.getCurrentPosition(app.app_globals.mapo_user.set_current_location);
            } else {
                navigator.geolocation.getCurrentPosition(app.app_globals.mapo_user.set_current_location_and_get_items);
            }

           
        } else {

            mapo_log("Geolocation is not supported by this browser.");

        }

    }


    ///POST ITEM CALLD
    this.post_item_called = function () {

        text_element = document.getElementById("mapo-input-element-text");

        if (!this.app_globals.is_null_or_white_space(text_element.innerHTML)) {

            photoPromise = false;
            //low_res_image = "";

            if (app.app_globals.new_image_data_buffer != null) {
                photoPromise = true;  
                //low_res_image = app.app_globals.new_low_res_image_data_buffer;
            }
            

            new_item = {

                text: text_element.textContent ,
                location: this.app_globals.convert_location_objct_to_string(this.app_globals.mapo_user.user_location),
                type: "text-message",
                photoPromise: photoPromise

            }

            this.send_item_to_server(new_item);

        }

    }


    //CAMERA

    this.flip_camera = function () {

        if (this.app_globals.is_camera_view) {

            $("#camDiv").animate({ top: '150vh' });

        } else {



            this.app_globals.mapo_camera.startup(app.app_globals.current_device_video_mediaDevices[0]);

            $("#camDiv").animate({ top: '10vh' });

        }

        this.app_globals.is_camera_view = !this.app_globals.is_camera_view;

    }

    this.close_camera = function () {

        $("#camDiv").animate({ top: '150vh' });
        this.app_globals.is_camera_view = false;
    }

    this.cancel_camera = function () {

        this.close_camera();


        if (app.app_globals.mapo_camera.photo != null) {
            app.app_globals.mapo_camera.photo.parentNode.removeChild(app.app_globals.mapo_camera.photo);
            app.app_globals.new_image_data_buffer = null;
            app.app_globals.mapo_camera.photo = null;
        }


       
        this.app_globals.is_camera_view = false;

    }

    this.switch_camera_video_input = function () {

        if (app.app_globals.current_device_video_mediaDevices.length > 0) {

            if (app.app_globals.current_device_video_mediaDevices.length - 1 > app.app_globals.current_device_video_mediaDevice_index) {

                app.app_globals.current_device_video_mediaDevice_index++;
                $("#video").css({ "transform": "rotateY(0deg)", "-webkit-transform": "rotateY(0deg)", "-moz-transform": "rotateY(0deg)" });

            } else {

                app.app_globals.current_device_video_mediaDevice_index = 0;
                $("#video").css({ "transform": "rotateY(180deg)", "-webkit-transform": "rotateY(180deg)", "-moz-transform": "rotateY(180deg)" });
            }

            app.app_globals.mapo_camera.startup(app.app_globals.current_device_video_mediaDevices[app.app_globals.current_device_video_mediaDevice_index]);

        }

    }



    ////UI Clicks

    this.mapo_UI_click = function (e) {
        this.try_to_get_user_loc();

        this.reset_http_headers();

        target_id = e.target.id;
        item_id = -1;

        if (target_id.endsWith("*popup-item-show-item-btn")) {
            item_id = target_id.substr(0, target_id.indexOf("*"));
            target_id = "popup-item-show-item-btn";

        } else if (target_id.endsWith("*chat-item-id")) {
            item_id = target_id.substr(0, target_id.indexOf("*"));
            target_id = "chat-item-id";
        }
        else if (target_id.endsWith("*chat-upvote-item-id")) {
            item_id = target_id.substr(0, target_id.indexOf("*"));
            target_id = "chat-upvote-item-id";
        }
        else if (target_id.endsWith("*chat-downvote-item-id")) {
            item_id = target_id.substr(0, target_id.indexOf("*"));
            target_id = "chat-downvote-item-id";
        }
        else if (target_id.endsWith("*chat-item-menu-id")) {
            item_id = target_id.substr(0, target_id.indexOf("*"));
            target_id = "chat-item-menu-id";
        }

        mapo_log(target_id + " clicked");
    
        switch (target_id) {
            case "chat-item-id":
                this.chat_item_click(e);
                break;
            case "chat-item-menu-id":
                this.chat_item_menu_click(e, item_id);
                break;


            //TBD................
            case "mapo-chat-item-message-user":
                mapo_log("mapo is still working on private messages");
                break;

            case "mapo-chat-item-report-item":
                mapo_log("mapo is still working on item reporting");
                break;

            case "chat-upvote-item-id":
                if (e.target.getAttribute("mapo-data")=="allowVote") {
                    this.upvote_item(item_id);
                }
                break;
            case "chat-downvote-item-id":
                if (e.target.getAttribute("mapo-data") == "allowVote") {
                    this.downvote_item(item_id);
                }
                break;
            case "mapo-navigator":



                //if (this.app_globals.is_camera_view != true && this.app_globals.is_image_view != true) {
                //    this.flip_chat_view();

                //    if (this.app_globals.is_login_view) {
                //        this.cancel_login();
                //    }
                //    if (this.app_globals.is_about_view) {
                //        this.flip_about_view();
                //    }
                //}

                break;

            case "mapo-navigator-map-chat-switcher":

                this.flip_chat_view();

                if (this.app_globals.is_chat_view ==  true) {

                    $("#mapo-navigator-map-chat-switcher").attr("src", app.app_globals.mapo_app_images.mapo_navigator_map_icon);

                } else {
                    $("#mapo-navigator-map-chat-switcher").attr("src", app.app_globals.mapo_app_images.mapo_navigator_chat_icon);

                }



                if (this.app_globals.is_login_view) {
                    this.cancel_login();
                }
                if (this.app_globals.is_about_view) {
                    this.flip_about_view();
                }

                if (this.app_globals.is_camera_view) {
                    this.cancel_camera();
                }
                if (this.app_globals.is_image_view) {
                    this.flip_image_view(e);
                }


                break;


            case "mapo-input-element-post-item":
                latest_item_in_range = app.app_globals.get_latest_item_in_close_range();
 
                if (latest_item_in_range != null) {

                    now_time = new Date().getTime();

                    if (now_time - latest_item_in_range.time < app.app_globals.mapo_time_to_wait_until_new_post) {

                        var user_res = confirm("message cluster detected - continue?");
                        if (user_res == true) {
                            this.post_item_called();
                            document.getElementById("mapo-input-element-text").innerHTML = "";
                            $("#camera-preview").hide();

                        } else {
                            mapo_log("user cancled item post");
                        }

                    } else {

                        //no problem here....
                        this.post_item_called();
                        document.getElementById("mapo-input-element-text").innerHTML = "";
                        $("#camera-preview").hide();

                    }
                } else {

                    this.post_item_called();
                    document.getElementById("mapo-input-element-text").innerHTML = "";

                }

                break;
            case "mapo-input-element-open-cam":
                this.flip_camera();
                app.app_globals.mapo_map.set_map_view_to_location(app.app_globals.mapo_user.user_location);
                if (this.app_globals.is_filter_view == true) {
                    app.flip_filter_view();
                }

                if (this.app_globals.is_about_view) {
                    this.flip_about_view();
                }

                break;
            case "mapo-input-element-text":

                setTimeout(function () {

                    location_to_use = app.get_selected_location_to_use();
                    app.app_globals.mapo_map.set_map_view_to_location(location_to_use);

                    $("#mapo-chat").animate({ scrollTop: $("#mapo-chat").prop("scrollHeight") });

                }, 100);


                if (this.app_globals.is_filter_view == true) {
                    app.flip_filter_view();
                }

                if (this.app_globals.is_about_view) {
                    this.flip_about_view();
                }

                break;
            case "camera-click-button":
                this.close_camera();
                break;

            case "camera-flip-btn-control":
                this.switch_camera_video_input();
                break;

            case "video":
                this.cancel_camera();
                break;
            case "login-cancel-btn-control":
                this.cancel_login();
                break;

            case "mapo-show-image-element":
                this.flip_image_view(e);
                break;
            case "mapo-navigator-appLogo":
                if (this.app_globals.is_camera_view != true && this.app_globals.is_image_view != true) {
                    this.flip_about_view(e);
                    if (this.app_globals.is_chat_view) {
                        this.flip_chat_view();
                    }
                    if (this.app_globals.is_login_view) {
                        this.cancel_login();
                    }
                }
                if (this.app_globals.is_filter_view==true) {
                    app.flip_filter_view();
                }


                break;
            case "popup-item-show-item-btn":

                $(".chatItem").each(function () {

                    $(this).removeClass("selected_chat_item");

                });

                this.flip_chat_view();
                $("#mapo-chat").animate(
                    {
                        scrollTop: document.getElementById(item_id + "*chat-item-id").offsetTop
                    },
                    500,
                    'linear'
                );

                document.getElementById(item_id + "*chat-item-id").className += " selected_chat_item";

                break;

            case "mapo-navigator-userThumbnail":

                if (this.app_globals.is_camera_view != true && this.app_globals.is_image_view != true) {

                    this.open_auth_element();

                    if (this.app_globals.is_chat_view) {
                        this.flip_chat_view();
                    }
                    if (this.app_globals.is_about_view) {
                        this.flip_about_view();
                    }
                  
                }

                if (this.app_globals.is_filter_view == true) {
                    app.flip_filter_view();
                }

                break;

            case 'mapo-navigator-filter':

                app.flip_filter_view();

                if (this.app_globals.is_login_view) {
                    this.cancel_login();
                }
                if (this.app_globals.is_about_view) {
                    this.flip_about_view();
                }

                if (this.app_globals.is_camera_view) {
                    this.cancel_camera();
                }
                if (this.app_globals.is_image_view) {
                    this.flip_image_view(e);
                }


                break;

            //filters
            case 'mapo-filter-text-messages':
                app.app_globals.mapo_user.user_current_filter_settings.show_text_message = !app.app_globals.mapo_user.user_current_filter_settings.show_text_message;
                app.filter_icon_clicked();
                break;

            case 'mapo-filter-second-hand':
                app.app_globals.mapo_user.user_current_filter_settings.show_second_hand = !app.app_globals.mapo_user.user_current_filter_settings.show_second_hand;
                app.filter_icon_clicked();
                break;

            case 'mapo-filter-hazard':
                app.app_globals.mapo_user.user_current_filter_settings.show_hazard = !app.app_globals.mapo_user.user_current_filter_settings.show_hazard;
                app.filter_icon_clicked();
                break;

            case 'mapo-filter-event':
                app.app_globals.mapo_user.user_current_filter_settings.show_event = !app.app_globals.mapo_user.user_current_filter_settings.show_event;
                app.filter_icon_clicked();
                break;

            case 'mapo-filter-help':
                app.app_globals.mapo_user.user_current_filter_settings.show_help = !app.app_globals.mapo_user.user_current_filter_settings.show_help;
                app.filter_icon_clicked();
                break;

            case 'mapo-filter-coupon':
                app.app_globals.mapo_user.user_current_filter_settings.show_coupon = !app.app_globals.mapo_user.user_current_filter_settings.show_coupon;
                app.filter_icon_clicked();
                break;

            case 'mapo-filter-advertisement':
                app.app_globals.mapo_user.user_current_filter_settings.show_advertisement = !app.app_globals.mapo_user.user_current_filter_settings.show_advertisement;
                app.filter_icon_clicked();
                break;




            case "set-user-locations-a":
                
                app.set_location_obj("a");
                $("#user-location-obj-row-input-a").select();
                break;

            case "set-user-locations-b":
                
                app.set_location_obj("b");
                $("#user-location-obj-row-input-b").select();
                break;



            case "user-current-location-row-title":
                app.select_location_to_use("gps");
                break;

            case "user-current-location-row":
                app.select_location_to_use("gps");
                break;

            case "user-location-obj-row-title-a":
                app.select_location_to_use("a");
                break;

            case "user-location-obj-row-a":
                app.select_location_to_use("a");
                break;

            case "user-location-obj-row-b":
                app.select_location_to_use("b");
                break;

            case "user-location-obj-row-title-b":
                app.select_location_to_use("b"); 
                break;


            default:
        }
        e.stopPropagation();

    }


    this.select_location_to_use = function (location_to_use) {

        if (app.app_globals.mapo_user.user_selected_location != location_to_use) {

            app.app_globals.mapo_user.user_selected_location = location_to_use;

            app.reset_http_headers();


            app.app_globals.latest_get_items_hash = "";

            $(".user-location-obj-row").each(function () {
                $(this).removeClass("selectedLocation");
            });

            switch (location_to_use) {
                case "gps": $("#user-current-location-row").toggleClass("selectedLocation");
                    app.app_globals.mapo_map.set_map_view_to_location(app.app_globals.mapo_user.user_location);

                    break;
                case "a": $("#user-location-obj-row-a").toggleClass("selectedLocation");
                    app.app_globals.mapo_map.set_map_view_to_location(app.app_globals.mapo_user.user_locations.location_a);
                    break;
                case "b": $("#user-location-obj-row-b").toggleClass("selectedLocation");
                    app.app_globals.mapo_map.set_map_view_to_location(app.app_globals.mapo_user.user_locations.location_b);
                    break;
                default:
            }


            app.app_globals.should_get_items_after_get_topics = true;
            app.get_topics_from_server();


            setTimeout(function () {

                app.cancel_login();
                app.app_globals.mapo_chat.clear_all_chat_items();
                document.getElementById("mapo-chat").style.backgroundImage = 'url("https://raw.githubusercontent.com/Metallicode/mapo/master/assets/mapo-image-loading.gif")';
                app.flip_chat_view();

            }, 500);

        }

    }

    this.set_location_obj = function (location_to_set) {

        //this is how to get the current map location.. but we dont want this...
        mapo_loc = {

            lat: app.app_globals.mapo_map.mapo_map.getCenter().lat,
            lon: app.app_globals.mapo_map.mapo_map.getCenter().lng

        }


        //mapo_loc = {

        //    lat: app.app_globals.mapo_user.user_location.lat,
        //    lon: app.app_globals.mapo_user.user_location.lon

        //}



        switch (location_to_set) {
            case "a":

                if (app.app_globals.set_location_a ==true) {
                    app.app_globals.mapo_user.user_locations.location_a = mapo_loc;
                    $("#set-user-locations-a").attr("src", app.app_globals.mapo_app_images.mapo_login_save_location_icon);
                    $("#user-location-obj-row-title-a").hide();
                    $("#user-location-obj-row-input-a").show();
                    $("#user-location-obj-row-input-a").val($("#user-location-obj-row-title-a").text());
                    app.app_globals.set_location_a = false;
                } else {

                    //save location
                    $("#user-location-obj-row-title-a").show();
                    $("#user-location-obj-row-input-a").hide();
                    $("#set-user-locations-a").attr("src", app.app_globals.mapo_app_images.mapo_login_set_location_icon);
                    app.app_globals.mapo_user.user_locations.location_a_name = $("#user-location-obj-row-input-a").val();
                    $("#user-location-obj-row-title-a").text(app.app_globals.mapo_user.user_locations.location_a_name);
                    app.app_globals.set_location_a = true;


                    app.save_locations_obj_to_server();
                }



                break;
            case "b":

                if (app.app_globals.set_location_b == true) {
                    app.app_globals.mapo_user.user_locations.location_b = mapo_loc;
                    $("#set-user-locations-b").attr("src", app.app_globals.mapo_app_images.mapo_login_save_location_icon);
                    $("#user-location-obj-row-title-b").hide();
                    $("#user-location-obj-row-input-b").show();
                    $("#user-location-obj-row-input-b").val($("#user-location-obj-row-title-b").text());
                    app.app_globals.set_location_b = false;
                } else {

                    //save location
                    $("#user-location-obj-row-title-b").show();
                    $("#user-location-obj-row-input-b").hide();
                    $("#set-user-locations-b").attr("src", app.app_globals.mapo_app_images.mapo_login_set_location_icon);
                    app.app_globals.mapo_user.user_locations.location_b_name = $("#user-location-obj-row-input-b").val();
                    $("#user-location-obj-row-title-b").text(app.app_globals.mapo_user.user_locations.location_b_name);
                    app.app_globals.set_location_b = true;


                    app.save_locations_obj_to_server();
                }


                break;
            default:
        }


    }

    ///CHAT 

    this.chat_item_click = function (e) {

        chat_item_location = {
            lat: e.target.closest('.chatItem').getAttribute("chat_item_lat"),
            lon: e.target.closest('.chatItem').getAttribute("chat_item_lon")
        }


        app.app_globals.mapo_map.set_map_view_to_location(chat_item_location);


    }

    this.chat_item_menu_click = function (e, item_id) {

        scroll_heigth = $("#mapo-chat").prop("scrollTop");

        this.flip_input_view();

        chat_item = $(e.target).closest(".chatItem").find(".mapo-chat-item-private-message-text-div");

        mapo_log("clicked menu on item " + item_id);

        if (!app.app_globals.is_chat_item_private_message_view) {

            this.create_chat_item_message_element();
            app.app_globals.is_chat_item_private_message_view = true;
        } else {
            this.remove_chat_item_message_element();   
            app.app_globals.is_chat_item_private_message_view = false;
        }


        $("#mapo-chat").animate(
            {
                scrollTop: document.getElementById(item_id + "*chat-item-id").offsetTop
            },
            500,
            'linear'
        );


        //$("#mapo-chat").animate({ scrollTop: scroll_heigth});//could be better
        
    }

    this.create_chat_item_message_element = function () {

        text_element = '<textarea onclick="app.mapo_UI_click(event)" dir="auto" id="' + item_id + '_chat-item-private-message-text" class="mapo-chat-item-private-message-text"></textarea>\
<img class="mapo-item-message-btn" onclick="app.mapo_UI_click(event)" id="mapo-chat-item-message-user" src="'+ app.app_globals.mapo_app_images.mapo_send_private_message_btn + '"/>';
       /// <img type="button" class="mapo-item-message-btn" onclick="app.mapo_UI_click(event)" id="mapo-chat-item-report-item" src="'+ app.app_globals.mapo_app_images.mapo_flag_item_btn + '" />';
        chat_item.append(text_element);
        $(".mapo-chat-item-private-message-text").animate({ height: '15vh' });
    }

    this.remove_chat_item_message_element = function () {

        $(".mapo-chat-item-private-message-text").animate({ height: '0vh' }, "fast", function () {
            $(this).remove();
            $(".mapo-item-message-btn").remove();

        });
    }




    //DATA FUNCTIONS

    this.fiter_markers_manager = function (mapo_item) {

        show_item = false;

        switch (mapo_item.type) {
            case "text-message":
                show_item = app.app_globals.mapo_user.user_current_filter_settings.show_text_message;
                break;
            case "coupon":
                show_item = app.app_globals.mapo_user.user_current_filter_settings.show_coupon;
                break;
            case "advertisement":
                show_item = app.app_globals.mapo_user.user_current_filter_settings.show_advertisement;
                break;
            case "event":
                show_item = app.app_globals.mapo_user.user_current_filter_settings.show_event;
                break;
            case "hazard":
                show_item = app.app_globals.mapo_user.user_current_filter_settings.show_hazard;
                break;
            case "second-hand":
                show_item = app.app_globals.mapo_user.user_current_filter_settings.show_second_hand;
                break;
            case "help":
                show_item = app.app_globals.mapo_user.user_current_filter_settings.show_help;
                break;

            default:
        }

        return show_item;

    }


    this.render_markers_and_chat_items = function () {

        app.app_globals.mapo_map.clear_all_map_markers();
        app.app_globals.mapo_chat.clear_all_chat_items();
        app.app_globals.mapo_map.put_items_as_markers_on_map(app.app_globals.mapo_items_collection);
        app.app_globals.mapo_chat.put_items_as_chat_item_in_chat(app.app_globals.mapo_items_collection);
    }


    this.populate_app_data = function (res) {

        res_obj = this.app_globals.parse_res_to_json(res);

        mapo_log(res_obj);

        if (this.app_globals.check_if_new_hash(res_obj.hash)) {

            mapo_log("new items from server");

            app.app_globals.mapo_items_collection = null;
            app.app_globals.mapo_map.clear_all_map_markers();
            app.app_globals.mapo_chat.clear_all_chat_items();

 
            app.app_globals.mapo_items_collection = this.app_globals.return_time_sorted_mapo_items_from_json(res_obj);
            this.app_globals.mapo_map.put_items_as_markers_on_map(app.app_globals.mapo_items_collection);
            this.app_globals.mapo_chat.put_items_as_chat_item_in_chat(app.app_globals.mapo_items_collection);

            this.app_globals.latest_get_items_hash = res_obj.hash;
        }

    }


    //SHOW IMAGE
    this.flip_image_view = function (e) {

        if (this.app_globals.is_image_view == false) {
            $("#mapo-show-image-element").attr('src', app.app_globals.mapo_app_images.mapo_image_view_placeholder);
            $("#mapo-show-image-element").animate({ top: '10vh' });

            //this.get_image_from_server(e.target.getAttribute("mapo_data_item_id"));

            $("#mapo-show-image-element").attr('src', app.app_globals.mapo_API_urls.get_direct_image_from_id_url + e.target.getAttribute("mapo_data_item_id"));

        } else {
            $("#mapo-show-image-element").animate({ top: '200vh' });         
        }
 
        this.app_globals.is_image_view = !this.app_globals.is_image_view;
        
    }


    ////SERVER CALLS**********************************************************************************************

    this.success_get_locations_obj_callback = function (res) {

        mapo_log("success_get_locations_obj_callback called");

        loc_obj_from_server = JSON.parse(res);

        app.app_globals.mapo_user.user_locations.location_a = app.app_globals.convert_location_string_to_obj(loc_obj_from_server.savedLocation[0]);
        app.app_globals.mapo_user.user_locations.location_a_name = loc_obj_from_server.savedLocationName[0];
        app.app_globals.mapo_user.user_locations.location_b = app.app_globals.convert_location_string_to_obj(loc_obj_from_server.savedLocation[1]);
        app.app_globals.mapo_user.user_locations.location_b_name = loc_obj_from_server.savedLocationName[1];

        $("#user-location-obj-row-title-a").text(app.app_globals.mapo_user.user_locations.location_a_name);
        $("#user-location-obj-row-title-b").text(app.app_globals.mapo_user.user_locations.location_b_name);
    }

    this.error_get_locations_obj_callback = function (request, status, error) {

        mapo_log("error_get_locations_obj_callback called");

    }


    this.get_locations_obj_from_server = function () {

        empty_obj = {}

        data_to_send = JSON.stringify(empty_obj);

        $.ajax({
            type: 'POST',
            headers: app.app_globals.http_headers,
            url: app.app_globals.mapo_API_urls.api_get_saved_locations,
            data: data_to_send,
            contentType: 'application/json',
            success: app.success_get_locations_obj_callback,
            error: app.error_get_locations_obj_callback
        });


    }


    ///SAVE USER LOCATIONS
    this.success_save_locations_obj_callback = function (res) {

        mapo_log("success_save_locations called");

    }

    this.error_save_locations_obj_callback = function (request, status, error) {

        mapo_log("ERROR_save_locations called");

    }

    this.save_locations_obj_to_server = function () {

        mapo_log("save_locations_obj_to_server called");

        loc_to_server = {

            savedLocationName: [
                app.app_globals.mapo_user.user_locations.location_a_name,
                app.app_globals.mapo_user.user_locations.location_b_name
            ],
            savedLocation: [
                app.app_globals.convert_location_objct_to_string(app.app_globals.mapo_user.user_locations.location_a),
                app.app_globals.convert_location_objct_to_string(app.app_globals.mapo_user.user_locations.location_b)
            ]
        }

        data_to_send = JSON.stringify(loc_to_server);


        $.ajax({
            type: 'POST',
            headers: app.app_globals.http_headers,
            url: app.app_globals.mapo_API_urls.api_save_locations,
            data: data_to_send,
            contentType: 'application/json',
            success: app.success_save_locations_obj_callback,
            error: app.error_save_locations_obj_callback
        });

    }



    ///TOPICS
    this.error_get_topics = function (request, status, error) {
        app.app_globals.app_is_busy = false;

        mapo_log("Error get_topics: " + error);

    }

    this.success_get_topics = function (res) {

        mapo_log("topics returnd ok: " + res);

        app.app_globals.app_is_busy = false;

        if (app.app_globals.should_get_items_after_get_topics == true) {
            mapo_log("calling get items from get topics callback");
            app.get_items_from_server();
        }

        topics_obj = app.app_globals.parse_res_to_json(res);

        if (app.app_globals.mapo_socket_client.connected) {
            if (app.app_globals.mapo_socket_client.connected == true) {

                if (app.app_globals.mapo_current_topic != null) {
                    app.app_globals.mapo_topics_manager[app.app_globals.mapo_current_topic].unsubscribe();
                    delete app.app_globals.mapo_topics_manager[app.app_globals.mapo_current_topic];
                }

               sub_obj = app.app_globals.mapo_socket_client.subscribe(topics_obj.topics[0], app.server_returns_message);
               app.app_globals.mapo_current_topic = topics_obj.topics[0];
               app.app_globals.mapo_topics_manager[topics_obj.topics[0]] = sub_obj;

            }
        }

    }

    this.get_topics_from_server = function () {

        app.app_globals.app_is_busy = true;

        mapo_log("get_topics called");

        if (app.app_globals.mapo_user.user_auth != "") {
            app.reset_http_headers();

            $.ajax({
                type: 'GET',
                headers: app.app_globals.http_headers,
                url: app.app_globals.mapo_API_urls.get_topics,
                success: app.success_get_topics,
                error: app.error_get_topics
            });
        } else {

            setTimeout(app.get_topics_from_server, 4000);

            mapo_log("get_topics_from_server waiting for user auth...");

        }

    }



    ///GET ITEMS
    this.success_get_items_callback = function (res) {

        app.app_globals.app_is_busy = false;

        app.app_globals.should_get_items_after_get_topics = false;

        app.app_globals.should_get_chat_items_images_while_scrooling = false;

        document.getElementById("mapo-chat").style.backgroundImage = "url()";

        mapo_log("success_get_items");
        
        app.populate_app_data(res);

        if (app.app_globals.mapo_chat_auto_scroll_on_get_items == true) {
            if (app.app_globals.is_chat_view == true && app.app_globals.is_chat_item_private_message_view == false) {
                $("#mapo-chat").animate({ scrollTop: $("#mapo-chat").prop("scrollHeight") });
            }

            setTimeout(function () {
                app.app_globals.should_get_chat_items_images_while_scrooling = true;
                app.app_globals.mapo_chat_scroll();
                $("#mapo-chat").animate({ scrollTop: $("#mapo-chat").prop("scrollHeight") });
            }, 1000);

        }

    }

    this.error_get_items_callback = function (request, status, error) {

        app.app_globals.app_is_busy = false;

        app.app_globals.should_get_items_after_get_topics = false;

        mapo_log("error_get_item: " + error);

    }

    this.get_items_from_server = function () {

        mapo_log("get_items_from_server called");

        app.app_globals.app_is_busy = true;

        loc_obj = {
            "current_location": app.app_globals.mapo_user.user_location.lat + "," + app.app_globals.mapo_user.user_location.lon
        }

        data_to_send = JSON.stringify(loc_obj);

        $.ajax({
            type: 'POST',
            headers: app.app_globals.http_headers,
            url: app.app_globals.mapo_API_urls.get_items_url,
            data: data_to_send,
            contentType: 'application/json',
            success: app.success_get_items_callback,
            error: app.error_get_items_callback
        });
    }



    ///SEND ITEM
    this.error_send_item_to_server = function (request, status, error) {

        app.app_globals.app_is_busy = false;

        mapo_log("error_send_item " + error);
    }

    this.success_send_item_to_server = function (res) {

        mapo_log("success_send_item " + res);

        app.app_globals.latest_created_mapo_item_id = JSON.parse(res)._id;


        if (app.app_globals.new_image_data_buffer != null) {

            app.app_globals.mapo_camera.photo.parentNode.removeChild(app.app_globals.mapo_camera.photo);

            //app.send_low_res_image_to_server(JSON.parse(res)._id);

            app.send_image_to_server(JSON.parse(res)._id);

        } else {
            app.app_globals.app_is_busy = false;

            //app.refresh_now();
        }
    }

    this.send_item_to_server = function(mapo_item) {

        app.app_globals.app_is_busy = true;

        newItem = {
            text: mapo_item.text,
            type: mapo_item.type,
            location: mapo_item.location,
            isAnonymous: app.app_globals.mapo_user.anonymous_mode,
            photoPromise: mapo_item.photoPromise
        }

        data_to_send = JSON.stringify(newItem);

        $.ajax({
            type: 'POST',
            url: this.app_globals.mapo_API_urls.post_new_item_url,
            data: data_to_send,
            headers: app.app_globals.http_headers,
            contentType: 'application/json',
            success: app.success_send_item_to_server,
            error: app.error_send_item_to_server
        });

    }



    ///POST IMAGE
    this.success_send_image_to_server = function (res) {

        app.app_globals.app_is_busy = false;

        mapo_log("success_send_image " + res);

        app.app_globals.new_image_data_buffer = null;

        //app.refresh_now();

    }

    this.error_send_image_to_server = function (request, status, error) {

        app.app_globals.app_is_busy = false;

        mapo_log(request.responseText);

        //should we give it a second chance?
        this.app_globals.new_image_data_buffer = null;
       
    }

    this.send_image_to_server = function (item_id) {
        
            mapo_log("send_image_to_server");

            var formData = new FormData();
            newBlob = new Blob([app.app_globals.new_image_data_buffer], { type: "image/jpeg" });
            formData.append("file", newBlob, item_id);

            $.ajax({
                type: 'POST',
                url: app.app_globals.mapo_API_urls.post_new_image_url,
                data: formData,
                headers: app.app_globals.http_headers,
                processData: false,
                contentType: false,
                success: app.success_send_image_to_server,
                error: app.error_send_image_to_server
            });

        

    }



    this.success_send_low_res_image_to_server = function (res) {

        mapo_log("success_send_low_res_image " + res);

        app.app_globals.new_low_res_image_data_buffer = null;

    }

    this.error_send_low_res_image_to_server = function (request, status, error) {

        mapo_log(request.responseText);

        this.app_globals.new_low_res_image_data_buffer = null;
    }

    this.send_low_res_image_to_server = function (item_id) {

        mapo_log("send_low_res_image_to_server");

        var formData = new FormData();
        newBlob = new Blob([app.app_globals.new_low_res_image_data_buffer], { type: "image/jpeg" });
        formData.append("file", newBlob, item_id+"PreviewImage");

        $.ajax({
            type: 'POST',
            url: app.app_globals.mapo_API_urls.post_new_image_url,
            data: formData,
            headers: app.app_globals.http_headers,
            processData: false,
            contentType: false,
            success: app.success_send_low_res_image_to_server,
            error: app.error_send_low_res_image_to_server
        });



    }





    ///GET IMAGE
    this.success_get_image_from_server = function (res) {

        $("#mapo-show-image-element").attr('src', res);

    }

    this.get_image_from_server = function (item_id) {

        $.ajax({
            type: 'GET',
            headers: app.app_globals.http_headers,
            url: this.app_globals.mapo_API_urls.get_image_from_id_url + "/" + item_id,
            success: this.success_get_image_from_server
        });

    }



    ///UPVOTE DOWNVOTE
    this.success_upvote_item = function (res) {
        mapo_log("item upvoted ok! " + res);
        app.refresh_now();
    }

    this.error_upvote_item = function (request, status, error) {
        mapo_log("item upvoted ok! " + request.responseText);
    }

    this.upvote_item = function (item_id) {

        mapo_log("upvote_item called on item: " + item_id);

        upvote_data = {
            "_id": item_id
        }

        data_to_send = JSON.stringify(upvote_data);

        $.ajax({
            type: 'POST',
            data: data_to_send,
            contentType: 'application/json',
            headers: app.app_globals.http_headers,
            url: this.app_globals.mapo_API_urls.up_vote,
            success: this.success_upvote_item,
            error: this.error_upvote_item
        });





    }

    this.success_downvote_item = function (res) {
        mapo_log("item downvote ok! " + res);
        app.refresh_now();
    }

    this.error_downvote_item = function (request, status, error) {
        mapo_log("item downvote ok! " + request.responseText);
    }

    this.downvote_item = function (item_id) {

        mapo_log("downvote_item called on item: " + item_id);

        downvote_data = {
            "_id": item_id
        }

        data_to_send = JSON.stringify(downvote_data);

        $.ajax({
            type: 'POST',
            data: data_to_send,
            contentType: 'application/json',
            headers: app.app_globals.http_headers,
            url: this.app_globals.mapo_API_urls.down_vote,
            success: this.success_downvote_item,
            error: this.error_downvote_item
        });
    }

    this.remove_item = function (item_id) {




    }

}

function MapoMapProvider() {
    if (mapo_app == null) {
        mapo_app = new MapoApp();
    }
    return mapo_app;

}