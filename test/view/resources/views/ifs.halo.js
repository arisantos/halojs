@ if (typeof title !== 'undefined');
	<h1>{{ title }}</h1>
@ endif;

@ if ( new Date().getFullYear() === date );
	<h1>{{ date }}</h1>
@ endif;


@ if (typeof noExist !== 'undefined');
    <p>Doesn't exist</p>
@ else;
	<p>{{ message }}</p>
@ endif;


@ if (typeof doestExist !== 'undefined');
	<p>Doesn't exist</p>
@ else if (typeof elseif !== 'undefined');
	<p>{{ elseif }}</p>
@ else;
	{{{ footer }}}
@ endif;


@ if (typeof doestExist !== 'undefined');
    <p>Doesn't exist</p>
@ elseif (typeof nullHere !== 'undefined');
	<p>Null</p>
@ else;
	{{{ footer }}}
@ endif;
