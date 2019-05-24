
//costructor function for all MapoItem in app
function MapoItem(id, type, location, text, time, user, hasPhoto, item_upvotes, item_downvotes) {

    this.id = id;
    this.type = type;
    this.location = location;
    this.text = text;
    this.time = time;
    this.user = user;
    this.hasPhoto = hasPhoto;
    this.item_upvotes = item_upvotes;
    this.item_downvotes = item_downvotes;

}

//maker function for MapoItems
function MapoItemMaker(id, type, location, text, time, user, hasPhoto, item_upvotes=0, item_downvotes=0) {

    return new MapoItem(id, type, location, text, time, user, hasPhoto, item_upvotes, item_downvotes);

}