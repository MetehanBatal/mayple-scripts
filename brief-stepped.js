let briefHench = {
	currentStep: 0,

	setSteps: function() {
		const self = this;

		let totalSteps = document.querySelectorAll('.step');
		console.log( totalSteps, totalSteps.length );
	}
}

$( document ).ready(function(e) {
	briefHench.setSteps();
});