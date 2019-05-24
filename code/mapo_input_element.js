function get_input_element_html(app_globals) {

    input_element_html = '<div onclick="app.mapo_UI_click(event)" id="mapo-input-element">\
        <img  id="mapo-input-element-open-cam" src="'+ app_globals.mapo_app_images.mapo_input_open_camera+'"/>\
        <div id="mapo-input-element-text-and-preview-div"><div dir="auto" onclick="app.mapo_UI_click(event)" id="mapo-input-element-text" contenteditable="true"></div></div>\
        <img id="mapo-input-element-post-item" src="'+ app_globals.mapo_app_images.mapo_input_post_item +'" />\
    </div>';
    return input_element_html;

} 