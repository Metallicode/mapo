function get_filter_html(app_globals) {

    filter_html = "<div onclick='app.mapo_UI_click(event)' id='mapo-filter'><div id='mapo-filter-icons-div'> \
            <img class='mapo-filter-icon' onclick='app.mapo_UI_click(event)' src = "+ app.app_globals.mapo_app_images.mapo_filter_text_message + " id = 'mapo-filter-text-messages' /> \
        <img class='mapo-filter-icon' onclick='app.mapo_UI_click(event)' src = "+ app.app_globals.mapo_app_images.mapo_filter_second_hand + " id = 'mapo-filter-second-hand' /> \
        <img class='mapo-filter-icon' onclick='app.mapo_UI_click(event)' src = "+ app.app_globals.mapo_app_images.mapo_filter_hazard + " id = 'mapo-filter-hazard' /> \
        <img class='mapo-filter-icon' onclick='app.mapo_UI_click(event)' src = "+ app.app_globals.mapo_app_images.mapo_filter_event + " id = 'mapo-filter-event' /> \
        <img class='mapo-filter-icon' onclick='app.mapo_UI_click(event)' src = "+ app.app_globals.mapo_app_images.mapo_filter_help + " id = 'mapo-filter-help' /> \
    <img class='mapo-filter-icon' onclick='app.mapo_UI_click(event)' src= "+ app.app_globals.mapo_app_images.mapo_filter_coupon + " id='mapo-filter-coupon' />  \
    <img class='mapo-filter-icon' onclick='app.mapo_UI_click(event)' src= "+ app.app_globals.mapo_app_images.mapo_filter_advertisement + " id='mapo-filter-advertisement' />\
    </div> \
</div > ";
    return filter_html;

} 



//<div id='mapo-filter-range-div'>\
//    <img class='mapo-filter-range-icon' onclick='app.mapo_UI_click(event)' src="+ app.app_globals.mapo_app_images.mapo_filter_small_radius + " id='mapo-filter-small-range-icon' />  \
//    <input onchange='app.range_slider_change(event)' min='0.1' max='1.0' value='1.0' step='0.1' id='mapo-filter-slider' type='range' />\
//    <img class='mapo-filter-range-icon' onclick='app.mapo_UI_click(event)' src="+ app.app_globals.mapo_app_images.mapo_filter_big_radius + " id='mapo-filter-big-range-icon' />  \
//    </div >\