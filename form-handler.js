console.log( 'Script Loaded' );

let formHandlerHench = {
	// Name of the form
	selector: 'wf-form-webflowLeadForm',


}

let forms = document.getElementsByName( formHandlerHench.selector );
forms.forEach( function( form ) {
	form.addEventListener('submit', function(submission) {
		// Prevent the initial behaviour
		submission.preventDefault();

		// Store the redirect URL
		let redirectTo = submission.target.getAttribute('data-redirect');

		console.log( redirectTo );
	})
})