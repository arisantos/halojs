
@for (el in arrays);

<p>{{ el }}</p>

@endfor;

@for ((el, index) in arrays);

<p>{{ index }}</p>

@endfor;
