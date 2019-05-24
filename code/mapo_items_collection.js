function MapoItemsCollection() {

    this.mapo_items = new Array();
    this.all_items_count = function () {
        return mapo_items.length;
    }


    this.applied_filters = new Array();

    this.get_filterd_items = function () {

        f_items = this.mapo_items;

        for (var i = 0; i < applied_filters.length; i++) {

            f_items = applied_filters[i](allItems);

        }

        return f_items;

    }

    this.sort_items = function () {

        //tbd...

    }


}