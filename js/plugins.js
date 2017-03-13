/* video player */
function Player(options) {
    this.$root = options.playerDiv;
    this.autoplay = options.autoplay || false;

    //extend Listener
    $.extend(this, new Listener());
    this.init();
}
Player.prototype = (function () {
    function init() {
        //find the controls
        this.video = this.$root.find("video")[0];
        this.video.autoplay = this.autoplay;

        this.$play = this.$root.find(".js-play");
        this.$close = this.$root.find(".js-close");
        //bind event to each node
        this.$play.on("click", this.play);
        this.$close.on("click", (function () {
            this.pause();
            this.trigger("ONCLOSE");
        }).bind(this));
        this.video.onended = (function () {
            this.trigger("ONEND");
        }).bind(this);

    }

    function show(play) {
        this.$root.show();
        play && this.play();
    }

    function hide() {
        this.$root.hide();
        this.stop()
    }

    function play() {
        this.video.play();
    }

    function pause() {
        this.video.pause();
    }

    function stop() {
        this.video.pause();
        //this.trigger("ONSTOP");
    }

    function load(src) {
        this.video.innerHTML = '';
        src.map((function (item) {
            var source = document.createElement('source');
            source.src = item.url;
            source.type = "video/" + item.format;
            this.video.appendChild(source);
        }).bind(this))

        this.video.autoplay = this.autoplay;
        //&& this.play();
    }
    return {
        init: init,
        show: show,
        hide: hide,
        play: play,
        pause: pause,
        stop: stop,
        load: load
    }
})()


//subscribe and listener 
function Listener() {
    this._Listeners = {};
    this.on = function (key, callback) {
        this._Listeners[key] = this._Listeners[key] || [];
        this._Listeners[key].push(callback);
    }
    this.trigger = function (key) {
        this._Listeners[key] && this._Listeners[key].map(function (callback) {
            callback.call();
        })
    }
}

//cookie handler..singleton
var Cookie = (function () {
    function SingletonClass() {
        function addItem(key, value, sep, days) {
            //if already exists
            var cookies = getItem(key);
            if(cookies){                
                sep = sep || "";
                cookies =  cookies.split(sep);
                //not already not exists
                cookies.indexOf(value) < 0 && cookies.push(value);
                value = cookies.join(sep);
            }
            
            //cookievalue =cookievalue ? cookievalue + sep + value:value;
            setCookie(key, value, days)
            console.log("new cookie ", document.cookie)
        }

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getItem(key) {
            var allcookies = document.cookie,
                cookiearray,
                name,
                value;
            console.log("All Cookies : " + allcookies);

            // Get all the cookies pairs in an array
            cookiearray = allcookies.split(';');

            // Now take key value pair out of this array
            for (var i = 0; i < cookiearray.length; i++) {
                name = cookiearray[i].split('=')[0];
                value = cookiearray[i].split('=')[1];
                if (name === key) {
                    return value;
                }
            }
            return "";
        }
        //do stuff
        return {
            add: addItem,
            get: getItem
        }
    }
    var instance;
    return {
        getInstance: function () {
            if (instance == null) {
                instance = new SingletonClass();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
    };
})();
//var Cookie = ;