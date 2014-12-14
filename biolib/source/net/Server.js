
lychee.define('game.net.Server').requires([
  'lychee.data.BitON',
  'game.net.remote.File'
]).includes([
  'lychee.net.Server'
]).exports(function(lychee, game, global, attachments) {

  var _BitON = lychee.data.BitON;
  var _file  = game.net.remote.File;


  var Class = function(data) {

    var settings = lychee.extend({
      codec: _BitON
    }, data);


    lychee.net.Server.call(this, settings);



    /*
     * INITIALIZATION
     */

    this.bind('connect', function(remote) {

      console.log('(BioNET) game.net.Server: Remote connected (' + remote.host + ':' + remote.port + ')');

      remote.addService(new _file(remote));

    }, this);

    this.bind('disconnect', function(remote) {

      console.log('(BioNET) game.net.Server: Remote disconnected (' + remote.host + ':' + remote.port + ')');

    }, this);


    this.connect();

  };


  Class.prototype = {

  };


  return Class;

});
