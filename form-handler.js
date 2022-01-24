console.log( 'Script Loaded' );

let formHandlerHench = {
	// Name of the form
	selector: 'wf-form-webflowLeadForm',

	// Forms endpoint upon successful submission
	redirectTo: '',

	fillLPSources: function() {
		let pagePath = window.location.pathname;
		if ( pagePath.startsWith('/lp/') ) {
			let forms = document.getElementsByName( formHandlerHench.selector );
			forms.forEach(function(form) {
				let lpSourceInput = document.createElement('input');
				lpSourceInput.type = 'text';
				lpSourceInput.className = 'hidden';
				lpSourceInput.id = 'lp_traffic_source';
				form.appendChild(lpSourceInput);

				lpSourceInput.value = pagePath.replace('/lp/', '');
			});
		}
	},

	getUTMFields: function() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		let forms = document.getElementsByName( formHandlerHench.selector );
		forms.forEach(function(form) {
			for (var param in params) {
				if (params.hasOwnProperty(param)) {
					let utmInput = document.createElement('input');
					utmInput.type = 'text';
					utmInput.className = 'hidden';
					utmInput.id = param;
					form.appendChild(utmInput);

					utmInput.value = params[param];
				}
			}
		});
	},

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
		const self = this;

		data = JSON.stringify(data);

		localStorage.setItem('formData', data);

		window.location.replace(self.redirectTo)
	}
}

let forms = document.getElementsByName( formHandlerHench.selector );
forms.forEach( function( form ) {
	form.addEventListener('submit', function(submission) {
		// Prevent the initial behaviour
		submission.preventDefault();

		// Store the redirect URL
		formHandlerHench.redirectTo = submission.target.getAttribute('redirect-to');

		formHandlerHench.checkLPSource(form);
		formHandlerHench.getFormValues(form);
	})
});

document.addEventListener('DOMContentLoaded', function(e) {
	formHandlerHench.fillLPSources();
	formHandlerHench.getUTMFields();
});