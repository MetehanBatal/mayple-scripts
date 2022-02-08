let briefHench = {
	stepCount: 1,
	currentStep: 0,

	insertSDK: function() {
		// const sdkScript = document.createElement('script');
		// const src = "https://static.cdn.mayple.com/website/js/website-sdk/website-sdk.js";

		// sdkScript.setAttribute('src', src);

		// document.body.appendChild(sdkScript);
		// <script src="https://static.cdn.mayple.com/website/js/website-sdk/website-sdk.js"></script>
		const WebsiteSDK = window.WebsiteSDK.default;
		const websiteSDK = new WebsiteSDK();

		console.log('SDK: ', websiteSDK);
	}, 

	setSteps: function() {
		const self = this;

		let totalSteps = $('.step').length;

		self.stepCount = totalSteps;

		for (let index = 0; totalSteps > index; index++) {
			$('.step-numbers').append(`<p class="brief-step-number" data-step-number=${index}></p>`);
		}

		$(`.brief-step-number[data-step-number=${self.currentStep}]`).addClass('active');

		let containerW = $('.step-numbers').width() - 64;
		
		let progressBarW = `calc(${self.currentStep}% + (${(self.stepCount - self.currentStep) * 4})px)`;
		console.log( 'Width: ', progressBarW );
		$('.active-progress-bar').css("width", progressBarW);

	},

	handleNext: function() {
		const self = this;

		// Reveal back button
		// 
		$('.to-previous-step').show();

		let requiredFields = $('.brief-stepped-form.active input').filter('[required]:visible');
		requiredFields.each(function(field) {
			console.log( requiredFields, field );
			// if ( field.val() < 1 ) {
				// $('.brief-stepped-form.active form').reportValidity();
			// }
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

		$('.to-previous-step').hide();

		let nextButton = $('.to-next-step');
		nextButton.click(function(e) {
			self.handleNext();
		});

		let backButton = $('.to-previous-step');
		backButton.click(function(e) {
			self.handleBack();
		});
	},

	initSelections: function() {
		$('.business-type-selection').select2({ placeholder: "Try Entertainment, Clothing, etc.", tags: true });
		$('.country-selection').select2({ placeholder: "Select countries" });
	},
}

$( document ).ready(function(e) {
	briefHench.insertSDK();
	briefHench.setSteps();
	briefHench.listenStepChange();
	briefHench.initSelections();
});