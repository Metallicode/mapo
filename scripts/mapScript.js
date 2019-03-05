var GLOBAL_LOCATION = { lat: 32.0466879, lon: 34.7796028 };
var USER_LOCATION = { lat: null, lon: null };

var POST_NEW_ITEM_URL = "./new_item";
var GET_ITEMS_FROM_DB_URL = "./get_items";
var GET_IMAGE_FROM_ID_URL = "./image/";
var POST_NEW_IMAGE_URL = "./uploadFile/";




var NEW_ITEM_TYPE = "sticker13";

var NEW_IMAGE_DATA = null;

var mymap = null;

var result_items_from_server = null;


$(function () {

    reset_map_to_location(GLOBAL_LOCATION, 17);
    try_to_get_user_loc();

});



///LOCATION FUNCTIONS

function try_to_get_user_loc() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(set_User_Position);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

}

function set_User_Position(user_position) {

    USER_LOCATION.lat = user_position.coords.latitude;
    USER_LOCATION.lon = user_position.coords.longitude;


    set_map_view_to_location(USER_LOCATION, 17);

    get_Data_From_Db(USER_LOCATION);

}

function convert_location_string_to_obj(locString) {

    markerLocation = locString.split(",");
    m_lat = markerLocation[0].trim() * 1;
    m_lon = markerLocation[1].trim() * 1;

    return { lat: m_lat, lon: m_lon };

}

function convert_location_obj_to_string(locObj) {

    locationString = locObj.lat + ", " + locObj.lon;

    return locationString;

}



///DATA FUNCTIONS 

function isNullOrWhitespace(input) {

    if (typeof input === 'undefined' || input == null) return true;

    return input.replace(/\s/g, '').length < 1;
}

function return_time_sorted_mapo_items_from_res_object() {

    things_to_put = result_items_from_server.hits.hits;
    mapo_items = Array();




    for (i = 0; i < things_to_put.length; i++) {

        mapo_item = things_to_put[i]._source;


        if (!isNullOrWhitespace(mapo_item.itemType)) {

            new_mapo_item = {

                id: things_to_put[i]._id,
                type: mapo_item.itemType,
                location: mapo_item.location,
                time: mapo_item.time,
                user: mapo_item.createdByUser,
                text: mapo_item.itemText

            }

            mapo_items.push(new_mapo_item);

        }



    }

    mapo_items.sort(function (a, b) { return b.time - a.time });

    return mapo_items;

}

function add_mapo_item_to_chat_and_map(mapo_item) {

    put_marker_on_map(return_marker_from_mapo_item(mapo_item));
    put_chat_element_in_chat(return_chat_element_from_mapo_item(mapo_item));

}

function get_mapo_item_by_id(mapo_id) {

    mapo_items = return_time_sorted_mapo_items_from_res_object();

    

    for (var i = 0; i < mapo_items.length; i++) {

        if (mapo_id == mapo_items[i].id) {

            return mapo_items[i];

        }


    }

    return null;

}

function set_current_new_item_type(item_type){

    NEW_ITEM_TYPE = item_type;
}

function convert_sticker_name_to_display_name(sticker_name) {

    item_type = "Text";

    switch (sticker_name) {

        case ("sticker01"):
            item_type = "Electric Applience";
            break;

        case ("sticker02"):
            item_type = "Clothes";
            break;

        case ("sticker03"):
            item_type = "Carpet";
            break;

        case ("sticker04"):
            item_type = "Sofa";
            break;


        case ("sticker05"):
            item_type = "Wood";
            break;


        case ("sticker06"):
            item_type = "Mattress ";
            break;

        case ("sticker07"):
            item_type = "Books";
            break;

        case ("sticker08"):
            item_type = "Sound system";
            break;

        case ("sticker09"):
            item_type = "Toys";
            break;

        case ("sticker10"):
            item_type = "Dirt";
            break;


        case ("sticker11"):
            item_type = "Shelves ";
            break;


        case ("sticker12"):
            item_type = "Dinnerware";
            break;


        default:
            item_type = "Text";
            break;
    }

    return item_type;

}




///DB FUNCTIONS
function send_New_Item_To_Db(map_item) {

    newItem = {
        text: map_item.text,
        type: map_item.type,
        location: map_item.location,
        //available: true,
        //flagged: false
    }

    data_to_send = JSON.stringify(newItem);

    $.ajax({
        type: 'POST',
        url: POST_NEW_ITEM_URL,
        data: data_to_send,
        //headers: { "Authorization": "Basic YXBwMDE6YXBwMDEyMw==" },
        contentType: 'application/json',
        success: success_Post_item_to_db_func
    });

}

function success_Post_item_to_db_func(res) {

    console.log("data returned from db ok!! " + JSON.parse(res)._id);

    send_image_to_db(JSON.parse(res)._id);
}







////THIS IS THE IMAGE POST REQUEST

function send_image_to_db(image_id) {

    if (NEW_IMAGE_DATA != null) {
        console.log("sending image to db " + image_id);

        var formData = new FormData();

        newBlob = new Blob([NEW_IMAGE_DATA], { type: "image/jpeg"});

        formData.append("file", newBlob, image_id);


        $.ajax({
            type: 'POST',
            url: POST_NEW_IMAGE_URL,
            data: formData,
            processData: false,
            contentType: false,
            success: success_Post_image_to_db_func
        });

        //ajax.setRequestHeader("content-type", 'multipart/form-data');
        //ajax.setRequestHeader("Content-Disposition", 'form-data; name = "file"; filename = "' + image_id+'"');

    }
    

}





function success_Post_image_to_db_func(res) {

    console.log("image upload ok!" + res);

}

function get_Data_From_Db(user_location) {

    loc_obj = {

        "current_location": user_location.lat + "," + user_location.lon

    }

    data_to_send = JSON.stringify(loc_obj);
    $.ajax({
        type: 'POST',
        headers: { "Authorization": "Basic YXBwMDE6YXBwMDEyMw==" },
        url: GET_ITEMS_FROM_DB_URL,
        data: data_to_send,
        contentType: 'application/json',
        success: success_Get_func
    });


}

function success_Get_func(res) {

    console.log("GET from db ok!!");

    result_items_from_server = JSON.parse(res);
    pupulate_app_data();
}

function pupulate_app_data() {

    mapo_items = return_time_sorted_mapo_items_from_res_object();

    for (var i = 0; i < mapo_items.length; i++) {
        add_mapo_item_to_chat_and_map(mapo_items[i]);
    }


}




///MAP FUNCTIONS

function reset_map_to_location(set_to_this_location, map_zoom_value) {

    mymap = L.map('mapDiv').setView([set_to_this_location.lat, set_to_this_location.lon], map_zoom_value);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2NpdHkiLCJhIjoiY2pzMHExeGIzMW05OTQ0dWtvNmIxMWp2NyJ9.4AZhnhFxf_Wyrp8-9FjgWg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 19,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZ2NpdHkiLCJhIjoiY2pzMHExeGIzMW05OTQ0dWtvNmIxMWp2NyJ9.4AZhnhFxf_Wyrp8-9FjgWg'
    }).addTo(mymap);

    mymap.on('dblclick', onMapDoubleClick);
    //mymap.on('click', onMapClick);

}

function set_map_view_to_location(loc, map_zoom_value) {

    mymap.setView([loc.lat, loc.lon], map_zoom_value);
}

function onMapDoubleClick(e) {
    console.log("double click!" + e);
    if (USER_LOCATION.lat != null && USER_LOCATION.lon != null) {

        set_map_view_to_location(USER_LOCATION);
    }
    
    

}




///MARKER FUNCTIONS

function return_marker_from_mapo_item(mapo_item) {

    var myIcon = L.icon({
        iconUrl: "assets/" +mapo_item.type+".png",
        iconSize: [150, 150],
        iconAnchor: [36, 74],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

    mapo_item_location = convert_location_string_to_obj(mapo_item.location)
    

    var marker = L.marker([mapo_item_location.lat, mapo_item_location.lon], { icon: myIcon });
    marker.on('click', on_Marker_Click);
    marker.on('dblclick', on_Marker_Double_Click);
    marker.bindPopup("<p class='pop_up_item'>" + mapo_item.text + "</p>");

    marker.get_mapo_item_id = function(){

        return mapo_item.id;

    }

    return marker;

}

function on_Marker_Double_Click(marker_click_e) {

    console.log("Marker_Double_Click " + marker_click_e.target.get_mapo_item_id());

    mapo_item = get_mapo_item_by_id(marker_click_e.target.get_mapo_item_id());

    show_item_on_marker_click(marker_click_e, mapo_item);
}

function on_Marker_Click(marker_click_e) {

    console.log("on_Marker_Click");

}

function put_marker_on_map(marker) {

    marker.addTo(mymap);

}

function remove_marker_from_map(marker) {

    marker.removeFrom(mymap);

}

function clear_map_markers() {

    for (var i = 0; i < all_current_map_markers.length; i++) {
        remove_marker_from_map(all_current_map_markers[i]);
    }

}




///CHAT FUNCTIONS

function return_time_string_from_timestamp(timestamp) {
    return new Date((timestamp * 1)).toLocaleString();
}

function return_chat_element_from_mapo_item(mapo_item) {

    chat_item_location = convert_location_string_to_obj(mapo_item.location);

    chat_item_time_string = return_time_string_from_timestamp(mapo_item.time);

    new_chat_html = '<div onclick="chat_item_click(event)" class="chatItem" chat_item_lat=' + chat_item_location.lat
        + ' chat_item_lon=' + chat_item_location.lon
        + '><div class="chatItemHeaders"><h3 class="chatItemUserName">' + mapo_item.user
        + '<h3 class="chatItemTime">' + chat_item_time_string
        + '</h3 ></div><hr/><h2 class="chatItemMsgText">' + mapo_item.text
        + '</h2></div>';

    return new_chat_html;

}

function put_chat_element_in_chat(chat_element) {

    $("#chatDiv").append(chat_element);

}

function chat_item_click(e) {

    c_location = {
        lat: e.target.closest('.chatItem').getAttribute("chat_item_lat"),
        lon: e.target.closest('.chatItem').getAttribute("chat_item_lon")
    }

    set_map_view_to_location(c_location, 18);

}





///////////////TESTING STUFF

function testMarker() {

    testItem = {

        id: "testItem.png",
        type: "sticker13",
        location: "32.0466879, 34.7796028",
        time: "21/12/21",
        user: "test_zukerberg",
        text: "this is a nice item!"
    }

    add_mapo_item_to_chat_and_map(testItem);

}