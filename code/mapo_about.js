function get_mapo_about_element() {

    about_element = '<div id="mapo-about-element">\
        <button class="collapsible">'+ app.app_globals.mapo_texts.mapo_about_mapo_header +'</button>\
        <div class="content">\
        <div id="about-mapo-elemnt-text">\
            <p>'+ app.app_globals.mapo_texts.mapo_about_mapo_a +'</p><br/>\
    <p>'+ app.app_globals.mapo_texts.mapo_about_mapo_b +'</p><br/>\
    <p>'+ app.app_globals.mapo_texts.mapo_about_mapo_c +'</p><br/>\
    <p>'+ app.app_globals.mapo_texts.mapo_about_mapo_d +'</p><br/>\
    <p>'+ app.app_globals.mapo_texts.mapo_about_mapo_e +'</p><br/>\
    </div>\
        </div>\
        <button class="collapsible">'+ app.app_globals.mapo_texts.mapo_about_terms_of_use_header +'</button>\
        <div class="content">\
            <p>'+ app.app_globals.mapo_texts.mapo_about_terms_of_use +'</p>\
        </div>\
        <button class="collapsible">'+ app.app_globals.mapo_texts.mapo_contact_header +'</button>\
        <div class="content">\
            <p>'+ app.app_globals.mapo_texts.mapo_contact_mapo +'</p>\
        </div>\
        </div>';

    return about_element;

}

function initial_about_element() {

    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {

            for (var j = 0; j < coll.length; j++) {
                if (coll[j] != this) {
                    coll[j].classList.remove("active");
                    c = coll[j].nextElementSibling;
                    c.style.maxHeight = null;
                }
            }

            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }


}