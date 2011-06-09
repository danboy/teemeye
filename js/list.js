/* Author: Dan Nawara

*/

if (typeof TMI == 'undefined') {
  TMI = {};
};

TMI.list = function(options){
  this.getParams();
  this.options = $.extend({
    list: this.params['list'] || "default" 
  },options);
  this.init();
}

TMI.list.prototype = {
  init: function(){
    var _this = this;
    this.db = new TMI.storage();
    this.todolist = this.load() ;
    $('#add').click(function(){_this.create();});
    $('#item').keypress(
      function(ev){
        if(ev.charCode == 13){
          _this.create();
        }
    });
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
    console.log(index);
    this.todolist.items.splice(index,1);
    $('#'+this.toClass(key)).remove();
    this.db.save(this.options.list,this.todolist);
  },
  load: function(){
    var _this = this;
    this.todolist = this.db.get(this.options.list) || {'items':[]};
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
      $('<li/>',{'text':item,'id': _this.toClass(item)}).append($('<a/>',{'text':'-'}).click(function(){_this.destroy(item);})).prepend($('<a/>',{'text':'[]','class':'check'}).click(function(){_this.check(item);}))
    )
  },
  check: function(item){
    var item = $('#'+this.toClass(item))
    if(item.hasClass('checked')){
      item.removeClass('checked');
    }else{
      item.addClass('checked');
    }
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
  },
  toClass: function(item){
    item = item.replace(/ /g,"");
    item = item.replace(/[^a-zA-Z 0-9]+/g,'');
    return item;
  }

}

