if (typeof TMI == 'undefined') {
  TMI = {};
};

if (typeof TMI.storage == 'undefined') {
  TMI.storage = {};
};

TMI.storage = function(){
  return true;
};

TMI.storage.prototype = {
  supported: function(){
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  },
  get: function(key){
    if (this.supported()){
      try{
      return JSON.parse(localStorage.getItem(key));
      }
      catch(err)
      {
      return localStorage.getItem(key);
      };
    }

  },
  save: function(key,data){
    if(!this.supported){return;};
    if(typeof(data) == "object"){
      data.updated_at = new Date();
      data = JSON.stringify(data);
    }
    localStorage.setItem(key,data);
    return key;
  },
  isStale: function(key){
    data = this.get(key);

    if(data && data != ''){
      updated_at = new Date(data.updated_at);
      updated_at.setDate(updated_at.getDate()+1)
      current_date = new Date();
    }else{
      return 'no data';
    }

    if (updated_at < current_date){
      return 'isStale';
    }else{
      return data;
    }
  }
};
