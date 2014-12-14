lychee.define('game.net.remote.File').includes([
  'lychee.net.remote.Session'
]).exports(function(lychee, game, global, attachments) {

  var Class = function(remote) {

      lychee.net.remote.Session.call(this, 'file', remote, {});

  };


  Class.prototype = {

  };


  return Class;

});
