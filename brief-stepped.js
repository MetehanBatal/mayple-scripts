let briefHench = {
	stepCount: 1,
	currentStep: 0,


	getSteps: function() {
		const self = this;

		let totalSteps = $('.step').length;

		self.stepCount = totalSteps;
	},

	handleNext: function() {
		const self = this;

		// Reveal back button
		// 
		$('.to-previous-step').show();

		self.currentStep += 1;

		// Change URL to allow users to swipe back
		// 
		window.location.hash = `step=${self.stepCount}`;

		$('.brief-stepped-form').addClass('hidden');
		$('.brief-stepped-form')[self.currentStep].removeClass('hidden');
	},

	handleBack: function() {
		const self = this;

		if (self.currentStep === 0) {
			$('.to-previous-step').hide();
			return; }

		self.currentStep -= 1;

		// Change URL to allow users to swipe back
		// 
		window.location.hash = `step=${self.stepCount}`;

		$('.brief-stepped-form').addClass('hidden');
		$('.brief-stepped-form')[self.currentStep].removeClass('hidden');
	}, 

	listenStepChange: function() {
		const self = this;

		let nextButton = $('.to-next-step');
		nextButton.click(function(e) {
			self.handleNext();
		});

		let backButton = $('.to-previous-step');
		backButton.click(function(e) {
			self.handleBack();
		});
	}
}

$( document ).ready(function(e) {
	briefHench.setSteps();
	briefHench.listenStepChange();
});