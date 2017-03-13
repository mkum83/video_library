
/* model to store the entries */
function Model(){
        
}
Model.prototype=(function(){    
    
    function addListener(){}
    function loadStore(data){
        this.store = data;
        //call the subscribers
        $(document).trigger("LOADMOVIES",this.store);
    }
    function getEntry(id){
       var _item;
        
        if(!id || !this.store || !this.store.entries){
            return _item;
        }
        _item = this.store.entries.find(function(item){
            if(item.id === id)
                return true;
        })
       return _item;
    }
    return {
        
        loadStore:loadStore,
        getEntry:getEntry
    }
})()