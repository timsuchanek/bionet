
lychee.define('game.net.Client').requires([
  'lychee.data.BitON',
  'game.ui.Dropzone',
  'game.net.client.File'
]).includes([
  'lychee.net.Client'
]).exports(function(lychee, game, global, attachments) {

  var _BitON = lychee.data.BitON;
  var _file  = game.net.client.File;


  var Class = function(data, main) {

    var settings = lychee.extend({
      codec:     _BitON,
      reconnect: 10000
    }, data);


    lychee.net.Client.call(this, settings);



    /*
     * INITIALIZATION
     */

    this.bind('connect', function() {

      this.addService(new _file(this));

      if (lychee.debug === true) {
        console.log('(BioNET) game.net.Client: Remote connected');
      }

    }, this);

    this.bind('disconnect', function(code) {

      if (lychee.debug === true) {
        console.log('(BioNET) game.net.Client: Remote disconnected (' + code + ')');
      }

    }, this);


    this.connect();

  };


  Class.prototype = {

  };


  return Class;

});
