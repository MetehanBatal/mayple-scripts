let briefHench = {
	stepCount: 1,
	currentStep: 0,


	setSteps: function() {
		const self = this;

		let totalSteps = $('.step').length;

		self.stepCount = totalSteps;

		for (let index = 0; totalSteps > index; index++) {
			$('.step-numbers').append(`<p class="brief-step-number" data-step-number=${index}></p>`);
		}

		$(`.brief-step-number[data-step-number=${self.currentStep}]`).addClass('active');
	},

	handleNext: function() {
		const self = this;

		// Reveal back button
		// 
		$('.to-previous-step').show();

		let requiredFields = $('.brief-stepped-form.active input').filter('[required]:visible');
		requiredFields.each(function(field) {
			if ( field.val() < 1 ) {
				$('.brief-stepped-form.active form').reportValidity();
			}
		});

		self.currentStep += 1;

		// Change URL to allow users to swipe back
		// 
		window.location.hash = `step=${self.stepCount}`;

		$('.brief-stepped-form').addClass('hidden');
		$('.brief-stepped-form').eq(self.currentStep).removeClass('hidden');
		$('.brief-stepped-form').eq(self.currentStep).addClass('active');

		$('.brief-step-number').removeClass('active');
		$(`.brief-step-number[data-step-number=${self.currentStep}]`).addClass('active');
	},

	handleBack: function() {
		const self = this;

		if (self.currentStep === 0) {
			$('.to-previous-step').hide();
			return; }

		self.currentStep -= 1;

		if (self.currentStep === 0) {
			$('.to-previous-step').hide();
		}

		// Change URL to allow users to swipe back
		// 
		window.location.hash = `step=${self.stepCount}`;

		$('.brief-stepped-form').addClass('hidden');
		$('.brief-stepped-form').eq(self.currentStep).removeClass('hidden');

		$('.brief-step-number').removeClass('active');
		$(`.brief-step-number[data-step-number=${self.currentStep}]`).addClass('active');
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