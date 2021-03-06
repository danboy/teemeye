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
    $('<ul/>',{'id':'pages'}).appendTo('#config');
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
    $('<input/>',{'type':'text','id':'name', 'title': 'site name'}).appendTo(div);
    $('<input/>',{'type':'text','id':'url', 'title': 'http://domain.com'}).appendTo(div);
    $('<a/>',{'text':'add'}).click(function(){_this.create();}).appendTo(div);
    div.appendTo('#config');
    var speed = $('<div/>',{'class': 'input'}).appendTo('#config');
    $('<input/>',{'type':'text','id':'speed','style': 'width:30px;', 'title': 'seconds'}).appendTo(speed);
    $('<a/>',{'class':'start','text': 'start'}).click(function(){_this.start();}).appendTo('#config');
    $('input').setTitle();
  },
  create: function(){
    this.sites[$('#name').val()] = { 'url': $('#url').val(),'timeout': ($('#speed').val()*1000), 'position': this.sites.length+1};
    this.list($('#name').val(),$('#url').val());
    this.db.save('TMI',this.sites);
    $('.input input').val('');
    MAX = this.size();
  },
  edit: function(key){
    $('#name').val(key);
    $('#url').val(this.sites[key].url);
    $('#speed').val(this.sites[key].timeout);
    this.destroy(key);
  },
  destroy: function(key){
    delete(this.sites[key]);
    $('#'+key).remove();
    this.db.save('TMI',this.sites);
  },
  load: function(){
    _this = this;
    this.sites = this.db.get('TMI') || {};
    delete(this.sites['updated_at']);
    for(key in this.sites){
      this.list( key , this.sites[key]);
    };
    MAX = this.size();
    $('#pages').sortable({
      update: function(item,index){_this.sort(item,index)}
    });
  },
  sort: function(item,index){
    _this = this;
    this.sites = {};
    $('#pages li').each(function( index, page){
      data = $(page).data('info');
      data.position = index;
      _this.sites[$(page).attr('id')] = data;
    });
    this.db.save('TMI',this.sites);
  },
  size: function(){
    var size = 0, key;
    for (key in this.sites) {
      if (this.sites.hasOwnProperty(key)) size++;
    }
    return size;
  },
  list: function( name, site){
   _this = this;
   var li = $('<li/>',{ 'id':name, 'text': name + ':'}).data('info', site).appendTo('#config ul');
   $('<a/>',{ 'text':'remove'}).click(function(){_this.destroy(name)}).appendTo(li);
  },
  start: function(){
    delete(this.sites['updated_at']);
    if($('#speed').val() && parseInt($('#speed').val())){
      this.options.speed = $('#speed').val();
    }
    for (key in this.sites) {
      this.addPage(key, this.sites[key].url);
    }
    $('#config').hide();
    this.next(0,MAX);
  },
  next: function(index){
    this.animate($('iframe')[index]);
  },
  animate: function(iframe){
    _this = this;
    this.forward();
    this.timer = setTimeout(function(){_this.next(_this.index)},this.options.speed);
  },
  pause: function(){
    _this = this;
    $('<div/>',{'id':'pause', 'text':'>'}).click(function(){
      console.log(this);
      $(this).remove();
      _this.animate();
      console.log('remove');
    }).appendTo('body');
    clearTimeout(this.timer);
  },
  forward: function(){
    this.pause();
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

  jQuery.fn.setTitle = function(){
    this.each(function(index,input){
      input = $(input);
      input.addClass('untouched');
      console.log(input);
      input.val(input.attr('title'));
      input.focus(function(){
        input.val('');
        input.removeClass('untouched');
      });
      input.blur(function(){
        if(input.val() == ''){
          input.val(input.attr('title'));
          input.addClass('untouched');
        };
      });
    });
  }
t = new TMI.viewer();
