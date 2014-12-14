lychee.define('game.net.client.File').includes([
  'lychee.net.client.Session'
]).exports(function(lychee, game, global, attachments) {

  var Class = function(client) {

    var settings = {};


    settings.autostart = false;
    settings.autolock  = false;
    settings.min       = 2;
    settings.max       = 256;
    settings.sid       = 'dropzone';

    lychee.net.client.Session.call(this, 'file', client, settings);

  };


  Class.prototype = {

    sendFile: function(file) {

      var data = {
        name: file.name,
        data: lychee.serialize(file.data)
      };

      this.multicast(data);

    }

  };


  return Class;

});
