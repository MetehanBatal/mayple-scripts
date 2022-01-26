let briefHench = {
	// Test commit
	paramsToSearch: [
		'utm_source',
		'utm_medium', 
		'utm_campaign', 
		'utm_content',
		'utm_term',
	],

	countries: [],
	
	skills: [],

	intlTel: '',
	
	budget: 0,
	hasEligibleTarget: false,
	budgetEligible: false,
	hasWebsite: false,
	
	hbID: '9c266462-4b62-4255-bd93-7bbf92103f72',

	insertJSCookie: function() {
		var jsCookie = document.createElement('script');

		jsCookie.setAttribute('src','http://example.com/site.js');

		document.head.appendChild(jsCookie);
	},

	getCookies: function() {
		console.log( 'UTM cookie: ', Cookies.get('_mayple_utm_params') );
	},

	calculateScore: function() {
		const self = this;
		if ( self.hasEligibleTarget && self.budgetEligible && self.hasWebsite ) {
			self.showMeeting();
		} else if ( self.hasEligibleTarget && !self.budgetEligible ) {
			self.showShortMeeting();
		} else {
			self.showNoMatch();
		}
	},

	autofillMarketingChannel: function() {
		const self = this;
		let channel = localStorage.getItem('mayple_marketing_channel');
		let matchingChannel = document.querySelector('[skill-type="' + channel + '"]');
		console.log( 'matchingChannel: ', matchingChannel );
		matchingChannel.querySelector('input').checked = true;
		matchingChannel.querySelector('.checkbox').classList.add('w--redirected-checked');
	},
	
	showMeeting: function() {
		const self = this;
		$(window).scrollTop(0);
		
		$('.brief-page-box').addClass('on-step-three');
		$('#step-2').addClass('hidden');
		$('#meeting-step').removeClass('hidden');
		
		window.mayple_analytics.track('Lead SalesQualified', { category: 'Lead', action: 'SalesQualified' });
	},
	
	showShortMeeting: function() {
		const self = this;
		$(window).scrollTop(0);
		
		$('.brief-page-box').addClass('on-step-three');
		$('#step-2').addClass('hidden');
		$('#meeting-step_short').removeClass('hidden');
	},
	
	showNoMatch: function() {
		const self = this;
		self.initNoMatchSwiper();
		
		$(window).scrollTop(0);
		
		$('#step-2').addClass('hidden');
		$('#nomatch-screen').removeClass('hidden');
		$(".brief-slider-bg.step-two").fadeOut("slow");
		$(".brief-slider-bg.step-three").fadeIn("slow");
		$(".step-two-bg-image").fadeOut("slow");
		$(".no-match-screen-blogs").fadeIn("slow");
		$('.brief-slider-box.blogs').removeAttr('style');
	},
	
	getCountryScore: function() {
		const self = this;
		const tierOne = ['US', 'CA', 'GB', 'AU'];
		const hasTargetCountries = self.countries.some(result => tierOne.includes(result));

		if (hasTargetCountries) {
			self.hasEligibleTarget = true;
		} else {
			self.hasEligibleTarget = false;
		}
	},
	
	getBudgetScore: function() {
		const self = this;
		if (self.budget >= 3000) {
			self.budgetEligible = true;
		} else {
			self.budgetEligible = false;
		}
	},
	
	getWebsiteScore: function() {
		const self = this;
		if ($('#website').val().length > 0) {
			self.hasWebsite = true;
		} else {
			self.hasWebsite = false;
		}
	},
	
	reportWizardBriefStepDone(eventName) {
		const [category, action] = eventName.split(' ');
		window.mayple_analytics.track(eventName, { category, action });
	},
	
	initIndustrySelection: function() {
		$('.business-type-selection').select2({ placeholder: "Try Entertainment, Clothing, etc.", tags: true });
		$('.country-selection').select2({ placeholder: "Select countries" });
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
	
	initNoMatchSwiper: function() {
		const self = this;
		let swiper = new Swiper(".swiper-blogs", {
			autoHeight: true,
			speed: 600,
			loop: true,
			autoplay: { delay: 4800 },
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

	getURLVariables: function() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) { vars[key] = value; }); return vars; },

	getURLParams: function(parameter, defaultValue) {
		const self = this;
		var urlParameter = defaultValue;

		if (window.location.href.indexOf(parameter) > -1) {
			urlParameter = self.getURLVariables()[parameter];
		} 
		return urlParameter;
	},

	searchParams: function() {
		const self = this;
		self.paramsToSearch.forEach(function(param) {
			let utmParam = self.getURLParams(param, '');
			if (param === 'utm_source' && utmParam.length > 0) {
				$('#source-field').addClass('hidden');
			}
			if (utmParam.length > 0) {
				document.getElementById(param).value = utmParam;
			}
		});
	},
	
	updateBackLink: function() {
		const url = window.location.pathname;
		const queryString = url.split("?");
		let link = document.querySelector('.home-link');
	},

	initIntlTel: function() {
		const self = this;
		let phoneInput = document.querySelector("#phone");
		self.intlTel = window.intlTelInput(phoneInput, {
			initialCountry: "auto",
			utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js",
			geoIpLookup: function(success, failure) {
				$.get("https://ipinfo.io?token=1fa95a0e3e5a98", function() {}, "jsonp").always(function(resp) {
					success((resp && resp.country) ? resp.country : "us");
				});
			},
		});
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

	initMeeting: function() {
		let container = $('#meeting-container');
		let shortMeetingContainer = $('#meeting-container_short');
		let firstname = $('#firstname').val();
		let lastname = $('#lastname').val();
		let email = $('#email').val();
		let company = $('#company').val();
		let template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/amir-keren1/discovery-round-robin?embed=true&firstname=${firstname}&lastname=${lastname}&email=${email}&company=${company}"></div>`;
		let shortMeetingTemplate = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/omerfarkash/15-minutes-round-robin-homepage-new-test?embed=true&firstname=${firstname}&lastname=${lastname}&email=${email}"></div>`;
		container.append(template);
		shortMeetingContainer.append(shortMeetingTemplate);
		$.getScript("https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js").done(function(script, textStatus) {})
	},
	getSelectedCountries: function() {
		const self = this;
		let countryField = $('.country-selection').select2('data');
		countryField.forEach(function(country) { self.countries.push(country.id); });
	},
	// getSelectedBusinessModels: function() {
	// 	const self = this;
	// 	$('.business-model-selection .w--redirected-checked').each(function(index, el) {
	// 		let selectedBusinessModel = $(this).parent().attr('business-type');
	// 		self.businessModels.push(selectedBusinessModel);
	// 	});
	// },
	getSelectedSkills: function() {
		const self = this;
		$('.channel-selection .w--redirected-checked').each(function(index, el) {
			let selectedSkill = $(this).parent().attr('skill-type');
			self.skills.push(selectedSkill);
		});
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

	handleFirstStep: function(number) {
		const self = this;

		let phoneNumber = '+' + self.intlTel.s.dialCode + $('#phone').val();
		if (number === 'hasFullNumber') {
			phoneNumber = $('#phone').val();
		}

		// if (!briefHench.intlTel.isValidNumber() && briefHench.intlTel.getValidationError() === 4) {
		// 	console.log( 'Is valid' );
		// } else {
		// 	console.log( 'Error: ',  );
		// }

		let formData = {
			lp_traffic_source: $('#lp_traffic_source').val(),
			traffic_source: 'short_welcome_brief',

			firstname: $('#firstname').val(),
			lastname: $('#lastname').val(),
			phone: phoneNumber,
			email: $('#email').val(),

			how_did_you_hear_about_mayple: $('#source').val(),

			utm_source: $('#utm_source').val(),
			utm_medium: $('#utm_medium').val(),
			utm_campaign: $('#utm_campaign').val(),
			utm_content: $('#utm_content').val(),
			utm_term: $('#utm_term').val()
		};

		hubspotFormSubmit('4292856', briefHench.hbID, formData)
			.then(function(sent) {
				if (sent) {
					briefHench.reportWizardBriefStepDone('Wizard.Brief Started');
					window.mayple_analytics.track('Lead Created', { category: 'Lead', action: 'Created' });
				}
			})
			.catch(function(err) {
				console.log( 'Error: ', err )
			});

		briefHench.toSecondStep();
	},

	checkPredefinedStep: function() {
		if (window.location.hash === '#steptwo') {
			briefHench.handleFirstStep('hasFullNumber');
		}
	}
};
$('.brief-input.select').on('change', function(e) { $(this).css("color", "#241815"); });
$(document).ready(function() {
	briefHench.getCookies();
	briefHench.getAutoPopulatedFields();
	briefHench.initIntlTel();
	briefHench.initSwiper();
	briefHench.checkPredefinedStep();
	briefHench.searchParams();
	briefHench.updateBackLink();
	briefHench.initIndustrySelection();
	briefHench.autofillMarketingChannel();
	briefHench.handleBackClick();
});
$('#welcome-brief-form_first').submit(function(event) {
	event.preventDefault();
	
	briefHench.handleFirstStep('e');
});

$('#welcome-brief-form_nomatch').submit(function(event) {
	event.preventDefault();
	let formData = { email: $('#email').val(), requires_help_from_partner: $('#welcome-brief-form_nomatch .w--redirected-checked').next().attr('value') };
	console.log( 'Form: ', formData );
	hubspotFormSubmit('4292856', briefHench.hbID, formData).then(function(sent) { if (sent) { console.log('sent form: ', sent)} }).catch(function(err) {}) });

$('#welcome-brief-form_end').submit(function(event) {
	// let b = $('.business-model-selection :checkbox:checked').length;
	// let bC = $('.business-model-selection');
	let c = $('.channel-selection :checkbox:checked').length;
	let cC = $('.channel-selection');
	if (!c > 0) { cC.addClass('error'); return; } else { cC.removeClass('error') } event.preventDefault();
	briefHench.getSelectedCountries();
	// briefHench.getSelectedBusinessModels();
	briefHench.getSelectedSkills();
	briefHench.getCountryScore();
	briefHench.getBudgetScore();
	briefHench.getWebsiteScore();
	briefHench.calculateScore();
	briefHench.initMeeting();
	let formData = { hs_persona: 'persona_1', email: $('#email').val(), website: $('#website').val(), company: $('#company').val(), mayple_industry: $('.business-type-selection').select2('data')[0].id, countries: briefHench.countries, skills: briefHench.skills, marketing_budget_from_basic_brief_in_usd: briefHench.budget };
	hubspotFormSubmit('4292856', briefHench.hbID, formData).then(function(sent) { if (sent) { briefHench.reportWizardBriefStepDone('Wizard.Brief Finished'); } }).catch(function(err) {})
});

$('#marketingbudget').keyup(function(e) {
	var rawValue = $(this).val().replace(/,/gi, "");
	var withComma = rawValue.split(/(?=(?:\d{3})+$)/).join(",");
	$(this).val(withComma);
	briefHench.budget = parseInt(rawValue);
});

$('#company').keyup(function(e) { $(this).addClass('no-autofill'); });

$('#website').keyup(function(e) { if ($('#company').hasClass('no-autofill')) { return; } let value = $(this).val(); let valueSplit = value.split("."); let companyName = ''; if (valueSplit[0].startsWith('http') || valueSplit[0].startsWith('www') || valueSplit[0].includes(':')) { companyName = valueSplit[1]; } else { companyName = valueSplit[0]; } if (value.length > 3) { $('#company').val(companyName) } });

$('#nowebsite').bind('change', function() {
	if ($(this).is(':checked')) {
		$('#website').prop('readonly', true);
		$('#website').prop('required', false);
		$('#website').addClass('not-editable');
		$('#website').val('');
		briefHench.hasWebsite = false;
	} else {
		$('#website').prop('readonly', false);
		$('#website').prop('required', true);
		$('#website').removeClass('not-editable');
	}
});

window.addEventListener("message", function(e) {
	if (!e.origin === 'https://meetings.hubspot.com') { return; }
	if (e.data.meetingBookSucceeded) {
		briefHench.reportWizardBriefStepDone('Wizard.Brief.Call Scheduled');
		hubspotFormSubmit('4292856', '9c266462-4b62-4255-bd93-7bbf92103f72', { email: $('#email').val(), did_schedule_a_sales_call: true }).then(function(sent) { console.log(sent) })
	}
});