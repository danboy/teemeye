/* Author: Dan Nawara

*/

if (typeof TMI == 'undefined') {
  TMI = {};
};

TMI.list = function(options){
  var _this = this;
  this.getParams();
  this.options = $.extend({
    list: this.params['list'] || "default" 
  },options);
  this.db = new TMI.storage();
  this.todolist = this.load() ;
  $('#add').click(function(){_this.create();});
  $('#item').keypress(
    function(ev){
      if(ev.charCode == 13){
        _this.create();
      }
  });
}

TMI.list.prototype = {
  configure: function(){
  },
  create: function(){
    var item = $('#item').val();
    this.list(item);
    this.todolist.items.push(item)
    this.db.save(this.options.list,this.todolist);
    $('#item').val('');
  },
  destroy: function(key){
    var index = this.getIndex(key);
    if(this.todolist.items.length == 1)
      this.todolist.items = [];
    this.todolist.items.splice(index,index);
    $('#'+key).remove();
    this.db.save(this.options.list,this.todolist);
  },
  load: function(){
    var _this = this;
    this.todolist = this.db.get(this.options.list) || {};
    $(this.todolist.items).each(function(index,item){
      _this.list(item);
    });
    if(this.todolist == "undefined"){
      this.todolist = {};
      this.todolist.items = [];
    }
    return this.todolist;
  },
  size: function(){
    var size = 0, key;
    for (key in this.todolist) {
      if (this.todolist.hasOwnProperty(key)) {
        size++;
      }
    }
    return size;
  },
  list: function( item ){
    var _this = this;
    $('#todos').append(
      $('<li/>',{'text':item,'id':item}).click(function(){_this.destroy(item);})
    )
  },
  getIndex: function(key){
    var index = -1
    for (i=0;i<this.todolist.items.length;i++) {
      if(this.todolist.items[i]==key) {
        index = i;
        break;
      }
    }
    return index;
  },
  getParams: function(){
      this.params = {};
      var e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&=]+)=?([^&]*)/g,
      d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
      q = window.location.search.substring(1);

      while (e = r.exec(q)){
        this.params[d(e[1])] = d(e[2]);
      }
  }

}

