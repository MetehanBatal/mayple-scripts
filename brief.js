let briefHench = {
	websiteSDK: '',

	intlTel: '',

	fullPhone: '',

	score: 0,

	budget: 0,

	instantCall: 'no',

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
		locations: [],

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
		serviceTypes: [],
		state: undefined,
		targetKPI: 'ROAS',
		targetKPIValue: 0,
		
		ages: [],

		trafficSource: 'v1_short',
		lpTrafficSource: '',
		partnerStackReferralKey: '',
		requestedAnInstantCall: 'no'
	},

	initSDK: function() {
		const self = this;
		const WebsiteSDK = window.WebsiteSDK.default;
		self.websiteSDK = new WebsiteSDK();

		console.log('SDK: ', self.websiteSDK);
	},

	calculateScore: function() {
		const self = this;
		console.log( 'Score: ', self.formSchema['frontendSalesQualificationScore'] );
		if ( self.formSchema['frontendSalesQualificationScore'] > 3 ) {
			briefHench.initMeeting('long');
		} else {
			briefHench.initMeeting('short');
		}
	},

	showInstantCall: function() {
		const self = this;
		$(window).scrollTop(0);
		
		$('.brief-page-box').addClass('on-instant-call-screen');
		$('#step-2').addClass('hidden');
		$('#instantcall-screen').removeClass('hidden');
	},
	
	getTargetCountryScore: function() {
		const self = this;
		const tierOne = ['US', 'CA', 'GB', 'AU'];
		const tierTwo = ['US', 'CA', 'GB', 'IL', 'AU', 'NZ'];
		const hasTargetCountries = self.formSchema.locations.some(result => tierOne.includes(result));
		const hasSecondTierCountries = self.formSchema.locations.some(result => tierTwo.includes(result));

		if (hasTargetCountries) {
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
	
	reportWizardBriefStepDone(eventName) {
		const [category, action] = eventName.split(' ');
		window.mayple_analytics.track(eventName, { category, action });
	},

	initSelections: function() {
		$('.business-type-selection').select2({ placeholder: "Try Entertainment, Clothing, etc.", tags: true });
		$('.country-selection').select2({ placeholder: "Select countries" });
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

	initIntlTel: function() {
		const self = this;
		let phoneInput = document.querySelector("#phone");
		self.intlTel = window.intlTelInput(phoneInput, {
			initialCountry: "auto",
			formatOnDisplay: true,
			hiddenInput: 'fullPhone',
			utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js",
			geoIpLookup: function(success, failure) {
				$.get("https://ipinfo.io?token=1fa95a0e3e5a98", function() {}, "jsonp").always(function(resp) {
					success((resp && resp.country) ? resp.country : "us");
				});
			},
		});

		// $('#phone').keyup(function() {
		// 	briefHench.validatePhone();
		// });
	},

	validatePhone: function() {
		const self = this;

		let iti = self.intlTel;
		if (iti.isValidNumber()) {
			$('#phone').removeClass('empty-field');
			return iti.getNumber();
		} else {
			$('#phone').addClass('empty-field');
			return false;
		}
	},
	
	initSwiper: function() {
		const self = this;
		let swiper = new Swiper(".swiper", {
			autoHeight: true,
			speed: 600,
			loop: true,
			navigation: {
				nextEl: ".brief-pagination-button.next",
				prevEl: ".brief-pagination-button.prev"
			}
		});
	},
	
	handleBackClick: function() {
		$('.back-button').click(function(e) {
			$(window).scrollTop(0);
			$('.brief-page-box').removeClass('on-step-two');
			$('#step-2').addClass('hidden');
			$('#step-1').removeClass('hidden');
			$(".brief-slider-bg.step-two").fadeOut("slow");
			$(".step-two-bg-image").fadeOut("slow");
			$(".brief-slider-box").fadeIn("slow");
			$(".brief-slider-bg.step-one").fadeIn("slow");
		});
	},

	checkUTMParams: function() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());

		let cookie = Cookies.get('_mayple_utm_params');
		if (cookie) {
			let obj = JSON.parse(cookie);

			if (params['utm_source'] && !params['utm_source'].toLowerCase().includes('direct')) {
				$('#howDidYouHearAboutMayple').removeAttr('required');
				$('#source-field').addClass('hidden');
			}

			if (obj['utm_source'] && obj['utm_source'].length > 0) {
				$('#howDidYouHearAboutMayple').removeAttr('required');
				$('#source-field').addClass('hidden');
			}
		}
	},

	initMeeting: function(type) {
		$(window).scrollTop(0);
		
		$('.brief-page-box').addClass('on-step-three');
		$('#step-2').addClass('hidden');

		$('#meeting-step').removeClass('hidden');

		let container = $('#meeting-container');
		let firstname = $('#firstname').val();
		let lastname = $('#lastname').val();
		let email = $('#email').val();
		let company = $('#company').val();

		let template = '';

		if (type === 'long') {
			template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/amir-keren1/discovery-round-robin?embed=true&firstname=${firstname}&lastname=${lastname}&email=${email}&company=${company}"></div>`;

			window.mayple_analytics.track('Lead SalesQualified', { category: 'Lead', action: 'SalesQualified' });
		} else {
			template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/omerfarkash/15-minutes-round-robin-homepage-new-test?embed=true&firstname=${firstname}&lastname=${lastname}&email=${email}"></div>`;
		}

		container.append(template);
		
		$.getScript("https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js").done(function(script, textStatus) {})
	},

	getSelectedCountries: function() {
		const self = this;
		let countryField = $('.country-selection').select2('data');
		countryField.forEach(function(country) {
			if (!self.formSchema['locations'].includes(country)) {
				self.formSchema['locations'].push(country.id);
			}
		});
	},

	getSelectedSkills: function() {
		const self = this;
		$('.channel-selection .w--redirected-checked').each(function(index, el) {
			let selectedSkill = $(this).parent().attr('skill-type');
			if(selectedSkill === 'PAID_ADVERTISING') {
				self.formSchema['serviceTypes'].push('FACEBOOK_ADS');
				self.formSchema['serviceTypes'].push('GOOGLE_ADS');
			} else {
				self.formSchema['serviceTypes'].push(selectedSkill);	
			}
			console.log( 'Skill: ', selectedSkill );
		});
	},

	handleFirstStep: function(number) {
		const self = this;

		// let phoneNumber = '+' + self.intlTel.s.dialCode + $('#phone').val();

		// if (number === 'hasFullNumber') {
		// 	console.log( 'Has phone number' );
		// 	console.log( $('#phone').val() );
		// }

		if (number !== 'hasFullNumber') {
			briefHench.fullPhone = self.validatePhone();
			console.log( 'Phone validation: ', briefHench.fullPhone );
			if (!briefHench.fullPhone) {
				return;
			}
		} else {
			briefHench.fullPhone = $('#phone').val();
		}

		self.updateFormData('#welcome-brief-form_first');

		setTimeout(function() {
			window.mayple_analytics.track('Lead Created', { category: 'Lead', action: 'Created' });
			briefHench.websiteSDK.submitHubspotForm(briefHench.formSchema);
		}, 4800);

		briefHench.toSecondStep();
	},

	updateFormData: function(container) {
		const self = this;
		// console.log( 
		let inputs = $(container + ' input[type=text]');

		inputs.each(function(index) {
			let inputName = $(this).attr('name');
			self.formSchema[inputName] = $(this).val();

			if (inputName === 'estimatedMediaBudget') {
				self.formSchema['estimatedMediaBudget'] = self.budget;
			}
		});

		// self.validatePhone();

		if (container === '#welcome-brief-form_first') {
			self.formSchema['phoneNumber'] = self.fullPhone;
			self.formSchema['emailAddress'] = $('#email').val();
		}
	},

	toSecondStep: function() {
		const self = this;
		$(window).scrollTop(0);
		$('.brief-page-box').addClass('on-step-two');
		$('#step-1').addClass('hidden');
		$('#step-2').removeClass('hidden');
		$(".brief-slider-box").fadeOut("slow");
		$(".brief-slider-bg.step-one").fadeOut("slow");
		$(".brief-slider-bg.step-two").fadeIn("slow");
		$(".step-two-bg-image").fadeIn("slow");
	},

	triggerWebsiteChange: function() {
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
	},

	restructureBudget: function() {
		var rawValue = $('#marketingbudget').val().replace(/,/gi, "");
		if (parseInt(rawValue) > 1000000) {
			rawValue = '1000000';
		}
		var withComma = rawValue.split(/(?=(?:\d{3})+$)/).join(",");
		$('#marketingbudget').val(withComma);
		briefHench.budget = parseInt(rawValue);
	},

	checkWebsiteStatus: function() {
		const self = this;

		if ($('#website').val() === 'nowebsite') {
			$('.website-checkbox .checkbox').addClass('w--redirected-checked');
			$('#nowebsite').prop('checked', true);
			
			self.triggerWebsiteChange();
		}
	},

	checkPredefinedStep: function() {
		if (window.location.hash === '#steptwo') {
			console.log( 'Step two' );
			briefHench.fillCompanyName();
			briefHench.handleFirstStep('hasFullNumber');

			briefHench.checkWebsiteStatus();
			briefHench.restructureBudget();
		}
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
			console.log( 'It is in the range' );
			document.querySelector('.call-preference-box').classList.remove('hidden');
		} else {
			$('.radio-button-holder input').removeAttr('required')
			console.log( 'Time: ', timeInLA );
		}
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

	checkGrowsumoKey: function() {
		const self = this;

		let growsumoKey = Cookies.get('growSumoPartnerKey');
		if (growsumoKey && growsumoKey.length > 0) {
			document.getElementById('partnerKey').value = growsumoKey;
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
			}
		}
	},

	autofillMarketingChannel: function() {
		const self = this;
		let channel = localStorage.getItem('mayple_marketing_channel');
		let matchingChannel = document.querySelector('[skill-type="' + channel + '"]');

		if (matchingChannel && matchingChannel != null) {
			matchingChannel.querySelector('input').checked = true;
			matchingChannel.querySelector('.checkbox').classList.add('w--redirected-checked');
		}
	},
};

$('.brief-input.select').on('change', function(e) { $(this).css("color", "#241815"); });

$(document).ready(function() {
	briefHench.initSDK();
	briefHench.getAutoPopulatedFields();
	briefHench.initIntlTel();
	briefHench.checkGrowsumoKey();
	briefHench.initSwiper();
	briefHench.checkPredefinedStep();
	briefHench.initSelections();
	briefHench.autofillMarketingChannel();
	briefHench.handleBackClick();
	briefHench.checkTimeZone();
	briefHench.checkUTMParams();

	setTimeout(function() {
		console.log( window.mayple_analytics );
		briefHench.reportWizardBriefStepDone('Wizard.Brief Started');
	}, 3600)
});

$('#welcome-brief-form_first').submit(function(event) {
	event.preventDefault();

	briefHench.getWebsiteScore();
	
	briefHench.handleFirstStep('e');

	console.log( 'Form: ', briefHench.formSchema );
	briefHench.websiteSDK.submitHubspotForm(briefHench.formSchema);

	// console.log( $('#fullPhone'), $('#fullPhone').val() );
});

$('#welcome-brief-form_end').submit(function(event) {
	briefHench.updateFormData('#welcome-brief-form_end');
	briefHench.formSchema['industry'][0].industrySubCategory = $('.business-type-selection').select2('data')[0].id;
	briefHench.formSchema['industry'][0].industryCategory = $('.business-type-selection').find(':selected').closest('optgroup').attr('data-category');
 
	briefHench.reportWizardBriefStepDone('Wizard.Brief Finished');
	
	briefHench.getSelectedCountries();
	// briefHench.getConnectionTime();
	briefHench.getSelectedSkills();

	let hsScore = briefHench.websiteSDK.calcSalesQualificationLeadScore(briefHench.formSchema);
	console.log( 'Score: ', hsScore );



	briefHench.getTargetCountryScore();
	briefHench.getIPScore();
	briefHench.getBudgetScore();
	briefHench.calculateScore();

	console.log( 'Form: ', briefHench.formSchema );
	briefHench.websiteSDK.createProjectLead(briefHench.formSchema);
	briefHench.websiteSDK.submitHubspotForm(briefHench.formSchema);
});

$('#marketingbudget').keyup(function(e) {
	briefHench.restructureBudget();
});

$('#website').keyup(function(e) {
	briefHench.fillCompanyName();
});

$('#nowebsite').bind('change', function() {
	briefHench.triggerWebsiteChange();
});

window.addEventListener("message", function(e) {
	if (!e.origin === 'https://meetings.hubspot.com') { return; }
	if (e.data.meetingBookSucceeded) {
		briefHench.reportWizardBriefStepDone('Wizard.Brief.Call Scheduled');
		window.location.href = 'https://mayple.com/thank-you?name=' + briefHench.formSchema['firstName'];
	}
});

// document.getElementById('phone').addEventListener('change', briefHench.validatePhone());
// document.getElementById('phone').addEventListener('keyup', briefHench.validatePhone());
// 
