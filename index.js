'use strict';
(function () {

  const path = require('path');
  const fs = require('fs');
  const crypto = require('crypto');
  const __halo = require('./src');

  var ALL = /(@\s*(#.*|\w+\s*\(\)|(\w+(\.\w+)?\s*)?\([\s\S]+?\)\s*|(end\w+|else(\s*if\s*\(.*\))?))\s*;|(#\s*)?{{{?[\s\S]+?}?}}|`|\\)/g;
  var STARTTAG = /\(/;
  var ENDTAG = /@\s*end.*/;
  const YIELD = /@\s*yield\s*\(.*?\)\s*;/g;

  var config = {
    caching: false,
    viewFolder: null,
    csrfField: null,
    csrfToken: null,
    extend: {}
  };

  var MemoryCache = null;
  var Args = null;

  exports.config = function (opts) {
    config = { ...config, ...opts };
    if (config.caching) {
      if (config.caching === 'memory') {
        MemoryCache = require( "memory-cache" );
      }
    }
    if (config.csrfField) {
      __halo.setCsrfField(config.csrfField); 
    }
    if (config.csrfToken) {
      __halo.csrfToken = function() {
        return typeof config.csrfToken === 'function' ? config.csrfToken() : config.csrfToken;
      };
    }
  };

  exports.createTemplate = function (string) {

    var ifs = [];
    var elseifs = [];
    var formModel = null;
    var layoutTag = false;

    try {

      string = string.replace(ALL, function (m) {
         
        if (m.match(/{.*/)) {
          // Do not execute this
          if (m.match(/#.*/)) {
            return m.replace('#', '');
          }
          // Dump unescaped content
          if (m.match(/{{{.*}}}/)) {
            return m.replace(/{{{/, '${(').replace(/}}}/, ') + ""}');
          }
          // Dump escaped content
          if (m.match(/{{.*}}/)) {
            return m.replace(/{{/, '${__halo.escapeHTML((').replace(/}}/, ') + "")}');
          }
        }

        if (m.match(/@\s*#/)) {
          return '';
        }

        if (m.match(/@\s*else\s*if/)) {
          elseifs.push(m);
          return m.replace(/@\s*else\s*if/, ' ` : ` ${').replace(/\)\s*;/, ') ? `');
        }

        if (m.match(STARTTAG)) {

          if (m.match(/@\s*layout\s*\(/)) {
            layoutTag = true;
            return m.replace(/\./g, '/').replace(/@\s*/, '__halo.').replace(/\)\s*;/, ', {');
          }

          if (m.match(/@\s*section\s*\(/)) {
            m = m.replace(/@\s*section\s*\(/, '');
            if (m.match(/,/g)) {
              return m.replace(/,/, ': ').replace(/\)\s*;/, '');
            }
            return m.replace(/\)\s*;/, ': `');
          }

          if (m.match(/@\s*include\s*\(/)) {
            return m.replace(/\./g, '/').replace(/@\s*/, '${ await __halo.').replace(/\)\s*;/, ') }');
          }

          if (m.match(/@\s*if\s*\(/)) {
            return m.replace(/@\s*if/, '${').replace(/\)\s*;/, ') ? `');
          }

          if (m.match(/.for\s*\(/)) {
            let args = m.match(/\((\w+|[\s\S]+?\))/)[0];
            return m.replace(/.*\s+in\s+/, '${ ').replace(/\)\s*;/, '.map' + args + ' => `');
          }

          if (m.match(/@\s*(js|css|csrfToken)\s*\(/)) {
            return m.replace(/@\s*/, '${ __halo.').replace(/\)\s*;/, ') }');
          }

          if (m.match(/@\s*form\.\w+\s*\(/)) {
            m = m.replace(/\(\s*\s*\w+\s*,/, function (model) {
              formModel = model.replace(/(,|\()/g, '');
              return '(';
            });
            return m.replace(/@\s*/, '${ __halo.').replace(/\)\s*;/, ') }');
          }

          if (m.match(/@\s*(input\.\w+|(select|button)(\.\w+)?|textarea|csrfToken|csrfField).*/)) {
            if (formModel) {
              m = m.replace(/\(\s*\w+/, function (attribute) {
                attribute = attribute.replace(/\(/, '');
                return `('${ attribute }', ${ formModel }.${ attribute }`;
              });
            }
            return m.replace(/(button|select)(?=\s*\()/, '$&.$&').replace(/@\s*/, '${ __halo.').replace(/\)\s*;/, ') }');
          }
        }


        if (m.match(ENDTAG)) {

          if (m.match(/@\s*endif/)) {
            if (ifs.length) {
              ifs.pop();
              var end = '';
              elseifs.forEach(function () {
                end = end + ' ` } ';
              });
              elseifs = [];
              return m.replace(m, ' ` }') + end;
            } else {
              return m.replace(m, ' ` : "" }');
            }
          }

          if (m.match(/@\s*endfor\W/)) {
            return m.replace(m, ' ` ).join("")}');
          }

          if (m.match(/@\s*endform/)) {
            formModel = null;
            return m.replace(m, '</form>');
          }

          if (m.match(/@\s*endsection/)) {
            return m.replace(m, '`,');
          }

        }

        if (m.match(/.else/)) {
          ifs.push(m);
          return m.replace(m, ' ` : `');
        }

        if (typeof config !== 'undefined') {
            for (let key in config.extend) {
                var regex = new RegExp('@\\s*' + key + '\\s*\\(');
                if (m.match(regex)) {
                    return m.replace(regex, '${ extend["' + key + '"](').replace(/\)\s*;/, ') }');
                }
            }
        }


        return m.replace(/[\\`]/g, '\\$&');
      });

    } catch (err) {
      return err;
    }

    if (layoutTag) {
      string += '} );';
    } else {
      string = '`' + string + '`';
    }
    
    return string;
  };

  exports.compile = function (string, args) {
    if (args) { setArgs(args); }
    try {
      string = config.viewFolder ? `return async () => { return await ${ string } }` : `return () => { return ${ string } }`;
      var html = new Function('__halo', ...Args.keys, string)(__halo, ...Args.values)();
      if (html instanceof Promise) {
        return html.then(async res => {
          return res;
        })
      } else {
        return html; 
      }
    } catch (e) {
      e.message = 'Halo template: ' + e.message;
      throw e;
    }
  };

  function createCompile(html) {
    var res = exports.createTemplate(html);
    return exports.compile(res);
  };

  exports.render = function (string, args) {
    setArgs(args);
    return createCompile(string);
  };

  exports.renderFile = function (filePath, args) {
    setArgs(args);
    filePath = getFullFilePath(filePath);
    return new Promise((resolve, reject) => {
      getFileTemplate(filePath).then(res => {
        return resolve(exports.compile(res));
      }).catch(err => {
        return reject(err);
      });
    });
  };


  __halo.include = async function(filePath) {
    filePath = getFullFilePath(filePath);
    return await getFileTemplate(filePath).then(async res => {
      return await exports.compile(res);
    });
  }

  __halo.layout = function(filePath, sections) {
    filePath = getFullFilePath(filePath);
    return new Promise((resolve, reject) => {
      getFileTemplate(filePath).then(res => {
        return resolve(exports.compile(addSections(res, sections)));
      }).catch(err => {
        return reject(err);
      });
    });
  }

  function addSections(layout, sections) {
    layout = layout.replace(YIELD, function (m) {
      let key = m.replace(/(@\s*yield\s*\(\s*("|')|("|')\s*\)\s*;)/g, '');
      let section = sections[key];
      if (section) {
        return section;
      } else {
        return '';
      }
    });
    return layout;
  }

  function setArgs(args) {
    Args = args ? {
      keys: Object.keys(args),
      values: Object.values(args)
    } : {
      keys: [],
      values: []
    };
    Args.keys.push('extend'); 
    Args.values.push(config.extend);
  }

  function getFullFilePath(filePath) {
    return path.resolve(config.viewFolder, filePath.replace(/\./g, '/') + '.halo.js');
  }

  function getFileTemplate(filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          return reject('Cannot read path: ' + filePath);
        }
        const md5 = crypto.createHash('md5').update(stats.mtime.toString()).digest('hex');
        let cached = null;
        if (MemoryCache) {
          cached = MemoryCache.get(filePath);
        }
        if (cached && cached.md5 === md5) {
          return resolve(cached.template);
        } else {
          if (MemoryCache) { MemoryCache.del(filePath); }
          fs.readFile(filePath, 'utf8', (err, string) => {
            if (err) {
              return reject('Cannot read path: ' + filePath);
            }
            let res = exports.createTemplate(string);
            if (MemoryCache) {
              MemoryCache.put(filePath, {
                template: res,
                md5: md5
              });
            }
            return resolve(res);
          });
        }
      });
    });
  }


  /* istanbul ignore if */
  if (typeof window !== 'undefined') {
    window.halo = exports;
  }

}());