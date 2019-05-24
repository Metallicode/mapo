function get_navigator_html(app_globals) {
    
    nav_html = "<div onclick='app.mapo_UI_click(event)' id='mapo-navigator'> \
            <img onclick='app.mapo_UI_click(event)' src = "+ app_globals.mapo_app_images.mapo_navigator_appLogo +" id = 'mapo-navigator-appLogo' /> \
        <img onclick='app.mapo_UI_click(event)' src = "+ app_globals.mapo_app_images.mapo_navigator_filter_icon +" id = 'mapo-navigator-filter' /> \
        <img onclick='app.mapo_UI_click(event)' src = "+ app_globals.mapo_app_images.mapo_navigator_map_icon +" id = 'mapo-navigator-map-chat-switcher' /> \
    <img onclick='app.mapo_UI_click(event)' src= "+ app_globals.mapo_app_images.mapo_navigator_userThumbnail +" id='mapo-navigator-userThumbnail' />  \
    </div > ";
    return nav_html;

} 


//        <img onclick='app.mapo_UI_click(event)' src = "+ app_globals.mapo_app_images.mapo_navigator_private_message_icon +" id = 'mapo-navigator-private-message' /> \