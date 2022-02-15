let briefHench = {
	websiteSDK: '',

	intlTel: '',

	score: 0,

	budget: 0,

	stepCount: 1,
	currentStep: 0,
	formSchema: {
		firstName: '',
		lastName: '',
		phoneNumber: '',
		emailAddress: '',
		howDidYouHearAboutMayple: '',
		source: '',
		
		websiteAddress: '',
		companyName: '',

		// Why does industry is array and not a string
		industry: {
			industryCategory: '',
			industrySubCategory: ''
		},

		// Is this the audience field?
		locations: [],

		productBusinessModel: [],

		estimatedMediaBudget: 0,

		// country: '',

		// currency: undefined,
		
		genders: [],
		
		isECommerce: false,
		languages: [],
		
		launchTimeFramePreference: undefined,
		mainGoal: 'IMPROVE_EXISTING_CAMPAIGNS',
		
		preferLocalMarketers: false,
		preferMarketerInTargetedLocations: false,
		
		requestsAssistanceForRequiredSkillsChoice: false,
		serviceTypes: [],
		state: undefined,
		targetKPI: 'ROAS',
		targetKPIValue: 0,
		
		ages: [],
	},

	getSelectedCountries: function() {
		const self = this;
		let countryField = $('.country-selection').select2('data');
		countryField.forEach(function(country) { self.formSchema['locations'].push(country.id); });
	},

	getSelectedSkills: function() {
		const self = this;
		$('.channel-selection .w--redirected-checked').each(function(index, el) {
			let selectedSkill = $(this).parent().attr('skill-type');
			console.log( 'Skill: ', selectedSkill );
			self.formSchema['serviceTypes'].push(selectedSkill);
		});
	},

	insertSDK: function() {
		const self = this;
		const WebsiteSDK = window.WebsiteSDK.default;
		self.websiteSDK = new WebsiteSDK({ environment: 'storky' });

		console.log('SDK: ', self.websiteSDK);
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

		let error = false;
		let form = $('.brief-stepped-form.active form');
		// form.submit();
		// 
		let fields = $('.brief-stepped-form.active input').filter('[required]');
		fields.each(function(index, field) {
			if (!field.checkValidity()) {
				console.log( 'Empty field: ', field );
				error = true;
				$('.error-message.stepped').removeClass('hidden');
				// field.parentNode.innerHTML += `<div class='brief-error-message'>${field.validationMessage}</div>`
			} else {
				error = false;
				$('.error-message.stepped').addClass('hidden');
			}
		});

		if ( form[0].id === 'welcome-brief-form_first') {
			// self.formSchema['industry'].push( $('.business-type-selection').select2('data')[0].id );
			self.formSchema['industry'].industrySubCategory = $('.business-type-selection').select2('data')[0].id;
			self.formSchema['industry'].industryCategory = $('.business-type-selection').find(':selected').closest('optgroup').attr('data-category');
			console.log( self.formSchema['industry'] );

			if (self.formSchema['industry'].industrySubCategory.length < 1) {
				error = true;
				$('#welcome-brief-form_first .select2-selection').addClass('empty-field');
			} else {
				error = false;
				$('#welcome-brief-form_first .select2-selection').removeClass('empty-field');
			}
		} else if (form[0].id === 'welcome-brief-form_second') {
			self.getSelectedCountries();
			if(self.formSchema['locations'].length < 1) {
				error = true;
				$('#welcome-brief-form_second .select2-selection').addClass('empty-field');
				$('.error-message.stepped').removeClass('hidden');
			} else {
				error = false;
				$('#welcome-brief-form_second .select2-selection').removeClass('empty-field');
				$('.error-message.stepped').addClass('hidden');
			}
			self.getTargetCountryScore();
		} else if ( form[0].id === 'welcome-brief-form_third' ) {
			self.getSelectedSkills();
		} else if (form[0].id === 'welcome-brief-form_fourth') {
			self.formSchema['estimatedMediaBudget'] = self.budget;
			console.log( self.formSchema['estimatedMediaBudget'] );
			self.getBudgetScore();
		} else if (form[0].id === 'welcome-brief-form_fifth') {
			self.formSchema['websiteAddress'] = document.getElementById('website').value;
			self.getWebsiteScore();
		} else {
			let inputs = form[0].querySelectorAll('input');
			inputs.forEach(function(input) {
				let inputName = input.getAttribute('name');
				self.formSchema[inputName] = input.value;
			});
		}

		if (error) {
			return; }

		$('.error-message.stepped').addClass('hidden');

		self.currentStep += 1;
		// console.log( self.currentStep );

		//self.updateFormData($('.brief-stepped-form.active'));
		console.log( 'step no: ', self.currentStep );
		if ($('.to-next-step').hasClass('final')) {
			self.submitForm();
			return;
		}
		if (self.currentStep === self.stepCount - 1) {
			$('.to-next-step').html('<p class="button-text">Submit</p>');
			$('.to-next-step').addClass('final');
		}

		// let validateForm = self.validateForm();
		// console.log( 'Validate form: ', validateForm ); 
		

		self.setSteps();

		// Change URL to allow users to swipe back
		// 
		//window.location.hash = `step=${self.currentStep + 1}`;

		$('.brief-stepped-form').addClass('hidden');

		$('.brief-stepped-form').eq(self.currentStep).removeClass('hidden');
		$('.brief-stepped-form').removeClass('active');
		$('.brief-stepped-form').eq(self.currentStep).addClass('active');
	},

	handleBack: function() {
		const self = this;

		if (self.currentStep === 0) {
			return; }

		self.currentStep -= 1;

		if (self.currentStep === 0) {
			$('.to-previous-step').hide();
		}
		if (self.currentStep != self.stepCount - 1) {
			$('.to-next-step').html('<p class="button-text">Continue</p>');
			$('.to-next-step').removeClass('final');
		}

		self.setSteps();

		// Change URL to allow users to swipe back
		// 
		//window.location.hash = `step=${self.currentStep + 1}`;

		$('.brief-stepped-form').addClass('hidden');
		$('.brief-stepped-form').eq(self.currentStep).removeClass('hidden');

		$('.brief-step-number').removeClass('active');
		$('.brief-stepped-form').removeClass('active');
		$('.brief-stepped-form').eq(self.currentStep).addClass('active');
		$(`.brief-step-number[data-step-number=${self.currentStep}]`).addClass('active');
	}, 

	validateForm: function() {
		let fields = $('input').filter('[required]');
		// console.log( 'Fields: ', fields );
		fields.each(function(index, field) {
			if (field.value.length < 1) {
				return false;
			}
		})
	},

	updateFormData: function(container) {
		const self = this;

		let inputs = container[0].querySelectorAll('input');

		inputs.forEach(function(input) {
			let inputName = input.getAttribute('name');
			self.formSchema[inputName] = input.value;
		});
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
		const self = this;
		console.log( self.websiteSDK );
		console.log( '---------' );
		console.log( self.formSchema );

		self.getConnectionTime();

		// self.websiteSDK.calcSalesQualificationLeadScore(self.formSchema);
		// console.log( 'Hubspot Score: ', hsScore );

		self.websiteSDK.createProjectLead(self.formSchema);
		self.websiteSDK.submitHubspotForm(self.formSchema);

		self.getScore();
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
			hiddenInput: "full_phone",
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
	},

	restructureBudget: function() {
		var rawValue = $('#marketingbudget').val().replace(/,/gi, "");
		var withComma = rawValue.split(/(?=(?:\d{3})+$)/).join(",");
		$('#marketingbudget').val(withComma);
		briefHench.budget = parseInt(rawValue);
	},

	checkTimeZone: function() {
		if (!document.querySelector('.call-preference-box')) {
			return; }

		let options = {
			hour: 'numeric',
			hour12: false,
			timeZone: 'America/New_York',
			weekday: 'long'
		};

		let timeInLA = new Intl.DateTimeFormat('en-AU', options).format(new Date());
			timeInLA = timeInLA.replace(/ /g, "");
			timeInLA = timeInLA.split(',');

			timeInLA[1] = parseInt(timeInLA[1]);
		if (17 > timeInLA[1] && timeInLA[1] > 7 && timeInLA[0] != 'Sunday' && timeInLA[0] != 'Saturday') {
			document.querySelector('.call-preference-box').classList.remove('hidden');
		} else {
			$('.radio-buttons input').removeAttr('required');
		}
	},

	getTargetCountryScore: function() {
		const self = this;
		const tierOne = ['US', 'CA', 'GB', 'AU'];
		const tierTwo = ['US', 'CA', 'GB', 'IL', 'AU', 'NZ'];
		const hasTargetCountries = self.formSchema.locations.some(result => tierOne.includes(result));
		const hasSecondTierCountries = self.formSchema.locations.some(result => tierTwo.includes(result));

		if (hasTargetCountries) {
			//self.hasEligibleTarget = true;
			self.score += 2
		} else if (hasSecondTierCountries) {
			self.score += 0;
		} else {
			self.score -= 7;
		}
	},

	getIPScore: function() {
		const self = this;
		const tierOne = ['US', 'CA'];
		const tierTwo = ['GB', 'IL', 'IR', 'SP', 'FR', 'DE', 'BE', 'PT', 'IT', 'NL', 'AU', 'DK', 'SE', 'NZ', 'SW', 'NH', 'LU', 'NO', 'FI'];
		const hasIPCountry = tierOne.includes(self.websiteSDK._userCountry);
		const hasSecondTierCountry = tierTwo.includes(self.websiteSDK._userCountry);

		if (hasIPCountry) {
			//self.hasEligibleTarget = true;
			self.score += 2
		} else if (hasSecondTierCountry) {
			self.score += 0;
		} else {
			self.score -= 3;
		}
	},

	getBudgetScore: function() {
		const self = this;

		if (self.budget >= 20000) {
			self.score += 3;
		} else if( self.budget >= 10000 ) {
			self.score += 2;
		} else if ( self.budget >= 3000 ) {
			self.score += 1;
		} else {
			self.score -= 4;
		}
	},

	getWebsiteScore: function() {
		const self = this;
		console.log( '------' );
		console.log( 'Before Website: ', self.score );
		if ($('#website').val().length > 0) {
			self.score += 3;
		} else {
			self.score -= 7;
		}
		console.log( 'After Website: ', self.score );
		console.log( '------' );
	},

	getConnectionTime: function() {
		const self = this;

		let selectedOption = document.querySelector('.connect-on.w--redirected-checked');
		if (selectedOption) {
			let requestsInstantCall = selectedOption.nextSibling.value;
			self.instantCall = requestsInstantCall;
		} else {
			self.instantCall = 'no';
		}
	},

	getScore: function() {
		if ( self.score > 3 ) {
			if ( self.instantCall === 'yes' ) {
				console.log( 'Show Instant call' );
				// self.showInstantCall();
			} else {
				console.log( 'Show long call!' );
				// self.showMeeting();
			}
		} else {
			if ( self.instantCall === 'yes' ) {
				console.log( 'Show Instant call' );
				// self.showInstantCall();
			} else {
				console.log( 'Show short call!' );
				// self.showShortMeeting();
			}
		}
	}
}

$( document ).ready(function(e) {
	$('.brief-stepped-form:first-child').addClass('active');
	//briefHench.getHash();
	briefHench.insertSDK();
	briefHench.setSteps();
	briefHench.initIntlTel();
	briefHench.listenStepChange();
	briefHench.initSelections();
	briefHench.checkTimeZone();
	briefHench.getIPScore();
});

$('#website').keyup(function(e) {
	briefHench.fillCompanyName();
});

$('#marketingbudget').keyup(function(e) {
	briefHench.restructureBudget();
});

$('#phone').keyup(function(e) {
	console.log( briefHench.intlTel );
});

$('#nowebsite').bind('change', function() {
	if ($('#nowebsite').is(':checked')) {
		$('#website').prop('readonly', true);
		$('#website').prop('required', false);
		$('#website').addClass('not-editable');
		$('#website').val('');
	} else {
		$('#website').prop('readonly', false);
		$('#website').prop('required', true);
		$('#website').removeClass('not-editable');
	}
});