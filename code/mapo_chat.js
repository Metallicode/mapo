function MapoChat(instance) {

    this.mapo_chat_elements = new Array();

    this.chat_html_element = document.getElementById("mapo-chat");

    this.chat_item_type_icon_selector = function (item_type) {

        return app.app_globals.mapo_app_images.mapo_chat_item_type_base_url + item_type + '.png';

    }

    this.return_chat_item_from_mapo_item = function (mapo_item) {

        chat_item_location = app.app_globals.convert_location_string_to_obj(mapo_item.location);

        chat_item_time_string = app.app_globals.convert_time_to_nice_time(mapo_item.time);

        preview_image_element = "";

        // && mapo_item.photoPromise != null

        if (mapo_item.hasPhoto != null) {
            if (mapo_item.hasPhoto == true || mapo_item.photoPromise == true) {
                preview_image_element = '<div id="' + mapo_item.id + '*mapo-chat-item-p-image" onclick="app.flip_image_view(event)" mapo_data_item_id="' + mapo_item.id + '" class="chat_item_image" style="background-image:url(' + app.app_globals.mapo_app_images.mapo_image_view_placeholder + ')"></div>';
            } else {
               
            }
        }


        if (app.app_globals.is_this_item_close_to_user_location(mapo_item)) {
            upVoteElement = '<img mapo-data="allowVote" onclick="app.mapo_UI_click(event)" id="' + mapo_item.id + '*chat-upvote-item-id" class="mapo-item-voter" src="' + app.app_globals.mapo_app_images.mapo_chat_upvote_active + '"/>';
            downVoteElement = '<img mapo-data="allowVote" onclick="app.mapo_UI_click(event)" id="' + mapo_item.id + '*chat-downvote-item-id" class="mapo-item-voter" src="' + app.app_globals.mapo_app_images.mapo_chat_downvote_active + '"/>';
        } else {
            upVoteElement = '<img mapo-data="noVote" onclick="app.mapo_UI_click(event)" id="' + mapo_item.id + '*chat-upvote-item-id" class="mapo-item-voter" src="' + app.app_globals.mapo_app_images.mapo_chat_upvote + '"/>';
            downVoteElement = '<img mapo-data="noVote" onclick="app.mapo_UI_click(event)" id="' + mapo_item.id + '*chat-downvote-item-id" class="mapo-item-voter" src="' + app.app_globals.mapo_app_images.mapo_chat_downvote + '"/>';
        }




        new_chat_html = '<div onclick="app.chat_item_click(event)" id="' + mapo_item.id + '*chat-item-id" class="chatItem" chat_item_lat=' + chat_item_location.lat
            + ' chat_item_lon=' + chat_item_location.lon
            + '><div class="chatItemHeaders"><img class="chat-item-type-icon" src="' + app.app_globals.mapo_chat.chat_item_type_icon_selector(mapo_item.type) +'"/><span class="chatItemUserName">' + mapo_item.user
            + '</span><span class="chatItemTime">' + chat_item_time_string
            + '</span>'
            + '</div><h2 class="chatItemMsgText" dir="auto">' + mapo_item.text
            + '</h2>'
            + '<div class="chat_item_image_div"></div>'
            + '<div class="mapo-chat-item-controls">'
            //+ '<img onclick="app.mapo_UI_click(event)" id="' + mapo_item.id + '*chat-item-menu-id" class="mapo-chat-item-menu" src="' + app.app_globals.mapo_app_images.mapo_chat_item_menu + '"/>'
            //+ '<div class="mapo-item-vote-container">'
            //+ upVoteElement
            //+ ' <sup><span class="mapo-item-voter-score">' + mapo_item.upVotes +'</span> </sup>'
            //+ downVoteElement
            //+ ' <sup><span class="mapo-item-voter-score">' + mapo_item.downVotes + '</span> </sup>'
            //+ '</div>'
            +  preview_image_element 
            //+ '<div class="mapo-chat-item-private-message-text-div"></div><br/><br/>'
            + '</div>'
            + '</div>';

        return new_chat_html;

    }

    this.put_chat_item_in_chat = function (chat_item) {

        this.chat_html_element.innerHTML += chat_item;
        this.mapo_chat_elements.push(chat_item);
    }

    this.put_items_as_chat_item_in_chat = function (mapo_items) {

        for (var i = 0; i < mapo_items.length; i++) {

            if (app.fiter_markers_manager(mapo_items[i]) == true) {
                this.put_chat_item_in_chat(this.return_chat_item_from_mapo_item(mapo_items[i]));
            }  
        }
    }

    this.clear_all_chat_items = function () {

        this.mapo_chat_elements = [];
        this.chat_html_element.innerHTML = "";

    }


}

function MapoChatProvider(instance) {

    if (instance.mapo_chat == null) {
        return new MapoChat();
    }
    else {

        return instance.mapo_chat;
    }


}