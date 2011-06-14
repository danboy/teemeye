/* Author: Dan Nawara

*/

if (typeof TMI == 'undefined') {
  TMI = {};
};

TMI.viewer = function(options){
  this.options = $.extend({
    speed: 60000
  },options);
  this.index = 0;
  MAX = this.size();
  this.db = new TMI.storage();
  this.configure();
}


TMI.viewer.prototype = {
  configure: function(){
    $('<div/>',{'id': 'config'}).appendTo('body');
    $('<ul/>').appendTo('#config');
    this.load();
    this.drawForm();
  },
  addPage: function( key, url ){
    console.log('build');
    $('<iframe/>',{ 'src': url, 'id': key,'style':'width:100%;height:100%'}).appendTo('body');
  },
  drawForm: function(){
    var _this=this;
    var div = $('<div/>',{'class': 'input'});
    $('<input/>',{'type':'text','id':'name'}).appendTo(div);
    $('<input/>',{'type':'text','id':'url'}).appendTo(div);
    $('<a/>',{'text':'add'}).click(function(){_this.create();}).appendTo(div);
    div.appendTo('#config');
    var speed = $('<div/>',{'class': 'input'}).appendTo('#config');
    $('<input/>',{'type':'text','id':'speed','style': 'width:30px;'}).appendTo(speed);
    $('<a/>',{'class':'start','text': 'start'}).click(function(){_this.start();}).appendTo('#config');
  },
  create: function(){
    this.sites[$('#name').val()] = $('#url').val();
    this.list($('#name').val(),$('#url').val());
    this.db.save('TMI',this.sites);
    $('.input input').val('');
    MAX = this.size();
  },
  destroy: function(key){
    delete(this.sites[key]);
    $('#'+key).remove();
    this.db.save('TMI',this.sites);
  },
  load: function(){
    this.sites = this.db.get('TMI') || {};
    delete(this.sites['updated_at']);
    for(key in this.sites){
      this.list( key, this.sites[key] );
    };
    MAX = this.size();
  },
  size: function(){
    var size = 0, key;
    for (key in this.sites) {
      if (this.sites.hasOwnProperty(key)) size++;
    }
    return size;
  },
  list: function( name, url ){
   _this = this;
   var li = $('<li/>',{ 'id':name, 'text': name + ':'}).appendTo('#config ul');
   $('<a/>',{ 'text':'remove'}).click(function(){_this.destroy(name)}).appendTo(li);
  },
  start: function(){
    delete(this.sites['updated_at']);
    if($('#speed').val()){
      this.options.speed = $('#speed').val();
    }
    for (key in this.sites) {
      this.addPage(key, this.sites[key]);
    }
    $('#config').hide();
    this.next(0,MAX);
  },
  next: function(index,MAX){
    this.animate($('iframe')[index]);
  },
  animate: function(iframe){
    _this = this;
    this.forward();
    this.timer = setTimeout(function(){_this.next(_this.index,MAX)},this.options.speed);
  },
  pause: function(){
    clearTimeout(this.timer);
  },
  forward: function(){
    _this = this;
    $('iframe').hide();
    $($('iframe')[this.index]).show();
    this.increment();
  },
  increment: function(){
    if (this.index >= MAX-1){
      this.index = 0; 
    }else{
      this.index++;
    };
  },
  keyObserver: function(key , callback){
    $('window').keypress(
      function(ev){
        if(ev.charCode == key){
          callback();
        }
    });
  }
}

t = new TMI.viewer();
