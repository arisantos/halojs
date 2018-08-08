@form.post('/address', { class: 'form validate', autocomplete: true, novalidate: true });

  @textarea('message',
    {
      class: 'input form-control',
      'data-validation': 'required',
      'data-validation-error-msg': 'Please leave a message',
      placeholder: 'Your Message *',
      rows: 3
    }
  );

  @ button('Button', { class: 'btn btn-primary' });

@endform;

@ form.post(user, '/user', { id: 'userForm', autocomplete: true, novalidate: true });

	@ input.text(first_name, { required: true }) ;
  @ input.text(last_name, { required: true }) ;

  @ select(gender, { male: 'Male', female: 'Female' }, { class: 'select2' });

	@ input.text(position, { required: false });

  @ input.text(birthdate);

  @ textarea(bio, { style: 'width:100%;height:300px;' });

  @ button.submit('Submit');

@ endform;


@ form.put('/contact', { autocomplete: true, novalidate: true });

  @ button.reset('Reset', { class: 'btn btn-primary' });

@ endform;

@ form.delete('/user', { autocomplete: true, novalidate: true });

@ endform;

