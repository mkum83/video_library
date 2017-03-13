function Movies(options) {
    this.$root = options.$div;
    this.template = Handlebars.compile(options.$template.html());
}
Movies.prototype = (function () {
    function load(movies, clearFirst) {
        clearFirst && (this.$root.html(""));
        this.$root.append(this.template(movies));
    }

    function show() {
        this.$root.show();
    }

    function hide() {
        this.$root.hide();
    }

    function focus(selector) {
        this.$root.find(selector).focus();
    }
    return {
        load: load,
        show: show,
        hide: hide,
        focus: focus
    }
})()