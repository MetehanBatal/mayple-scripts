console.log( 'Script Loaded' );

let formHandlerHench = {
	// Name of the form
	selector: 'wf-form-webflowLeadForm',

	// Forms endpoint upon successful submission
	redirectTo: '',

	getFormValues: function(form) {
		const self = this;

		// Get all inputs
		let inputs = form.querySelectorAll('input');
		// Empty object to store the data
		let formData = {};
		inputs.forEach(function( input ) {
			// Get the inputs name, this should match with the one on brief
			let inputName = input.getAttribute('name');
			if (inputName) {
				// inputName: inputValue
				formData[inputName] = input.value;
			}
		});
		
		self.writeToStorage(formData);
	},

	writeToStorage: function(data) {
		data = JSON.stringify(data);

		localStorage.setItem('formData', data);
		console.log( 'Saved' );
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