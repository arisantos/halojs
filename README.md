# About HaloJS
HaloJS is a simple but powerful templating language that allows you to generate HTML markup in a Javascript manner.

## Installation
```bash
$ npm install --save draigjs
```
## Features
 * Create HTML markup with Javascript syntax
 * Fast compilation 
 * Multiline support
 * Support for partials & layouts

## Examples

```javascript
const halo = require('halojs');
// Renders a string
let compiled = halo.render(string, params);
// Renders a file
let compiled = halo.renderFile(filePath, params);
```

### Syntax
Creating a form:
```html
@form.upload('/contact', { novalidate: true, autocomplete: true });
    <div class="form-group">
        @ input.text
        (
            'name', 
            { 
                class: 'input form-control', 
                'data-validation': 'required', 
                'data-validation-error-msg': 'Please enter your full name', 
                placeholder: 'Your Name *'
            }
        );
    </div>
    <div class="form-group">
        <div class="row">
            <div class="col-sm-6">
                @ input.email('email', 
                    { 
                        class: 'input form-control', 
                        'data-validation': 'required', 
                        'data-validation-error-msg': 'Please enter your email address',
                            placeholder: 'Email Adress *' 
                    }
                );
            </div>
            <div class="col-sm-6">
                @ input.tel('phone', 
                    { 
                        class: 'input form-control', 
                        'data-validation': 'required', 
                        'data-validation-error-msg': 'Please enter your phone number', 
                        placeholder: 'Phone Number *'
                    }
                );
            </div>
        </div>
    </div>
    <div class="form-group">
        @ textarea('message', 
            { 
                class: 'input form-control', 
                'data-validation': 'required', 
                'data-validation-error-msg': 'Please leave a message', 
                placeholder: 'Your Message *', 
                rows: 3 
            }
        );
    </div>
    @ button.submit('Submit', { class: 'btn btn-block ui-gradient-green shadow-md' });
@endform;
```
## Docs
https://halojs.com

## License
HaloJS is released under the MIT license.