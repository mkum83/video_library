
/* controller to fetch the data */
function Controller(model){
    this.model = model;
    this.init();
}
Controller.prototype=(function(){    
    function init(){
        //send call to fetch the entries...
        var url="https://demo2697834.mockable.io/movies";
        //url="/data.json";
        $.ajax({
          url:url ,
          data: {},
          success: (function(data){
              console.dir(data);
              //store entries in the model
                this.model.loadStore(data);
          }).bind(this),
          dataType: "json"
        });        
    }
    function getEntry(id){
        return this.model.getEntry(id);
    }
    return {
        init:init,
        getEntry:getEntry
    }
})()