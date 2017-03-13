    //start the app


$(document).ready(function(){
    var model = new Model(),
         controller = new Controller(model),
        view,
        $root = $("#app");
    
    
        view = new View({            
            template:$("#template"),
            loading:$root.find(".js-loading"),
            entries:$root.find(".js-Entries"),
            playerDiv:$root.find(".js-playerDiv"),
            history:$root.find(".js-history"),
            historyTemplate:$("#history_template")
        },controller);
    
})