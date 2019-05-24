function MapoApiUrls(app_environment) {

    if (app_environment == "DEV") {

        this.get_items_url = "./get_items";
        this.post_new_item_url = "./api_new_item";

        this.get_direct_image_from_id_url = "https://s3.eu-de.cloud-object-storage.appdomain.cloud/mapo-dev/";
        this.get_image_from_id_url = "./api_image";

        this.post_new_image_url = "./api_upload_file";

        this.get_new_items_socket_server = "./mapo-stomp";
        this.get_topics = "./get_topics";

        this.remove_item_url = "./api_remove_item";
        this.get_tags = "./get_tags";
        this.up_vote = "./api_up_vote";
        this.down_vote = "./api_down_vote";

        this.api_save_locations = "./api_save_locations";
        this.api_get_saved_locations = "./api_get_saved_locations";

    }

}



function MapoApiUrlsMaker(app_environment) {

    return new MapoApiUrls(app_environment);

}