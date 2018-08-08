const path = require('path');
const halo = require('../../index');
halo.config({ 
  caching: 'memory', 
  viewFolder: path.normalize(__dirname + '/resources/views'),
  csrfField: () => {
    return '<input type="hidden" name="_csrf" value="token_here">';
  } 
});

let session = { csrfToken: 'token_here' };
let title = 'DraigJS';
let message = 'NodeJS Web Framework';


describe('parses Halo variables into HTML', () => {

  it('adds JS expression result into HTML', async () => {

    let expression = new Date().getFullYear();
    let unescaped = '<div>Unescaped variable</div>';

    return await halo.renderFile('variables', {
      title,
      message,
      unescaped
    }).then(res => {
      expect(res).toMatch(expression.toString());
    });

  });

  it('adds unescaped variables to HTML', async () => {

    let unescaped = '<div>Unescaped variable</div>';

    return await halo.renderFile('variables', {
      title,
      message,
      unescaped
    }).then(res => {
      expect(res).toMatch(unescaped);
    });

  });

  it('adds escaped variables to HTML', async () => {

    let title = '<div>DraigJS</div>';
    let message = '<p>NodeJS Web Framework</p>';
    let unescaped = null;

    return await halo.renderFile('variables', {
      title,
      message,
      unescaped
    }).then(res => {
      expect(res).toMatch(/&lt;div&gt;DraigJS&lt;\/div&gt;/);
      expect(res).toMatch(/&lt;p&gt;NodeJS Web Framework&lt;\/p&gt;/);
    });

  });

});

describe('injects Halo sections & partials into layout', () => {

  it('yields a section into layout', async () => {

    return await halo.renderFile('section', {
      title,
      message
    }).then(res => {
      expect(res).toMatch(/<!doctype html>.*[\s\S]*<\/html>/);
      expect(res).toMatch(title);
      expect(res).toMatch(message);

    });

  });

  it('yields mutilpe sections to layout', async () => {

    return await halo.renderFile('sections', {
      title,
      message
    }).then(res => {
      expect(res).toMatch(/<!doctype html>.*[\s\S]*<\/html>/);
      expect(res).toMatch(title);
      expect(res).toMatch(message);
      expect(res).toMatch(/<footer><\/footer>/);
    });

  });

  it('includes partials into layout', async () => {

    let partialOne = 'Partial one included';
    let partialTwo = 'Partial two included';
    let partialThree = 'Partial three included';

    return await halo.renderFile('include', {
      title,
      message,
      partialOne,
      partialTwo,
      partialThree
    }).then(res => {
      expect(res).toMatch('<p>' + partialOne + '</p>');
      expect(res).toMatch('<p>' + partialTwo + '</p>');
      expect(res).toMatch('<p>' + partialThree + '</p>');
    });

  });

});

describe('parses Halo conditionals & loops into HTML', () => {

  it('adds html under if, else if and else conditions', async () => {

    let elseif = 'ELSE IF HERE';
    let footer = '<footer></footer>';
    let date = new Date().getFullYear();

    return await halo.renderFile('ifs', {
      title,
      message,
      elseif,
      footer,
      date
    }).then(res => {
      expect(res).toMatch(title);
      expect(res).toMatch(message);
      expect(res).toMatch(elseif);
      expect(res).toMatch(footer);
      expect(res).toMatch(date.toString());
    });

  });

  it('loops through an object', async () => {

    let arrays = ['array1', 'array2', 'array3'];

    return await halo.renderFile('for', {
      arrays
    }).then(res => {
      expect(res).toMatch('array1');
      expect(res).toMatch('array2');
      expect(res).toMatch('array3');
      expect(res).toMatch('0');
      expect(res).toMatch('1');
      expect(res).toMatch('2');
    });

  });

});

describe('parses Halo asset functions into HTML', () => {

  it('adds assets into HTML', async () => {

    let asset = '/assets/js/1.js';

    return await halo.renderFile('assets', {
      asset
    }).then(res => {
      expect(res).toMatch('<link href="/assets/css/1.css" rel="stylesheet">');
      expect(res).toMatch('<link href="/assets/css/2.css" rel="stylesheet">');
      expect(res).toMatch('<script src="/assets/js/1.js"></script>');
      expect(res).toMatch('<script src="/assets/js/2.js"></script>');
    });

  });


});

describe('parses Halo form functions into HTML', () => {

  it('adds form with inputs into HTML', async () => {

    let user = {
      first_name: 'John',
      last_name: 'Doe',
      position: 'director',
      gender: 'male',
      birthdate: '12 Dec 2000',
      bio: 'Some biography here'
    };

    return await halo.renderFile('forms', {
      user
    }).then(res => {
      expect(res).toMatch('<form action="/address" method="POST" class="form validate" autocomplete="on" novalidate>');
      expect(res).toMatch('<form action="/user" method="POST" id="userForm" autocomplete="on" novalidate>');
      expect(res).toMatch('<input type="hidden" name="_csrf" value="token_here">');
      expect(res).toMatch('<input type="hidden" name="_method" value="PUT">');
      expect(res).toMatch('<input type="hidden" name="_method" value="DELETE">');
      expect(res).toMatch('</form>');
      expect(res).toMatch('<textarea name="message" class="input form-control" data-validation="required" data-validation-error-msg="Please leave a message" placeholder="Your Message *" rows="3"></textarea>');
      expect(res).toMatch('<input type="text" name="first_name" value="John" required>');
      expect(res).toMatch('<input type="text" name="last_name" value="Doe" required>');
      expect(res).toMatch('<select name="gender" class="select2"><option value="male" selected>Male</option><option value="female">Female</option></select>');
      expect(res).toMatch('<input type="text" name="position" value="director">');
      expect(res).toMatch('<input type="text" name="birthdate" value="12 Dec 2000">');
      expect(res).toMatch('<textarea name="bio" style="width:100%;height:300px;">Some biography here</textarea>');
      expect(res).toMatch('<button type="button" class="btn btn-primary">Button</button>');
      expect(res).toMatch('<button type="submit">Submit</button>');
      expect(res).toMatch('<button type="reset" class="btn btn-primary">Reset</button>');
    });

  });


});
