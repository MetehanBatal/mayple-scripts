console.log( 'Script Loaded' );

let formHandlerHench = {
	// Name of the form
	selector: 'wf-form-webflowLeadForm',

	// Forms endpoint upon successful submission
	redirectTo: '',

	getFormValues: function(form) {
		let inputs = form.querySelectorAll('input');
		let formData = {};
		inputs.forEach(function( input ) {
			let inputName = input.getAttribute('name');
			formData[inputName] = input.value;
		});
		console.log( 'Form Data: ', formData );
	}
}

let forms = document.getElementsByName( formHandlerHench.selector );
forms.forEach( function( form ) {
	form.addEventListener('submit', function(submission) {
		// Prevent the initial behaviour
		submission.preventDefault();

		// Store the redirect URL
		formHandlerHench.redirectTo = submission.target.getAttribute('redirect-to');

		formHandlerHench.getFormValues(form);
	})
})