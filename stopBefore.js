(function(global) {

  function resolvePath(path, name) {
    if (name !== undefined || typeof path !== 'string')
      return { self: path
             , name: name
             , func: path[name]
             };

    var obj = global, parts = path.split('.'), i, n;
    for (i = 0, n = parts.length - 1; i < n; i++)
      obj = obj[parts[i]];

    return { self: obj
           , name: name = parts[n]
           , func: obj[name]
           , path: path
           };
  }

  function patch(old, now) {
    now.undo = function() { return old.self[old.name] = old.func; };
    return old.self[old.name] = now;
  }

  function callName(old) {
    return old.path || old.self+'.'+old.name;
  }

  function callSign(old, args) {
    var n = args.length, params = n ? n +' arg'+ (n===1? '' : 's') : '';
    return callName(old) +'('+ params + ')';
  }

  global.stopBefore = function stopBefore(self, name) {
    var old = resolvePath(self, name)
      , now = function patched() {
          debugger;
          var res = old.func.apply(this, arguments);
          return res;
        };
    return patch(old, now);
  };

  global.stopAfter = function stopAfter(self, name) {
    var old = resolvePath(self, name)
      , now = function patched() {
          var res = old.func.apply(this, arguments);
          debugger;
          return res;
        };
    return patch(old, now);
  };

  global.logBefore = function logBefore(self, name) {
    var old = resolvePath(self, name)
      , now = function patched() {
          console.log('-> '+ callSign(old, arguments));
          var res = old.func.apply(this, arguments);
          return res;
        };
    return patch(old, now);
  };

  global.logAfter = function logAfter(self, name) {
    var old = resolvePath(self, name)
      , now = function patched() {
          var res = old.func.apply(this, arguments);
          console.log('<- '+ callSign(old, arguments) +':', res);
          return res;
        };
    return patch(old, now);
  };

  global.logAround = function logAround(self, name) {
    var old = resolvePath(self, name)
      , now = function patched() {
          console.log('-> '+ callSign(old, arguments));
          var res = old.func.apply(this, arguments);
          console.log('<- '+ callSign(old, arguments) +':', res);
          return res;
        };
    return patch(old, now);
  };

  global.logCount = function logCount(self, name) {
    var old = resolvePath(self, name)
      , now = function patched() {
          console.count('-> '+ callName(old));
          var res = old.func.apply(this, arguments);
          return res;
        };
    return patch(old, now);
  };

})(this);