function MapoImages() {

    image_bucket_url = "https://raw.githubusercontent.com/Metallicode/mapo/master/";

    //login
    this.mapo_login_set_location_icon = image_bucket_url + 'assets/mapo-login-set-location-icon.png';
    this.mapo_login_save_location_icon = image_bucket_url +'assets/mapo-login-save-location-icon.png';


    //navigator
    this.mapo_navigator_appLogo = image_bucket_url+'assets/mapo-navigator-appLogo.png';
    this.mapo_navigator_userThumbnail = image_bucket_url +'assets/mapo-navigator-userThumbnail.png';
    this.mapo_navigator_anonymousThumbnail = image_bucket_url +'assets/mapo-navigator-anonymousThumbnail.png';
    this.mapo_navigator_filter_icon = image_bucket_url +'assets/mapo-navigator-filter-icon.png';
    this.mapo_navigator_map_icon = image_bucket_url +'assets/mapo-navigator-map-icon.png';
    this.mapo_navigator_chat_icon = image_bucket_url +'assets/mapo-navigator-chat-icon.png';
    this.mapo_navigator_private_message_icon = image_bucket_url +'assets/mapo-navigator-private-message-icon.png';

    //input elements
    this.mapo_input_post_item = image_bucket_url +"assets/mapo-input-post-item.png";
    this.mapo_input_open_camera = image_bucket_url +"assets/mapo-input-open-camera.png";


    //marker Images
    this.mapo_marker_icon_advertisement = image_bucket_url +'assets/mapo-marker-icon-advertisement.gif';
    this.mapo_marker_icon_event = image_bucket_url +'assets/mapo-marker-icon-event.gif';
    this.mapo_marker_icon_hazard = image_bucket_url +'assets/mapo-marker-icon-hazard.gif';
    this.mapo_marker_icon_second_hand = image_bucket_url +'assets/mapo-marker-icon-second-hand.gif';
    this.mapo_marker_icon_text_message = image_bucket_url +'assets/mapo-marker-icon-text-message.gif';
    this.mapo_marker_icon_help = image_bucket_url +'assets/mapo-marker-icon-help.gif';
    this.mapo_marker_icon_coupon = image_bucket_url +'assets/mapo-marker-icon-coupon.gif';
    this.mapo_marker_icon_test_image = image_bucket_url +'assets/mapo-marker-icon-test-image.png';


    //chat images
    this.mapo_chat_noImage = image_bucket_url +'assets/mapo-chat-noImage.png';
    this.mapo_chat_yesImage = image_bucket_url +'assets/mapo-chat-yesImage.png';
    this.mapo_chat_upvote = image_bucket_url +'assets/mapo-chat-upvote.png';
    this.mapo_chat_downvote = image_bucket_url +'assets/mapo-chat-downvote.png';
    this.mapo_chat_upvote_active = image_bucket_url +'assets/mapo-chat-upvote-active.png';
    this.mapo_chat_downvote_active = image_bucket_url +'assets/mapo-chat-downvote-active.png';
    this.mapo_chat_item_menu = image_bucket_url +'assets/mapo-chat-item-menu.png';

    //image view
    this.mapo_image_view_placeholder = image_bucket_url +'assets/mapo-image-loading.gif';


    //item menu
    this.mapo_flag_item_btn = image_bucket_url +'assets/mapo-flag-item-btn.png';
    this.mapo_send_private_message_btn = image_bucket_url +'assets/mapo-send-private-message-btn.png';


    //camera
    this.mapo_camera_flip = image_bucket_url +'assets/mapo-camera-flip.png';

    //filter
    this.mapo_chat_item_type_base_url = image_bucket_url + 'assets/filter-icons/mapo-filter-';

    this.mapo_filter_text_message = image_bucket_url +'assets/filter-icons/mapo-filter-text-message.png';
    this.mapo_filter_second_hand = image_bucket_url +'assets/filter-icons/mapo-filter-second-hand.png';
    this.mapo_filter_help = image_bucket_url +'assets/filter-icons/mapo-filter-help.png';
    this.mapo_filter_hazard = image_bucket_url +'assets/filter-icons/mapo-filter-hazard.png';
    this.mapo_filter_event = image_bucket_url +'assets/filter-icons/mapo-filter-event.png';
    this.mapo_filter_coupon = image_bucket_url +'assets/filter-icons/mapo-filter-coupon.png';
    this.mapo_filter_advertisement = image_bucket_url +'assets/filter-icons/mapo-filter-advertisement.png';
    this.mapo_filter_small_radius = image_bucket_url +'assets/filter-icons/mapo-filter-small-radius.png';
    this.mapo_filter_big_radius = image_bucket_url +'assets/filter-icons/mapo-filter-big-radius.png';

}



function MapoImagesMaker() {

    return new MapoImages();

}