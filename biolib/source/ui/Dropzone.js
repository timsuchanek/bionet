
lychee.define('game.ui.Dropzone').includes([
  'lychee.event.Emitter'
]).tags({
  platform: 'html'
}).exports(function(lychee, game, global, attachments) {

  /*
   * HELPERS
   */

  var _MIME = {
    'fnt':     { type: 'application/json',       constructor: 'Font'    },
    'js':      { type: 'application/javascript', constructor: 'Buffer'  },
    'json':    { type: 'application/json',       constructor: 'Config'  },
    'png':     { type: 'image/png',              constructor: 'Texture' },

    'msc.mp3': { type: 'audio/mp3',              constructor: 'Music'   },
    'msc.ogg': { type: 'audio/ogg',              constructor: 'Music'   },
    'snd.mp3': { type: 'audio/mp3',              constructor: 'Sound'   },
    'snd.ogg': { type: 'audio/ogg',              constructor: 'Sound'   }

  };

  var _refresh_list = function(list) {

    var content = '';

    this.files.forEach(function(file) {
      content += '<li>' + file.name + '<br><img src="' + file.data.url + '"></li>';
    });

    list.innerHTML = content.length ? content : '<li class="message">No files selected.</li>';

  };

  var _upload = function(file, mime, list) {

    var construct = mime['constructor'];
    var instance  = null;


    var index, data;


    switch(construct) {

      case 'Buffer':

        index = file.buffer.indexOf('base64,');

        if (index !== -1) {

          instance = lychee.deserialize({
            'constructor': construct,
            'arguments':   [ file.buffer.substr(index + 7) ]
          });

        }

      break;

      case 'Config':

        instance = lychee.deserialize({
          'constructor': construct,
          'arguments':   [ file.buffer ],
          'blob':        {
            buffer: file.buffer
          }
        });

      break;

      case 'Font':

        index = file.buffer.indexOf('base64,');

        if (index !== -1) {

          file.buffer = 'data:application/json;base64,' + file.buffer.substr(index + 7);

          instance = lychee.deserialize({
            'constructor': construct,
            'arguments':   [ file.buffer ],
            'blob':        {
              buffer: file.buffer
            }
          });

        }

      break;

      case 'Texture':

        instance = lychee.deserialize({
          'constructor': construct,
          'arguments':   [ file.buffer ],
          'blob':        {
            buffer: file.buffer
          }
        });

      break;

      case 'Music':
      case 'Sound':

        // TODO: Match given URLs and lazy-fire event?
        // A.snd.ogg + A.snd.mp3 = new Sound('A.snd');

        data = {
          'constructor': construct,
          'arguments':   [ null ],
          'blob':        {}
        };

        if (file.name.substr(-3) === 'mp3') {
          data.blob.buffer = {};
          data.blob.buffer.mp3 = file.buffer;
        } else if (file.name.substr(-3) === 'ogg') {
          data.blob.buffer = {};
          data.blob.buffer.ogg = file.buffer;
        }


        instance = lychee.deserialize(data);

      break;

    }


    if (instance !== null) {

      this.files.push({
        name: file.name,
        data: instance
      });


      this.trigger('change', []);

    }

  };

  var _bind_element = function() {

    var element = this.element;
    if (element !== null) {

      var that   = this;
      var button = document.createElement('button');
      var desc   = document.createElement('span');
      var zone   = document.createElement('div');
      var list   = document.createElement('ul');


      var allowed_extensions = Object.keys(this.extensions).filter(function(ext) {
        return that.extensions[ext] === true;
      });


      desc.innerHTML = '<b>Drop&nbsp;files&nbsp;here</b><br>(Allowed Types: ' + allowed_extensions.join(',') + ')';
      zone.appendChild(desc);
      zone.appendChild(document.createElement('br'));

      button.innerHTML = 'Clear Files';
      button.onclick   = function() {
        that.files = [];
        _refresh_list.call(that, list);
      };
      zone.appendChild(button);

      element.className = 'game-ui-Dropzone';
      element.appendChild(zone);

      list.innerHTML = '<li class="message">No&nbsp;files&nbsp;selected.</li>';
      element.appendChild(list);

      zone.addEventListener('dragenter', function(event) {
        event.stopPropagation();
        event.preventDefault();
      }, false);

      zone.addEventListener('dragover', function(event) {
        event.stopPropagation();
        event.preventDefault();
      }, false);

      zone.addEventListener('drop', function(event) {

        event.stopPropagation();
        event.preventDefault();

        if (event.dataTransfer instanceof Object) {

          var files = [].slice.call(event.dataTransfer.files);
          if (files.length > 0) {

            files.forEach(function(file) {

              var name    = file.name.split('/').pop();
              var ext     = [].slice.call(name.split('.'), 1).join('.');
              var mime    = _MIME[ext] || null;
              var allowed = that.extensions[ext] === true;

              if (mime !== null && allowed === true) {

                if (file.type === mime.type || file.type === '') {

                  var reader = new FileReader();

                  reader.onload = function(event) {

                    _upload.call(that, {
                      name:   file.name,
                      buffer: event.target.result
                    }, mime);

                    _refresh_list.call(that, list);

                  };

                  reader.readAsDataURL(file);

                }

              }

            });

          }

        }

      }, false);

    }

  };

  var _unbind_element = function() {

    var element = this.element;
    if (element !== null) {

      element.className = '';
      element.innerHTML = '';

      element.removeEventListener('dragenter');
      element.removeEventListener('dragover');
      element.removeEventListener('drop');

    }

  };



  /*
   * IMPLEMENTATION
   */

  var Class = function(data) {

    var settings = lychee.extend({}, data);


    this.element    = null;
    this.extensions = {
      'fnt':     true,
      'js':      true,
      'json':    true,
      'png':     true,
      'msc.mp3': true,
      'msc.ogg': true,
      'snd.mp3': true,
      'snd.ogg': true
    };
    this.files      = [];


    this.setExtensions(settings.extensions);
    this.setElement(settings.element);


    lychee.event.Emitter.call(this);

    settings = null;

  };


  Class.prototype = {

    refresh: function() {

      if (this.element !== null) {
        _refresh_list.call(this, this.element.querySelector('ul'));
      }

    },

    setElement: function(element) {

      element = element instanceof HTMLElement ? element : null;


      if (element !== null) {

        _unbind_element.call(this);
        this.element = element;
        _bind_element.call(this);


        return true;

      }


      return false;

    },

    setExtensions: function(extensions) {

      extensions = extensions instanceof Object ? extensions : null;


      if (extensions !== null) {

        this.extensions = {};

        for (var ext in extensions) {

          var allowed = extensions[ext];
          if (allowed === true || allowed === false) {
            this.extensions[ext] = allowed;
          }

        }


        return true;

      }


      return false;

    }

  };


  return Class;

});
