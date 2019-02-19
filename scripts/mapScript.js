var GLOBAL_LOCATION = { lat: 32.0466879, lon: 34.7796028 };
var USER_LOCATION = { lat: null, lon: null };

var POST_NEW_ITEM_URL = "";
var GET_ITEMS_FROM_DB_URL = "";

var mymap = null;

var result_items_from_server = null;

var all_current_map_markers = null;
var all_current_chat_items = null;

$(function () {

    reset_map_to_location(GLOBAL_LOCATION, 17);

});


function reset_map_to_location(set_to_this_location, map_zoom_value) {

    mymap = L.map('mapDiv').setView([set_to_this_location.lat, set_to_this_location.lon], map_zoom_value);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2NpdHkiLCJhIjoiY2pzMHExeGIzMW05OTQ0dWtvNmIxMWp2NyJ9.4AZhnhFxf_Wyrp8-9FjgWg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZ2NpdHkiLCJhIjoiY2pzMHExeGIzMW05OTQ0dWtvNmIxMWp2NyJ9.4AZhnhFxf_Wyrp8-9FjgWg'
    }).addTo(mymap);

    //mymap.on('click', onMapClick);

}

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

}

function convert_location_string_to_obj(locString) {

    markerLocation = locString.split(",");
    m_lat = markerLocation[0].trim() * 1;
    m_lon = markerLocation[1].trim() * 1;

    return { lat: m_lat, lon: m_lon };

}

function put_marker_on_map_from_item(map_item) {

    var myIcon = L.icon({
        iconUrl: "assets/" +map_item.type+".png",
        iconSize: [150, 150],
        iconAnchor: [36, 74],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

    map_item_location = convert_location_string_to_obj(map_item.location)
    

    var marker = L.marker([map_item_location.lat, map_item_location.lon], { icon: myIcon }).addTo(mymap);
    marker.on('click', on_Marker_Click);
    marker.bindPopup("<p class='pop_up_item'>" + map_item.text + "</p>");

    return marker;

}

function populate_local_items_arrays_with_data_from_db() {

    things_to_put = result_items_from_server.hits.hits;

    all_current_map_markers = Array();
    all_current_chat_items = Array();

    for (i = 0; i < things_to_put.length; i++) {

        chat_item = things_to_put[i]._source;

        chatItem = {

            time: chat_item.time,
            user: chat_item.createdByUser,
            text: chat_item.itemText

        }

        all_current_chat_items.push(chatItem);

    }



    all_current_chat_items.sort(function (a, b) { return b.time - a.time });


}

function put_chat_item_in_chat_from_item(chat_item) {

    chat_item_location = convert_location_string_to_obj(chat_item.location)

    new_chat_html = '<div onclick="chat_item_click(event)" class="chatItem" chat_item_lat=' + chat_item_location.lat
        + ' chat_item_lon=' + chat_item_location.lon
        + '><h3 class="chatItemUserName">' + chat_item.time
        + '</h3 ><h2 class="chatItemMsgText">' + chat_item.text
        + '</h2><p class="chatItemMessageDate">' + chat_item.text + '</p></div>';

    $("#chatDiv").append(new_chat_html);

}

function chat_item_click(e) {

    c_location = {
        lat: e.target.closest('.chatItem').getAttribute("chat_item_lat"),
        lon: e.target.closest('.chatItem').getAttribute("chat_item_lon")
    }

    set_map_view_to_location(c_location, 18);

}

function set_map_view_to_location(loc, map_zoom_value) {

    mymap.setView([loc.lat, loc.lon], map_zoom_value);
}



function on_Marker_Click(marker_click_e) {



}

function remove_marker_from_map(marker) {

    L.marker([m_lat, m_lon], { icon: myIcon }).removeFrom(mymap);

}

function send_New_Item_To_Db(map_item) {

    newItem = {
        text: $("#new_item_texterea").val(),
        type: map_item.type,
        location: map_item.location,
        available: true,
        flagged: false
    }

    data_to_send = JSON.stringify(newItem);

    $.ajax({
        type: 'POST',
        url: POST_NEW_ITEM_URL,
        data: data_to_send,
        headers: { "Authorization": "Basic YXBwMDE6YXBwMDEyMw==" },
        contentType: 'application/json',
        success: success_Post_item_to_db_func
    });

}

function success_Post_item_to_db_func(res) {

    console.log("data returned from db ok!!" + res);

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
    result_items_from_server = res;

}

function clear_map_markers() {

    for (var i = 0; i < all_current_map_markers.length; i++) {
        remove_marker_from_map(all_current_map_markers[i]);
    }

}


//TESTING STUFF

function testMarker() {

    testItem = {

        type: "sticker13",
        location: "32.0466879, 34.7796028",
        time: "21/12/21",
        user: "test_zukerberg",
        text: "this is a nice item!"
    }

    put_marker_on_map_from_item(testItem);
    put_chat_item_in_chat_from_item(testItem);

}