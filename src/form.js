'use strict';
(function () {
  
  var csrfField = function() { return ''; };

  exports.setCsrfField = function (arg) {
    if (typeof arg === 'function') { 
      csrfField = arg; 
    } else {
      csrfField = () => { return arg; };
    }
  };

  exports.form = {
    get: (url, args) => _getForm('GET', url, args),
    post: (url, args) => _getForm('POST', url, args),
    put: (url, args) => _getForm('PUT', url, args),
    patch: (url, args) => _getForm('PATCH', url, args),
    delete: (url, args) => _getForm('DELETE', url, args),
    upload: (url, args) => _getForm('UPLOAD', url, args)
  };

  exports.input = {
    button: (name, ...args) => _getInput('button', name, args),
    checkbox: (name, ...args) => _getInput('checkbox', name, args),
    color: (name, ...args) => _getInput('color', name, args),
    date: (name, ...args) => _getInput('date', name, args),
    datetime: (name, ...args) => _getInput('datetime-local', name, args),
    email: (name, ...args) => _getInput('email', name, args),
    file: (name, ...args) => _getInput('file', name, args),
    hidden: (name, ...args) => _getInput('hidden', name, args),
    image: (name, ...args) => _getInput('image', name, args),
    month: (name, ...args) => _getInput('month', name, args),
    number: (name, ...args) => _getInput('number', name, args),
    password: (name, ...args) => _getInput('password', name, args),
    radio: (name, ...args) => _getInput('radio', name, args),
    range: (name, ...args) => _getInput('range', name, args),
    reset: (name, ...args) => _getInput('reset', name, args),
    search: (name, ...args) => _getInput('search', name, args),
    submit: (name, ...args) => _getInput('submit', name, args),
    tel: (name, ...args) => _getInput('tel', name, args),
    text: (name, ...args) => _getInput('text', name, args),
    time: (name, ...args) => _getInput('time', name, args),
    url: (name, ...args) => _getInput('url', name, args),
    week: (name, ...args) => _getInput('week', name, args),
  };

  exports.select = {
    select: (name, ...args) => {
      let [p1, p2, p3] = args;
      let selected;
      let options;
      let attributes;
      if (typeof p1 === 'string') {
        selected = p1;
        options = p2;
        attributes = p3;
      } else {
        options = p1;
        attributes = p2;
      }
      return _getSelect(name, options, attributes, selected);
    },
  };

  exports.button = {
    button: (...args) => _getButton('button', args[0], args[1]),
    submit: (...args) => _getButton('submit', args[0], args[1]),
    reset: (...args) => _getButton('reset', args[0], args[1])
  };

  exports.textarea = function (name, ...args) {
    let [p1, p2] = args;
    let value = p1 && typeof p1 === 'string' ? p1 : '';
    let options;
    if (typeof p2 === 'object') {
      options = p2;
    } else if (typeof p1 === 'object') {
      options = p1;
    }
    return `<textarea name="${ name }"${ _getHTMLAttributes(options) }>${ value }</textarea>`;
  };


  function _getForm(method, url, args) {
    return `<form action="${ url }" method="${ method !== 'GET' ? 'POST' : 'GET' }"${ _getHTMLAttributes(args) }${ method === 'UPLOAD' ? ' enctype="multipart/form-data"' : ''}>
      ${ method !== 'GET' ? csrfField() : '' }
      ${ method !== 'GET' && method !== 'POST' && method !== 'UPLOAD' ? `<input type="hidden" name="_method" value="${ method }">` : ''}`;
  }


  function _getInput(type, name, args) {
    let [p1, p2] = args;
    let value = p1 && typeof p1 === 'string' ? p1 : '';
    let options;
    if (typeof p2 === 'object') {
      options = p2;
    } else if (typeof p1 === 'object') {
      options = p1;
    }
    return `<input type="${ type }" name="${ name }" value="${ value }"${ _getHTMLAttributes(options) }>`;
  }

  function _getButton(type, text, args) {
    return `<button type="${ type }"${ _getHTMLAttributes(args) }>${ text }</button>`;
  }

  function _getSelect(name, options, attributes, selected) {
    return `<select name="${ name }"${ _getHTMLAttributes(attributes) }>${ Object.keys(options).map(key => {
      return `<option value="${ key }"${ key === selected ? ' selected' : ''}>${ options[key] }</option>`; }).join('') }</select>`;
  }

  function _getHTMLAttributes(options) {
    let attributes = '';
    if (options) {
      for (let key in options) {
        switch (key) {
          case 'autocomplete':
            attributes += `${ options[key] === true ? ' autocomplete="on"' : ' autocomplete="off"' }`;
            break;
          case 'autofocus':
            attributes += `${ options[key] === true ? ' autofocus' : '' }`;
            break;
          case 'disabled':
            attributes += `${ options[key] === true ? ' disabled' : '' }`;
            break;
          case 'formnovalidate':
            attributes += `${ options[key] === true ? ' formnovalidate' : '' }`;
            break;
          case 'multiple':
            attributes += `${ options[key] === true ? ' multiple' : '' }`;
            break;
          case 'novalidate':
            attributes += `${ options[key] === true ? ' novalidate' : '' }`;
            break;
          case 'readonly':
            attributes += `${ options[key] === true ? ' readonly' : '' }`;
            break;
          case 'required':
            attributes += `${ options[key] === true ? ' required' : '' }`;
            break;
          default:
            attributes += ` ${ key }="${ options[key] }"`;
            break;
        }
      }
    }
    return attributes;
  }
}());