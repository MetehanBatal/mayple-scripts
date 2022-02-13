let briefHench = {
	// Test commit
	paramsToSearch: [
		'utm_source',
		'utm_medium', 
		'utm_campaign', 
		'utm_content',
		'utm_term',
	],

	ipCountry: '',
	countries: [],
	
	skills: [],

	intlTel: '',
	
	score: 0,

	budget: 0,
	hasEligibleTarget: false,
	budgetEligible: false,
	instantCall: 'no',
	
	hbID: '9c266462-4b62-4255-bd93-7bbf92103f72',

	insertJSCookie: function() {
		var jsCookie = document.createElement('script');

		jsCookie.setAttribute('src','http://example.com/site.js');

		document.head.appendChild(jsCookie);
	},

	getCookies: function() {
		const self = this;

		let utmCookie = Cookies.get('_mayple_utm_params');
		
		if (utmCookie) {
			utmCookie = JSON.parse(utmCookie);
		
			self.paramsToSearch.forEach(function(param) {
				if (utmCookie[param] && utmCookie[param].length > 0) {
					document.getElementById(param).value = utmCookie[param];
				}
			});
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

	calculateScore: function() {
		const self = this;
		console.log( 'Score: ', self.score );
		if ( self.score > 3 ) {
			if ( self.instantCall === 'yes' ) {
				self.showInstantCall();
			} else {
				self.showMeeting();
			}
		} else {
			if ( self.instantCall === 'yes' ) {
				self.showInstantCall();
			} else {
				self.showShortMeeting();
			}
		}
		// else if ( 0 > self.score ) {
		// 	self.showNoMatch();
		// }
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

	showInstantCall: function() {
		const self = this;
		$(window).scrollTop(0);
		
		$('.brief-page-box').addClass('on-instant-call-screen');
		$('#step-2').addClass('hidden');
		$('#instantcall-screen').removeClass('hidden');

		let formData = { email: $('#email').val(), requested_an_instant_call: self.instantCall };
		console.log( 'Form: ', formData );
		hubspotFormSubmit('4292856', briefHench.hbID, formData).then(function(sent) { if (sent) { console.log('sent form: ', sent)} }).catch(function(err) {})
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
		const tierTwo = ['US', 'CA', 'GB', 'IL', 'AU', 'NZ'];
		const hasTargetCountries = self.countries.some(result => tierOne.includes(result));
		const hasSecondTierCountries = self.countries.some(result => tierTwo.includes(result));

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
		const hasIPCountry = tierOne.includes(self.ipCountry);
		const hasSecondTierCountry = tierTwo.includes(self.ipCountry);

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
	
	reportWizardBriefStepDone(eventName) {
		const [category, action] = eventName.split(' ');
		window.mayple_analytics.track(eventName, { category, action });
	},

	getCookie( cookieName ) {
		const value = `; ${document.cookie}`;
  		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	},

	checkGrowsumoKey: function() {
		const self = this;

		let growsumoKey = Cookies.get('growSumoPartnerKey');
		if (growsumoKey && growsumoKey.length > 0) {
			document.getElementById('partnerKey').value = growsumoKey;
		}
		// if (self)
	},

	registerLeadToGrowsumo(firstname, lastname, email, partnerKey) {
		const self = this;

		let name = firstname + lastname;
		growsumo.data.name = name;
		growsumo.data.email = email;
		growsumo.data.partnerKey = partnerKey;
		// let partnerKey = self.getCookie('growSumoPartnerKey');
		console.log( 'Growsumo: ', growsumo );

		growsumo.createSignup(function() {
            console.log("Create signup called successfully");
        });
	},
	
	initIndustrySelection: function() {
		$('.business-type-selection').select2({ placeholder: "Try Entertainment, Clothing, etc.", tags: true });
		$('.country-selection').select2({ placeholder: "Select countries" });
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
					self.ipCountry = resp.country;
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
			console.log( 'Has phone number' );
			phoneNumber = $('#phone').val();
		}

		// if (!briefHench.intlTel.isValidNumber() && briefHench.intlTel.getValidationError() === 4) {
		// 	console.log( 'Is valid' );
		// } else {
		// 	console.log( 'Error: ',  );
		// }

		let formData = {
			hs_persona: 'persona_1',
			
			lp_traffic_source: $('#lp_traffic_source').val(),
			traffic_source: 'short_welcome_brief',
			partnerstack_referral_key: $('#partnerKey').val(),

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
					console.log( 'HS sent' );
					briefHench.reportWizardBriefStepDone('Wizard.Brief Started');
					window.mayple_analytics.track('Lead Created', { category: 'Lead', action: 'Created' });
					//briefHench.registerLeadToGrowsumo(formData.firstname, formData.lastname, formData.email, formData.partnerstack_referral_key);
				}
			})
			.catch(function(err) {
				console.log( 'Error: ', err )
			});

		briefHench.toSecondStep();
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
			briefHench.handleFirstStep('hasFullNumber');

			briefHench.checkWebsiteStatus();
			briefHench.restructureBudget();
			briefHench.fillCompanyName();
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
	}
};
$('.brief-input.select').on('change', function(e) { $(this).css("color", "#241815"); });
$(document).ready(function() {
	briefHench.getCookies();
	briefHench.checkGrowsumoKey();
	briefHench.getAutoPopulatedFields();
	briefHench.initIntlTel();
	briefHench.initSwiper();
	briefHench.checkPredefinedStep();
	briefHench.searchParams();
	briefHench.updateBackLink();
	briefHench.initIndustrySelection();
	briefHench.autofillMarketingChannel();
	briefHench.handleBackClick();
	briefHench.checkTimeZone();
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
	briefHench.getConnectionTime();
	// briefHench.getSelectedBusinessModels();
	briefHench.getSelectedSkills();
	briefHench.getCountryScore();
	briefHench.getIPScore();
	briefHench.getBudgetScore();
	briefHench.getWebsiteScore();
	briefHench.calculateScore();
	briefHench.initMeeting();
	let formData = { email: $('#email').val(), website: $('#website').val(), company: $('#company').val(), mayple_industry: $('.business-type-selection').select2('data')[0].id, countries: briefHench.countries, skills: briefHench.skills, marketing_budget_from_basic_brief_in_usd: briefHench.budget };
	hubspotFormSubmit('4292856', briefHench.hbID, formData).then(function(sent) { if (sent) { briefHench.reportWizardBriefStepDone('Wizard.Brief Finished'); } }).catch(function(err) {})
});

$('#marketingbudget').keyup(function(e) {
	briefHench.restructureBudget();
});

$('#company').keyup(function(e) { $(this).addClass('no-autofill'); });

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
		hubspotFormSubmit('4292856', '9c266462-4b62-4255-bd93-7bbf92103f72', { email: $('#email').val(), did_schedule_a_sales_call: true }).then(function(sent) { console.log(sent) })
	}
});