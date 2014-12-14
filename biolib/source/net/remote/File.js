lychee.define('game.net.remote.File').includes([
  'lychee.net.Service'
]).exports(function(lychee, game, global, attachments) {

  var Class = function(remote) {

      lychee.net.Service.call(this, 'file', remote, lychee.net.Service.TYPE.remote);

  };


  Class.prototype = {

  };


  return Class;

});
