function MapoMap(instance) {

    this.max_zoom = 21;
    this.current_zoom = 17;
    this.min_zoom = 12;

    this.map_range = null;
    this.app_default_location = { lat: 19.0752437, lon: 72.8356573 };
    this.map_html_element = document.getElementById("mapo-map");


    this.get_marker_image_link_from_type = function (item_type) {

        linkToImage = "";


        switch (item_type) {

            case ("help"):
                linkToImage = instance.app_globals.mapo_app_images.mapo_marker_icon_help;
                break;

            case ("coupon"):
                linkToImage = instance.app_globals.mapo_app_images.mapo_marker_icon_coupon;
                break;

            case ("advertisement"):
                linkToImage = instance.app_globals.mapo_app_images.mapo_marker_icon_advertisement;
                break;

            case ("event"):
                linkToImage = instance.app_globals.mapo_app_images.mapo_marker_icon_event;
                break;

            case ("hazard"):
                linkToImage = instance.app_globals.mapo_app_images.mapo_marker_icon_hazard;
                break;

            case ("second-hand"):
                linkToImage = instance.app_globals.mapo_app_images.mapo_marker_icon_second_hand;
                break;

            case ("text-message"):
                linkToImage = instance.app_globals.mapo_app_images.mapo_marker_icon_text_message;
                break;


            default:
                linkToImage = instance.app_globals.mapo_app_images.mapo_marker_icon_test_image;
        }


        return linkToImage;


    }

    this.return_marker_from_mapo_item = function (mapo_item) {

        myIcon = L.icon({
            iconUrl: this.get_marker_image_link_from_type(mapo_item.type),
            iconSize: [200,200],
            iconAnchor: [36, 74],
            popupAnchor: [-3, -76],
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
        });


        mapo_item_location_obj = instance.app_globals.convert_location_string_to_obj(mapo_item.location);

        marker = L.marker([mapo_item_location_obj.lat, mapo_item_location_obj.lon], { icon: myIcon });

        marker.bindPopup("<p class='mapo-pop-up-item' dir='auto'>" +
            instance.app_globals.popup_string_format_halper(mapo_item.text) +
            "<br/>" +
            "<br/>" +
            "<input type='button' value='view' class='popup-item-show-item-btn' onclick='app.mapo_UI_click(event)' id='" + mapo_item.id +"*popup-item-show-item-btn'"+ " mapo-item-id=" + mapo_item.id + ">" +
            "</p>");

        marker.get_mapo_item_id = function () {

            return mapo_item.id;

        }

        return marker;


    }



    this.on_map_click = function (e) {
        mapo_log("map click " + e.latlng.lat + " " + e.latlng.lng);


        fakeitem = {

            id: 123,
            type: "hazard",
            location: e.latlng.lat + "," + e.latlng.lng

        }


        var new_marker = app.app_globals.mapo_map.return_marker_from_mapo_item(fakeitem);

        /////MARKER IS CREATED



    }


    //create the actual map from map framwork
    if (this.map_html_element != null) {

        mymap = L.map('mapo-map');

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2NpdHkiLCJhIjoiY2pzMHExeGIzMW05OTQ0dWtvNmIxMWp2NyJ9.4AZhnhFxf_Wyrp8-9FjgWg', {
            maxZoom: 20,
            minZoom: 12,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiZ2NpdHkiLCJhIjoiY2pzMHExeGIzMW05OTQ0dWtvNmIxMWp2NyJ9.4AZhnhFxf_Wyrp8-9FjgWg'
        }).addTo(mymap);


        mymap.on('click', this.on_map_click);

        this.mapo_map = mymap;

    } else {
        this.mapo_map = null;
    }

    this.set_map_view_to_location = function (location) {
        this.mapo_map.setView([location.lat, location.lon], this.max_zoom);
    }

    this.put_marker_on_map = function (marker) {
        marker.addTo(this.mapo_map);

    }

    this.remove_marker_from_map = function (marker) {
        marker.removeFrom(this.mapo_map);

    }

    this.clear_all_map_markers = function () {

        //for (var i = 0; i < this.mapo_markers.length; i++) {
        //    this.remove_marker_from_map(this.mapo_markers[i]);
        //    delete app.app_globals.mapo_map.mapo_markers[i];
        //}

        this.mapo_map.eachLayer(function (layer) {
            if (layer.get_mapo_item_id != null) {

                layer.remove();
            }
            
        });


    }

    this.put_items_as_markers_on_map = function (mapo_items) {

        for (var i = 0; i < mapo_items.length; i++) {

            for (var i = 0; i < mapo_items.length; i++) {

                if (app.fiter_markers_manager(mapo_items[i]) == true) {

                    this.put_marker_on_map(this.return_marker_from_mapo_item(mapo_items[i]));
                }
            }
        }
    }

}



function MapoAppProvider(instance) {

    if (instance.mapo_map == null) {
        return new MapoMap(instance);
    }
    else {

        return instance.mapo_map;
    }


}