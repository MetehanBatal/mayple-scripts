let briefHench = {
	stepCount: 1,
	currentStep: 0,
	formSchema: {
		emailAddress: '',
		companyName: '',

		country: '',

		// currency: undefined,
		// firstName: '',
		// genders: [],
		// industry: [],
		// isECommerce: false,
		// languages: [],
		// lastName: '',
		// launchTimeFramePreference: undefined,
		// mainGoal: ProjectMainGoal.IMPROVE_EXISTING_CAMPAIGNS,
		// phoneNumber: '',
		// preferLocalMarketers: false,
		// preferMarketerInTargetedLocations: false,
		// productBusinessModel: [],
		// requestsAssistanceForRequiredSkillsChoice: false,
		// serviceTypes: [MarketingServiceType.OTHER],
		// state: undefined,
		// targetKPI: KpiType.ROAS,
		// targetKPIValue: 0,
		
		// locations: [Country.US, Country.CA],
		// estimatedMediaBudget: 5000,
		// websiteAddress: 'http://my-website.com',
		// country: Country.US,
		locations: [],
		estimatedMediaBudget: 0,
		websiteAddress: '',
		

		ages: [],
	},

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

		if (!$('.step-numbers').hasClass('steps-inserted')) {
			for (let index = 0; totalSteps > index; index++) {
				$('.step-numbers').append(`<p class="brief-step-number" data-step-number=${index}></p>`);
			}
			$('.step-numbers').addClass('steps-inserted');
		}

		$(`.brief-step-number[data-step-number=${self.currentStep}]`).addClass('active');

		let containerW = $('.step-numbers').width() - 64;
		
		let progressBarW = `calc(${(self.currentStep / (self.stepCount - 1)) * 100}% + ${(self.stepCount - self.currentStep - 1) * 4}px)`;
		// console.log( 'Width: ', progressBarW );
		$('.active-progress-bar').css("width", progressBarW);

	},

	handleNext: function() {
		const self = this;

		// Reveal back button
		// 
		$('.to-previous-step').show();

		let requiredFields = $('.brief-stepped-form.active input').filter('[required]:visible');
		requiredFields.each(function(field) {
			// console.log( requiredFields, field );
			// if ( field.val() < 1 ) {
				// $('.brief-stepped-form.active form').reportValidity();
			// }
		});

		self.currentStep += 1;

		if (self.currentStep === self.stepCount) {
			$('.to-next-step').html('<p class="button-text">Continue</p>')
			self.submitForm();
			return;
		}

		self.validateForm();

		self.setSteps();

		// Change URL to allow users to swipe back
		// 
		window.location.hash = `step=${self.currentStep + 1}`;

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

		self.setSteps();

		// Change URL to allow users to swipe back
		// 
		window.location.hash = `step=${self.currentStep + 1}`;

		$('.brief-stepped-form').addClass('hidden');
		$('.brief-stepped-form').eq(self.currentStep).removeClass('hidden');

		$('.brief-step-number').removeClass('active');
		$(`.brief-step-number[data-step-number=${self.currentStep}]`).addClass('active');
	}, 

	validateForm: function() {
		let fields = $('input,textarea,select').filter('[required]:visible');
		fields.each(function(field) {
			console.log( field, field.value, $(field).val() );
			// if (field.val().length < 1) {
			// 	console.log( 'Empty Field: ', field );
			// }
		})
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

	submitForm: function() {
		console.log( 'Submit' );
	},

	fillCompanyName: function() {
		if ($('#company').hasClass('no-autofill')) {
			return; }
		
		let value = $('#website').val();
		let valueSplit = value.split(".");
		let companyName = '';
		if (valueSplit[0].startsWith('http') || valueSplit[0].startsWith('www') || valueSplit[0].includes(':')) {
			companyName = valueSplit[1];
		} else {
			companyName = valueSplit[0];
		}
		if (value.length > 3) {
			$('#company').val(companyName)
		}
	},

	initIntlTel: function() {
		const self = this;
		let phoneInput = document.querySelector("#phone");
		self.intlTel = window.intlTelInput(phoneInput, {
			initialCountry: "auto",
			utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js",
			geoIpLookup: function(success, failure) {
				$.get("https://ipinfo.io?token=1fa95a0e3e5a98", function() {}, "jsonp").always(function(resp) {
					self.ipCountry = resp.country;
					success((resp && resp.country) ? resp.country : "us");
				});
			},
		});
	},

	getHash: function() {
		const self = this;
		let hash = window.location.hash;

		if (hash && hash.length > 0) {
			let stepNumber = parseInt( hash.substring(6) );
			self.currentStep = stepNumber - 1;
		}
	}
}

$( document ).ready(function(e) {
	briefHench.getHash();
	briefHench.insertSDK();
	briefHench.setSteps();
	briefHench.initIntlTel();
	briefHench.listenStepChange();
	briefHench.initSelections();
});

$('#website').keyup(function(e) {
	briefHench.fillCompanyName();
});