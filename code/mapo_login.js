function get_mapo_login_element() {

    login_element = '<div onclick="app.mapo_UI_click(event)" id="user-login-element">\
        <center>\
            <div id="login-btn-login-div"><h1 id="login-btn-login-text">'+ app.app_globals.mapo_texts.login_page_header_text +'</h1>\
            <div id="login-btn-login" class="g-signin2" data-width="620" data-height="170" data-onsuccess="onSignIn"></div></div>\
           <h1 id="login-btn-logout"><a class="g-signin2_sigenOUT" id="login-btn-logout-a" href="#" onclick="app.signOut();">Sign out</a></h1>\
    <div id="login-anonymous-div"><lable id="login-anonymous-text" for="login-anonymous-checkbox">'+ app.app_globals.mapo_texts.login_anonymous_mode_text +'</lable><input type="checkbox" name="login-anonymous-checkbox"  id="login-anonymous-checkbox" onclick="app.set_user_anonymous_mode(event)"/></div>\
        </center>\
    </div >';


    return login_element;

}

function set_user_locations_element() {

    current_loc = '<div id="user-current-location-row" class="user-location-obj-row selectedLocation"><h2 id="user-current-location-row-title" class="user-location-obj-row-title">Current</h2></div>';
    location_a = '<div id="user-location-obj-row-a" class="user-location-obj-row"><h2 id="user-location-obj-row-title-a" class="user-location-obj-row-title">' + app.app_globals.mapo_texts.defult_user_location_a_title + '</h2><input id="user-location-obj-row-input-a" class="user-location-obj-row-input" type="text"/><img onclick="app.mapo_UI_click(event)" id="set-user-locations-a" class="user-location-obj-row-image" src="' + app.app_globals.mapo_app_images.mapo_login_set_location_icon + '"/></div>';
    location_b = '<div id="user-location-obj-row-b" class="user-location-obj-row"><h2 id="user-location-obj-row-title-b" class="user-location-obj-row-title">' + app.app_globals.mapo_texts.defult_user_location_b_title + '</h2><input id="user-location-obj-row-input-b" class="user-location-obj-row-input" type="text"/><img onclick="app.mapo_UI_click(event)" id="set-user-locations-b" class="user-location-obj-row-image" src="' + app.app_globals.mapo_app_images.mapo_login_set_location_icon + '"/></div>';

    login_element = document.getElementById("user-login-element");

    login_element.innerHTML += current_loc;
    login_element.innerHTML += location_a;
    login_element.innerHTML += location_b;

}

///<input onclick="app.mapo_UI_click(event)" class="login_ok_btn btn" id="login-cancel-btn-control" type="button" value="'+ app.app_globals.mapo_texts.login_cancel_btn +'" />\
///<input class="login_ok_btn btn" id="login-btn-control" type="button" value="'+ app.app_globals.mapo_texts.login_ok_btn +'" />\