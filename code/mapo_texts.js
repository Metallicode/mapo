function MapoTexts(app_language) {

    if (app_language == "ENG") {

        this.about_mapo_text = "hi, bla bla bla bla bla....";

        //all buttons and controls must have same id as the correlating text element!!!
        this.btn_report_item = "report item";
        this.login_ok_btn = "OK";
        this.login_cancel_btn = "X";
        this.login_anonymous_mode_text = "Anonymous Mode";
        this.login_page_header_text = "Please Sign In";
        this.camera_cancel_btn = "X";

        this.item_menu_cancel_btn = "X";
        this.item_menu_title = "Send a private message:";

        this.defult_user_location_a_title = "Location A";
        this.defult_user_location_b_title = "Location B";

        this.mapo_about_mapo_header = "What is Mapo?";
        this.mapo_about_mapo_a = 'MaPo, as in "Ma"(what ?) and "Po"(Here) is a Real - time global message board, allocating messages based on GPS and user defined locations.';
        this.mapo_about_mapo_b = 'With MaPo, users can view all messages posted within the radius of their current location, and post messages & pictures from their current location.';
        this.mapo_about_mapo_c = 'Our aim is to allow a fast local based communication platform as a tool for local businesses to call out for their neighboring clients on a last minute sale or a place to look for new or old treasures someone nearby is giving away.';
        this.mapo_about_mapo_d = 'Our service is simple yet powerful.We have created a technology that supports multiple discreet data segments.That means that besides one public shared map, the Mapo platform can support as many private segments as there will be a demand for.';
        this.mapo_about_mapo_e = 'Our technology includes a novel hive shaped delivery architecture, by which Geo - Data is automatically distributed to the relevant clients, with a mobile WebApp in order to give the user a map oriented interface to our service.';

        this.mapo_about_terms_of_use_header = "Terms of use";
        this.mapo_about_terms_of_use = "Don't do evil things on this app!";

        this.mapo_contact_header = "Contact Mapo";
        this.mapo_contact_mapo = "Local business can contact us and get a special publicity service to target their local custumers.";


    }

}



function MapoTextsMaker(app_language) {

    return new MapoTexts(app_language);

}
