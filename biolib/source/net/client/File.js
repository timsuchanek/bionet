lychee.define('game.net.client.File').includes([
  'lychee.net.Service'
]).exports(function(lychee, game, global, attachments) {

  var Class = function(client) {

      lychee.net.Service.call(this, 'file', client, lychee.net.Service.TYPE.client);

  };


  Class.prototype = {

  };


  return Class;

});
