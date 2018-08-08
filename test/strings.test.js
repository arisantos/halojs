const halo = require('../index');


describe('parses Halo strings into HTML', () => {

  it('adds escaped string function results into HTML', () => {

    var expression = `&lt;h1&gt;${new Date().getFullYear()}&lt;/h1&gt;`;

    var res = halo.render('{{ "<h1>" + new Date().getFullYear() + "</h1>" }}');
    expect(res).toBe(expression);
  });

  it('adds unescaped string function results into HTML', () => {

    var expression = `<h1>${new Date().getFullYear()}</h1>`;

    var res = halo.render('{{{ "<h1>" + new Date().getFullYear() + "</h1>"  }}}');
    expect(res).toBe(expression);
  });

});
