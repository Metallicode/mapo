function get_camera_element() {


    camera_element = '<div id="camDiv">\
        <div id="camera-div">\
        <center>\
            <img onclick="app.mapo_UI_click(event)" id="camera-flip-btn-control" src="'+ app.app_globals.mapo_app_images.mapo_camera_flip +'"/>\
        <video onclick="app.mapo_UI_click(event)" id="video"></video>\
</center>\
            <br />\
            <center><div onclick="app.mapo_UI_click(event)" id="camera-click-button"></div></center>\
            <canvas id="canvas"></canvas>\
            <canvas id="low_res_canvas"></canvas>\
        </div >\
    </div >';

    return camera_element;


}

function MapoCamera(instance) {

    this.width = window.innerWidth;
    this.height = window.innerHeight;   

    this.streaming = false;

    this.video = null;
    this.canvas = null;
    this.low_res_canvas = null;
    this.photo = null;
    this.startbutton = null;

    this.startup = function (media_device) {

        if (window.mapo_stream) {
            window.mapo_stream.getTracks().forEach(function (track) {
                track.stop();
            });

        }

        this.clear_canvas();


        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.low_res_canvas = document.getElementById('low_res_canvas');

        if (this.photo != null) {
            if (this.photo.parentNode != null) {
                this.photo.parentNode.removeChild(this.photo);
            }
        }

        this.photo = document.createElement("img");
        this.photo.id = "camera-preview";
        document.getElementById('mapo-input-element-text-and-preview-div').appendChild(this.photo);




        
        this.startbutton = document.getElementById('camera-click-button');


        this.constraints = {
            audio: false,
            video: {
                deviceId: { exact: media_device.deviceId }
            }
        };


        navigator.getMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia(
            app.app_globals.mapo_camera.constraints,
            function (stream) {
                window.mapo_stream = stream;

                if (navigator.mozGetUserMedia) {
                    this.video.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    this.video.srcObject = stream;
                }
                this.video.play();
            },
            function (err) {
                mapo_log("An error occured! " + err);
            }
        );

        document.getElementById('video').addEventListener('canplay', function (ev) {
            if (!app.app_globals.mapo_camera.streaming) {
                //app.app_globals.mapo_camera.height = video.videoHeight / (video.videoWidth / app.app_globals.mapo_camera.width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                //if (isNaN(this.height)) {
                //    this.height = this.width / (4 / 3);
                //}

                //video.setAttribute('width', app.app_globals.mapo_camera.width);
                //video.setAttribute('height', app.app_globals.mapo_camera.height);
                //canvas.setAttribute('width', app.app_globals.mapo_camera.width);
                //canvas.setAttribute('height', app.app_globals.mapo_camera.height);
                app.app_globals.mapo_camera.streaming = true;
            }
        }, false);

        this.startbutton.addEventListener('click', function (ev) {
            mapo_log("photo click");
            app.app_globals.mapo_camera.take_picture();
            ev.preventDefault();
        }, false);


    }

    this.take_picture = function() {

        var context = this.canvas.getContext('2d');

        //pre low res image stuff
        var low_res_context = this.low_res_canvas.getContext('2d');
        this.low_res_canvas.width =50;
        this.low_res_canvas.height = 50;
        low_res_context.drawImage(this.video, 0, 0, 50, 50);
        var low_res_data = low_res_canvas.toDataURL('image/jpeg');
        app.app_globals.new_low_res_image_data_buffer = low_res_data;



        ///hi res camera stuff
        if (this.width && this.height) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            context.drawImage(this.video, 0, 0, this.width, this.height);

            var data = canvas.toDataURL('image/jpeg');
            this.photo.setAttribute('src', data);
            this.photo.setAttribute('heigth', this.height / 2);
            this.photo.setAttribute('width', this.width / 2);


            app.app_globals.new_image_data_buffer = data;


        } else {
      
        }




    }

    this.clear_canvas = function () {
        canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

}


function MapoCameraProvider(instance) {

    if (instance.app_globals.mapo_camera == null) {

        mapo_camera = new MapoCamera(instance);

        return mapo_camera;
    }
    else {
        return instance.app_globals.mapo_camera;
    }


}



//<input onclick="app.mapo_UI_click(event)" class="btn" id="camera-cancel-btn-control" type="button" value="'+ app.app_globals.mapo_texts.camera_cancel_btn +'" />\