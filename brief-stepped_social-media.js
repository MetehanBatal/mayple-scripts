let briefHench = {
	websiteSDK: '',

	selectedSkills: [],

	intlTel: '',

	score: 0,

	budget: 0,

	instantCall: 'no',

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
		industry: [{
			industryCategory: '',
			industrySubCategory: ''
		}],

		// Is this the audience field?
		locations: [
			'US'
		],

		productBusinessModel: [],

		estimatedMediaBudget: 0,
		frontendSalesQualificationScore: 0,

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
		serviceTypes: ['SOCIAL_MEDIA_MANAGEMENT'],
		state: undefined,
		targetKPI: 'ROAS',
		targetKPIValue: 0,
		
		ages: [],

		trafficSource: 'v4_stepped',
		lpTrafficSource: '',
		partnerStackReferralKey: '',
		requestedAnInstantCall: 'no'
	},

	setServices: function() {
		let pagePath = window.location.pathname;
		if (pagePath.startsWith('/lp/search-engine-marketing')) {
			briefHench.formSchema['serviceTypes'] = ['FACEBOOK_ADS', 'GOOGLE_ADS'];
			$('.to-next-step').show();
		} else if (pagePath.startsWith('/lp/social-media')) {
			briefHench.formSchema['serviceTypes'] = ['SOCIAL_MEDIA_MANAGEMENT'];
			$('.to-next-step').show();
		} else if (pagePath.startsWith('/lp/hire-ppc-experts')) {
			briefHench.formSchema['serviceTypes'] = ['FACEBOOK_ADS', 'GOOGLE_ADS'];
			$('.to-next-step').show();
		}
	},

	setTrafficSource: function() {
		let pagePath = window.location.pathname;
		if (pagePath.startsWith('/brief-2')) {
			briefHench.formSchema['trafficSource'] = 'stepped';
		} else if ( pagePath.startsWith('/lp/') ) {
			$('#lpTrafficSource').val(pagePath.replace( '/lp/', '' ));
		}
	},

	getSelectedCountries: function() {
		const self = this;
		let countryField = $('.country-selection').select2('data');
		countryField.forEach(function(country) {
			if (!self.formSchema['locations'].includes(country.id)) {
				self.formSchema['locations'].push(country.id);
			}
		});
	},

	getSelectedSkills: function() {
		const self = this;
		self.formSchema['serviceTypes'] = [];

		$('.channel-selection .w--redirected-checked').each(function(index, el) {
			let selectedSkill = $(this).parent().attr('skill-type');
			if(selectedSkill === 'PAID_ADVERTISING') {
				self.formSchema['serviceTypes'].push('FACEBOOK_ADS');
				self.formSchema['serviceTypes'].push('GOOGLE_ADS');
			} else {
				self.formSchema['serviceTypes'].push(selectedSkill);
			}
			self.selectedSkills.push( $(this).siblings('.checkbox-label').html() );
		});
	},

	insertSDK: function() {
		const self = this;
		const WebsiteSDK = window.WebsiteSDK.default;
		// self.websiteSDK = new WebsiteSDK({debug: true});
		self.websiteSDK = new WebsiteSDK();

		console.log('SDK: ', self.websiteSDK);
	},

	setSteps: function() {
		const self = this;

		let totalSteps = $('.step').length;

		self.stepCount = totalSteps;

		if (!$('.step-numbers').hasClass('steps-inserted')) {
			for (let index = 0; totalSteps > index; index++) {
				$('.step-numbers').append(`<div class="brief-step-number" data-step-number=${index}></div>`);
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

		let error = false;
		let form = $('.brief-stepped-form.active form');
		let pagePath = window.location.pathname;
		
		if (self.currentStep !== 0){
			$('.to-next-step').addClass('disabled');
		} 

		let fields = $('.brief-stepped-form.active input').filter('[required]');
		fields.each(function(index, field) {
			field.classList.remove('empty-field');
			if (!field.checkValidity()) {
				console.log( 'Empty field: ', field );
				error = true;
				field.classList.add('empty-field')
				$('.error-message.stepped').removeClass('hidden');
				return;
			} else {
				error = false;
				$('.error-message.stepped').addClass('hidden');
			}
		});

		if ($(fields).hasClass('empty-field')) {
			console.log( 'has an emtpy field' );
			return; }

		if ( form[0].id === 'welcome-brief-form_first') {
			self.formSchema['industry'][0].industrySubCategory = $('.business-type-selection').select2('data')[0].id;
			self.formSchema['industry'][0].industryCategory = $('.business-type-selection').find(':selected').closest('optgroup').attr('data-category');

			if (self.formSchema['industry'][0].industrySubCategory.length < 1) {
				error = true;
				$('#welcome-brief-form_first .select2-selection').addClass('empty-field');
			} else {
				error = false;
				$('#welcome-brief-form_first .select2-selection').removeClass('empty-field');

				let subCategory = self.formSchema['industry'][0].industrySubCategory;
				let category = self.formSchema['industry'][0].industryCategory
				const industryTraits = {
					label: subCategory,
					industryCategory: category,
					industrySubCategory: subCategory
				};
				self.websiteSDK.reportEvent('Wizard.Brief.Industry StepDone', industryTraits);
			}
		} else if ( form[0].id === 'welcome-brief-form_fourth' ) {
			// self.formSchema['estimatedMediaBudget'] = self.budget;
			if (!error) {
				const budgetTraits = {
					label: (self.budget || 'N/A').toString(), // Save as string
					estimatedMediaBudget: self.budget, // Save as int
				};
				self.websiteSDK.reportEvent('Wizard.Brief.MonthlyMediaBudget StepDone', budgetTraits);
				// briefHench.reportWizardBriefStepDone('Wizard.Brief.MonthlyMediaBudget StepDone');
			}
		} else if ( form[0].id === 'welcome-brief-form_third' ) {
			self.getSelectedSkills();

			if (self.selectedSkills.length === 1 && self.selectedSkills[0] != 'Other') {
				$('.selected-service').html(self.selectedSkills[0]);
			} else {
				$('.selected-service').addClass('hidden');
			}
			

			if (!error) {
				let skills = self.selectedSkills;
				const skillsSorted = skills ? skills.map((skill) => skill).sort() : null;
				const skillTraits = {
					label: skills ? skillsSorted : null,
					skills: skills ? skillsSorted : '',
				};
				self.websiteSDK.reportEvent('Wizard.Brief.MarketingSkills StepDone', skillTraits);

				$('.pagination-buttons').removeClass('first-step');
			}

			let pagePath = window.location.pathname;
			if (pagePath.startsWith('/lp/digital-marketing-new')) {
				$('.to-next-step').removeClass('disabled');
			}
		} else {
			let inputs = form[0].querySelectorAll('input');
			inputs.forEach(function(input) {
				let inputName = input.getAttribute('name');
				self.formSchema[inputName] = input.value;

				if (inputName === 'phoneNumber') {
					if (!briefHench.fullPhone || briefHench.fullPhone.length === 0) {
						briefHench.fullPhone = self.validatePhone();
					}
					console.log( 'Phone validation: ', briefHench.fullPhone );
					if (!briefHench.fullPhone) {
						error = true;
					} else {
						// error = false;
						self.formSchema['phoneNumber'] = self.fullPhone;
					}
				}

				if (inputName === 'estimatedMediaBudget') {
					self.formSchema['estimatedMediaBudget'] = self.budget;
				}
			});
			// self.getTargetCountryScore();
		}

		if ($(fields).hasClass('empty-field')) {
			console.log( 'has empty field' );
			return; }

		// Reveal back button
		// 
		$('.to-previous-step').show();
		$('.to-next-step').show();

		$('.error-message.stepped').addClass('hidden');

		self.currentStep += 1;
		// 

		if (self.currentStep === 1) {
			$('.to-next-step').addClass('final');
			briefHench.reportWizardBriefStepDone('Lead Created');
		} else {
			$('.to-next-step').removeClass('final');
		}

		//self.updateFormData($('.brief-stepped-form.active'));
		
		if ($('.to-next-step').hasClass('submittable') && self.formSchema.industry[0].industryCategory.length > 0) {
			self.submitForm();
			$('.brief-stepped-form').removeClass('active');
			return;
		}
		
		if (self.currentStep === self.stepCount - 1 ) {
			if (pagePath.startsWith('/lp/hire-ppc-experts')) {
				$('.to-next-step').html('<p class="button-text">Next</p>');
			} else {
				$('.to-next-step').html('<p class="button-text">Submit</p>');
			}
			$('.to-next-step').addClass('submittable');
			$('.to-next-step').removeClass('disabled');
		}

		if ( self.currentStep > parseInt($('.to-next-step').attr('data-step')) ) {
			$('.to-next-step').attr( 'data-step', self.currentStep );
		} else {
			$('.to-next-step').removeClass('disabled');
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

		if ($('.business-type-selection').closest('.brief-stepped-form').hasClass('active')) {
			$('body').addClass('on-industry-selection');
		}

		self.websiteSDK.submitHubspotForm(self.formSchema);

		if (self.currentStep === 1) {
			briefHench.reportWizardBriefStepDone('Lead Created');
		}

		if (pagePath.startsWith('/lp/hire-ppc-experts')) {
			$('.pagination-buttons').addClass('second-step');
		}
	},

	handleBack: function() {
		const self = this;

		if (self.currentStep === 0) {
			return; }

		self.currentStep -= 1;

		$('.to-next-step').removeClass('disabled');
		$('.to-next-step').removeClass('submittable');

		if (self.currentStep === 0) {
			$('.to-previous-step').hide();
		}
		if (self.currentStep != self.stepCount - 1) {
			$('.to-next-step').html('<p class="button-text">Next</p>');
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
		$('.business-type-selection').select2({ placeholder: "Try Entertainment, Clothing, etc." });
		$('.country-selection').select2({ placeholder: "Select countries" });
	},

	submitForm: function() {
		const self = this;

		// self.getConnectionTime();

		self.formSchema['frontendSalesQualificationScore'] = self.websiteSDK.calcSalesQualificationLeadScore(self.formSchema);

		console.log( self.websiteSDK );
		console.log( '---------' );
		console.log( self.formSchema );

		self.websiteSDK.createProjectLead(self.formSchema);
		self.websiteSDK.submitHubspotForm(self.formSchema);

		briefHench.reportWizardBriefStepDone('Wizard.Brief Finished');

		self.getScore();
		console.log( 'Hubspot Score: ', self.formSchema['frontendSalesQualificationScore'] );
	},

	showMeeting: function(type) {
		$('.brief-stepped-form').addClass('hidden');
		$('#meeting-step').removeClass('hidden');
		$('.pagination-buttons').addClass('hidden');
		// $('.brief-stepped-form-box').css({'paddingBottom': '12px', 'paddingTop': '140px'});

		let container = $('#meeting-container');

		let firstname = $('#firstname').val();
		let lastname = $('#lastname').val();
		let email = $('#email').val();
		let company = $('#company').val();
		let phone = $('#phone').val();

		let template = '';

		if ( type === 'long' ) {
			template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/amir-keren1/discovery-round-robin?embed=true&firstname=${firstname}&lastname=${lastname}&email=${email}&company=${company}"></div>`;

			window.mayple_analytics.track('Lead SalesQualified', { category: 'Lead', action: 'SalesQualified' });
		} else if ( type === 'short' ) {
			window.location.href = 'https://app.mayple.com/login?register=1';
			//template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/omerfarkash/15-minutes-round-robin-homepage-new-test?embed=true&firstname=${firstname}&lastname=${lastname}&email=${email}"></div>`;
		} else {
			template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/amir-keren1/sales-team-round-robin?embed=true&firstname=${firstname}&lastname=${lastname}&email=${email}&phone=${phone}"></div>`;
		}
		
		container.append(template);
		$.getScript("https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js").done(function(script, textStatus) {})
	},

	showInstantCall: function() {
		// $('.brief-stepped-form').addClass('hidden');
		// $('.pagination-buttons').addClass('hidden');
		// $('#instantcall-screen').removeClass('hidden');
		
		window.location.href = 'https://mayple.com/thank-you?name=' + briefHench.formSchema['firstName'] + '&option=instant';
	},

	isDefined: function(variable) {
		try {
			variable;
			console.log( 'variable: ', variable );
			return true;
		} catch {
			return false;
		}
	},

	fillCompanyName: function() {
		if ($('#company').hasClass('no-autofill')) {
			return; }		
		
		let value = $('#website').val();
		if (value.length > 5 && !value.startsWith('http')) {
			$('#website').val('https://' + value);
		};
		if (value.startsWith('http://')) {
			$('#website').val(value.replace('http://', 'https://'));
		}
		if (value.includes('%20')) {
			value.replace('%20', '')
		};
		if (value.includes(' ')) {
			value.replace(' ', '')
		};
		value.toLowerCase();
		
		let companyName = '';
		let hostname = new URL(value).hostname;
		let valueSplit = value.split(".");
		valueSplit[0] = valueSplit[0].slice(8);

		if (valueSplit[0].startsWith('www')) {
			companyName = valueSplit[1];
		} else {
			companyName = valueSplit[0];
		}

		$('.to-next-step').removeClass('disabled');

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

	validatePhone: function() {
		const self = this;

		let iti = self.intlTel;
		// if (iti.)
		if (iti.isValidNumber()) {
			$('#phone').removeClass('empty-field');
			return iti.getNumber();
		} else {
			$('#phone').addClass('empty-field');
			return false;
		}
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
		var rawValue = $('#marketingbudget').val().replace(",", "");
		if (parseInt(rawValue) > 1000000) {
			rawValue = '1000000';
		}
		var withComma = rawValue.split(/(?=(?:\d{3})+$)/).join(",");
		$('#marketingbudget').val(withComma);

		rawValue = parseInt(rawValue);
		briefHench.formSchema[estimatedMediaBudget] = rawValue;
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
			$('.phone-call').removeClass('hidden');
			$('.step-count-box').addClass('phone-added');
		} else {
			$('.radio-buttons input').removeAttr('required');
		}
	},

	checkUTMParams: function() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		let cookie = Cookies.get('_mayple_utm_params');
		if (cookie) {
			let obj = JSON.parse(cookie);

			if (params['utm_source'] && !params['utm_source'].toLowerCase().includes('direct')) {
				console.log( 'Passed' );
				$('#howDidYouHearAboutMayple').removeAttr('required');
				$('#howDidYouHearAboutMayple').addClass('hidden');
			}

			if (obj['utm_source'] && obj['utm_source'].length > 0) {
				$('#howDidYouHearAboutMayple').removeAttr('required');
				$('#howDidYouHearAboutMayple').addClass('hidden');
			}
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
			self.formSchema['frontendSalesQualificationScore'] += 2
		} else if (hasSecondTierCountries) {
			self.formSchema['frontendSalesQualificationScore'] += 0;
		} else {
			self.formSchema['frontendSalesQualificationScore'] -= 7;
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
			self.formSchema['frontendSalesQualificationScore'] += 2
		} else if (hasSecondTierCountry) {
			self.formSchema['frontendSalesQualificationScore'] += 0;
		} else {
			self.formSchema['frontendSalesQualificationScore'] -= 3;
		}
	},

	getBudgetScore: function() {
		const self = this;

		if (self.budget >= 20000) {
			self.formSchema['frontendSalesQualificationScore'] += 3;
		} else if( self.budget >= 10000 ) {
			self.formSchema['frontendSalesQualificationScore'] += 2;
		} else if ( self.budget >= 3000 ) {
			self.formSchema['frontendSalesQualificationScore'] += 1;
		} else {
			self.formSchema['frontendSalesQualificationScore'] -= 4;
		}
	},

	getWebsiteScore: function() {
		const self = this;
		console.log( '------' );
		console.log( 'Before Website: ', self.formSchema['frontendSalesQualificationScore'] );
		if ($('#website').val().length > 0) {
			self.formSchema['frontendSalesQualificationScore'] += 3;
		} else {
			self.formSchema['frontendSalesQualificationScore'] -= 7;
		}
		console.log( 'After Website: ', self.formSchema['frontendSalesQualificationScore'] );
		console.log( '------' );
	},

	getConnectionTime: function() {
		const self = this;

		let selectedOption = document.querySelector('.connect-on.w--redirected-checked');
		if (selectedOption) {
			let requestsInstantCall = selectedOption.nextSibling.value;
			self.instantCall = requestsInstantCall;
			self.formSchema['requestedAnInstantCall'] = requestsInstantCall;
		} else {
			self.instantCall = 'no';
			self.formSchema['requestedAnInstantCall'] = 'no';
		}
	},

	getScore: function() {
		const self = this;
		console.log( 'Called' );
		if ( self.formSchema['frontendSalesQualificationScore'] > 3 ) {
			self.showMeeting('long');
		} else if ( self.formSchema['frontendSalesQualificationScore'] >= 0 && 3 >= self.formSchema['frontendSalesQualificationScore'] ) {
			self.showMeeting('mid');
		} else {
			self.showMeeting('short');
		}
	},

	getAutoPopulatedFields: function() {
		let data = localStorage.getItem('formData');
		if (!data) {
			return; }

		data = JSON.parse(data);
		
		for (var field in data) {
			if (data.hasOwnProperty(field)) {
				if ( document.getElementById(field) ) {
					document.getElementById(field).value = data[field];
				} else {
					console.log( 'Missing field: ', field );
				}

				if (field === 'phone') {
					console.log( 'Field: ', data[field] );
					briefHench.fullPhone = data[field];
				}
			}
		}
	},

	checkGrowsumoKey: function() {
		const self = this;

		let growsumoKey = Cookies.get('growSumoPartnerKey');
		if (growsumoKey && growsumoKey.length > 0) {
			document.getElementById('partnerKey').value = growsumoKey;
		}
		// if (self)
	},

	reportWizardBriefStepDone(eventName, traits) {
		if (traits) {
			console.log( 'Sent the event with traits' );
			window.mayple_analytics.track(eventName, traits);	
		} else {
			const [category, action] = eventName.split(' ');
			window.mayple_analytics.track(eventName, { category, action });
		}
	}
}

$( document ).ready(function(e) {
	$('.to-next-step').hide();
	$('.brief-stepped-form:first-child').addClass('active');
	$('.to-next-step').attr('data-step', '0');
	//briefHench.getHash();
	briefHench.insertSDK();
	briefHench.setSteps();
	briefHench.initIntlTel();
	briefHench.listenStepChange();
	briefHench.initSelections();
	briefHench.checkTimeZone();
	// briefHench.getIPScore();
	briefHench.getAutoPopulatedFields();
	briefHench.checkGrowsumoKey();

	briefHench.setTrafficSource();

	briefHench.checkUTMParams();

	briefHench.setServices();

	setTimeout(function() {
		window.va.identify();
		briefHench.reportWizardBriefStepDone('Wizard.Brief Started');
	}, 3200);
});

$('#website').keyup(function(e) {
	briefHench.fillCompanyName();
});

$('#marketingbudget').keyup(function(e) {
	let lastChar = $('#marketingbudget').val().slice(-1);
	
	if (isNaN(lastChar)) {
		let value = $('#marketingbudget').val().slice(0, -1);
		$('#marketingbudget').val(value);
		return;
	}

	briefHench.restructureBudget();
	if ($('#marketingbudget').val().length > 0) {
		$('.to-next-step').removeClass('disabled');
	} else {
		$('.to-next-step').addClass('disabled');
	}
});

// $('#phone').keyup(function(e) {
// 	console.log( briefHench.intlTel );
// });

$('#nowebsite').bind('change', function() {
	if ($('#nowebsite').is(':checked')) {
		$('#website').prop('readonly', true);
		$('#website').prop('required', false);
		$('#website').addClass('not-editable');
		$('#website').val('');
		$('.to-next-step').removeClass('disabled');
	} else {
		$('#website').prop('readonly', false);
		$('#website').prop('required', true);
		$('#website').removeClass('not-editable');
		$('.to-next-step').addClass('disabled');
	}
});

$('.channel-selection input').bind('change', function(e) {
	$('.channel-selection .brief-checkbox').removeClass('selected');
	$(this).parent().addClass('selected');

	setTimeout(function() {
		console.log( $('.channel-selection .w--redirected-checked') );
		if ($('.channel-selection .w--redirected-checked').length > 0) {
			$('.to-next-step').removeClass('disabled');
			$('.to-next-step').show();
			$('.to-next-step').click();
			$('.pagination-buttons').removeClass('hidden');
		} else {
			$('.to-next-step').addClass('disabled');
		}
	}, 120)
});

$('.not-sure').click(function() {
	briefHench.formSchema['serviceTypes'] = ['OTHER'];
	briefHench.formSchema['requestsAssistanceForRequiredSkillsChoice'] = true;

	briefHench.currentStep += 1;

	briefHench.setSteps();
	$('.to-next-step').show();
	
	$('.brief-stepped-form').addClass('hidden');
	$('.brief-stepped-form').eq(briefHench.currentStep).removeClass('hidden');
	$('.brief-stepped-form').removeClass('active');
	$('.brief-stepped-form').eq(briefHench.currentStep).addClass('active');
});

window.addEventListener("message", function(e) {
	if (!e.origin === 'https://meetings.hubspot.com') { return; }
	// console.log( e.data );
	if (e.data.meetingBookSucceeded) {
		briefHench.reportWizardBriefStepDone('Wizard.Brief.Call Scheduled');
		window.location.href = 'https://app.mayple.com/login?register=1';
		//window.location.href = 'https://mayple.com/thank-you?name=' + briefHench.formSchema['firstName'];
	}
});

$('.business-type-selection').on('select2:select', function (e) {
	$('.select2-container .select2-selection--single').addClass('selected');

	$('.to-next-step').removeClass('disabled');
});


$('.country-selection').on('select2:select', function (e) {
	$('.select2-container .select2-selection--multiple').addClass('selected');

	$('.to-next-step').removeClass('disabled');
});

$('.business-type-selection').on("select2:open", function (e) {
	console.log( 'Typed: ', e );
	$('.select2-search__field').on('input', function(event) {
		if (event.target.value.length > 0) {
			$('body').removeClass('on-industry-selection');
		} else {
			$('body').addClass('on-industry-selection');
		}
	});
	
});