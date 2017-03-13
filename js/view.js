

/* View controls the page */
function View($domElements, controller) {
    //store all the dom info needed
    this.$dom = {
            $loading: $domElements.loading
        }
        //store controller
    this.controller = controller;
    //init movies
    this.movies = new Movies({
        $div: $domElements.entries,
        $template: $domElements.template
    });
    //init movies
    this.history = new Movies({
        $div: $domElements.history,
        $template: $domElements.historyTemplate
    });
    //make a player 
    this.player = new Player({
        playerDiv: $domElements.playerDiv,
        autoplay: false
    });
    this.cookies = Cookie.getInstance();
    this.state = {
        previous: "",
        current: "",
        historyList: "#"
    }
    this.init();
}
View.prototype = (function () {

    function init() {
        //bind read hash here...if item
        $(window).on('hashchange', (function () {
            readHash.call(this);
        }).bind(this));

        $(document).on("LOADMOVIES", (function (event, entries) {
            //load all the entries on the screen
            this.loadMovies(entries);
            //check the deep linking
            $(window).trigger("hashchange");
        }).bind(this));
        this.player.on("ONEND", (function () {
            //remove hash..it will call hash change and hide the video player
            window.location.hash = this.state.previous || "";
        }).bind(this));
        this.player.on("ONCLOSE", (function () {
            //remove hash..it will call hash change and hide the video player
            window.location.hash = this.state.previous || "";
        }).bind(this))

    }

    function setState(current) {
        //if (this.state.current) {
            this.state.previous = (this.state.current.toUpperCase() == "HISTORY") ? this.state.current : "";
        //}
        this.state.current = current;
    }

    function readHash() {
        var hash = location.hash;
        hash = hash.replace(/^#/, "") || "";
        setState.call(this, hash);

        switch (hash.toUpperCase()) {
        case "HISTORY":
            showHistory.call(this);
            break;
        case "":
            showMovies.call(this);
            break;
        default:
            this.playEntry(hash);
            break;
        }

    }

    function playEntry(entryID) {
        var _item = this.controller.getEntry(entryID);
        if (!_item) {
            //this.$dom.$playerDiv.hide();
            this.player.hide(true)
            return;
        }
        this.player.load(_item.contents);
        this.player.show(true);
        //add in cookie
        this.cookies.add("MOVIES", entryID, "|", 365);
    }

    function hide(object) {
        object && object.hide();
    }

    function loadMovies(entries) {
        this.movies.load(entries, true);
    }

    function showMovies(entries) {
        hide.call(this, this.$dom.$loading);
        hide.call(this, this.history);
        this.player.hide(true)
        this.movies.show();
        this.movies.focus("a:first");
    }

    function showHistory() {
        //get entries from cookies.
        var cookie = this.cookies.get("MOVIES"),
            movies,
            historyList = [];

        //hide others
        hide.call(this, this.$dom.$loading);
        hide.call(this, this.movies);
        hide.call(this, this.player);

        //load history if new list found
        if (this.state.historyList != cookie) {
            
            movies = cookie.split("|");
            movies.map((function (key) {
                var movie = this.controller.getEntry(key);
                movie && historyList.push(movie);
            }), this);
            this.history.load({
                "entries": historyList
            }, true, historyList.length);
        }
        this.state.historyList = cookie;
        this.history.show();
        this.history.focus("a:first");
    }

    return {
        init: init,
        loadMovies: loadMovies,
        playEntry: playEntry
    }
})()