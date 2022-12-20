import { isMinLength } from './common/validations';

let formSchema = {
	firstName: '',
	lastName: '',
	phoneNumber: '',
	emailAddress: '',
	howDidYouHearAboutMayple: '',

	websiteAddress: '',
	companyName: '',

	industry: [{
		industryCategory: '',
		industrySubCategory: ''
	}],

	locations: [
		'US'
	],

	productBusinessModel: [],

	estimatedMediaBudget: 0,
	frontendSalesQualificationScore: 0,

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

	trafficSource: 'brief-stepped',
	lpTrafficSource: '',
	partnerStackReferralKey: '',
	requestedAnInstantCall: 'no'
}

const validationRules = {
	// Inner Object Names (e.g. firstName) Must Match with the Input's "name" Attribute
	//
	leadForm: {
		dependencies: [],
		inputs: {
			fullName: {
				validate: function(val) {
					return isMinLength(val);
				},
				errorLog: 'Please fill the name field'
			},
			lastName: {
				validate: function(val) {
					return isMinLength(val);
				},
				errorLog: 'Please fill the last name field'
			},
			emailAddress: {
				validate: function(val) {
					return isMinLength(val) &&
								 String(val)
									 .toLowerCase()
									 .match(
										 /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
									 );
				},
				errorLog: 'Please fill the email address'
			},
			phoneNumber: {
				validate: function(val) {
					return briefHench.validatePhone(val);
				},
				errorLog: 'Please fill the phone number field'
			},
			websiteAddress: {
				validate: function(val) {
					const self = this;

					let url;

					try {
						url = new URL(val);
					} catch (_) {
						return false;
					}

					// if (url.includes(briefHench.bannedURLs)) {
					// 	return false; }

					return url.protocol === "http:" || url.protocol === "https:";
				},
				errorLog: "Hmm, this doesn't look a valid website address."
			},
			companyName: {
				validate: function(val) {
					if (val.length < 2) {
						return false; }
					else { return true; }
				}
			},
		},
		eventReporting: function() {
			const budgetTraits = {
				label: (formSchema['estimatedMediaBudget'] || 'N/A').toString(), // Save as string
				estimatedMediaBudget: formSchema['estimatedMediaBudget'], // Save as int
			};

			briefHench.websiteSDK.reportEvent('Wizard.Brief.MonthlyMediaBudget StepDone', budgetTraits);
		}
	},
	budgetSelection: {
		dependencies: [],
		inputs: {
			estimatedMediaBudget: {
				validate: function() {
					const val = formSchema.estimatedMediaBudget;
					if (typeof(val) !== 'number' || val.length < 2 || val < 1) {
						return false;
					} else { return true; }
				},
				errorLog: 'Please fill in your marketing budget.'
			}
		},
		eventReporting: function() {
			const budgetTraits = {
				label: (formSchema['estimatedMediaBudget'] || 'N/A').toString(), // Save as string
				estimatedMediaBudget: formSchema['estimatedMediaBudget'], // Save as int
			};

			briefHench.websiteSDK.reportEvent('Wizard.Brief.MonthlyMediaBudget StepDone', budgetTraits);
		}
	},
	industrySelection: {
		dependencies: [
			'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js'
		],
		inputs: {
			industry: {
				set: function() {
					$('.business-type-selection').select2({ placeholder: "Try Entertainment, Clothing, etc." });
				},
				validate: function(val) {
					if (val.length < 1) {
						return false; }
					else { return true; }
				}
			}
		},
		eventReporting: function() {
			let subCategory = formSchema['industry'][0].industrySubCategory;
			let category = formSchema['industry'][0].industryCategory;
			const industryTraits = {
				label: subCategory,
				industryCategory: category,
				industrySubCategory: subCategory
			};

			briefHench.websiteSDK.reportEvent('Wizard.Brief.Industry StepDone', industryTraits);
		}
	},
	skillsSelection: {
		dependencies: [],
		inputs: {
			skill: {
				validate: function(val) {
					if (val.length < 1) {
						return false; }
					else { return true; }
				}
			}
		},
		eventReporting: function() {
			let skills = briefHench.selectedSkills;
			const skillsSorted = skills ? skills.map((skill) => skill).sort() : null;
			const skillTraits = {
				label: skills ? skillsSorted : null,
				skills: skills ? skillsSorted : '',
			};
			briefHench.websiteSDK.reportEvent('Wizard.Brief.MarketingSkills StepDone', skillTraits);
		}
	}
}

let briefHench = {
	currentStep: 0,

	selectedSkills: [],

	ipLocation: '',

	bannedURLs: [
		"idk",
		"mayple",
		"dontknow",
		"website",
		"unsure",
		"nothing",
		"tbd"
	],

	checkPagePath: function(query) {
		let pagePath = window.location.pathname;

		return pagePath.includes(query);
	},

	insertSDK: function() {
		const self = this;
		const WebsiteSDK = window.WebsiteSDK.default;
		self.websiteSDK = new WebsiteSDK();

		console.log('SDK: ', self.websiteSDK);
	},

	handleStepChange: function() {
		const self = this;

		const nextButton = $('.brief-next-button');
		const backButton = $('.brief-back-button');

		nextButton.click(function(e) {
			self.toNextStep();
		});
		backButton.click(function(e) {
			self.toPreviousStep();
		});
	},

	toNextStep: function() {
		const self = this;
 
		// Reveal back/next buttons, if they are not already visible
		//
		$('.pagination-buttons').removeClass('hidden');

		// $('.brief-next-button').addClass('disabled');

		let currentContainer = $('.brief-form-v2.active form').attr('data-name');

		// Run validations for each of the fields inside the current container
		//
		let isValid = self.checkErrors(currentContainer);

		if(!isValid) {
			console.log( 'There is an issue' );
			$('.w-form-fail').css('display', 'block');
			$('.brief-next-button').addClass('disabled');
			return;
		}

		// If the validation passes;
		// reveal buttons
		$('.brief-back-button').removeClass('hidden');
		$('.brief-next-button').addClass('hidden');
		$('.brief-form-v2.active .brief-next-button').removeClass('disabled');
		$('.w-form-fail').css('display', 'none');


		// get current step index
		let currentStep = $('.brief-form-v2.active').index();
		// If it's the last step,
		// submit the form to Hubspot
		if (currentStep ===  $('.brief-form-v2').length - 1) {
			self.submitForm();

			self.websiteSDK.reportEvent('Wizard.Brief Finished', { category: 'Wizard.Brief', action: 'Finished' });
			
			self.toggleMeeting();
			// self.toggleAnimation();
			return;
		}
		if (self.checkPagePath('welcome-brief-stepped-2') && self.currentStep === 0) {
			self.submitForm(); }

		currentStep++;
		self.currentStep = currentStep;

		$('.brief-title-block').addClass('hidden');
		$(`.brief-title-block[step=${currentStep}]`).removeClass('hidden');

		$(`.brief-next-button[data-step="${currentStep}"`).removeClass('hidden');

		if (currentStep ===  $('.brief-form-v2').length - 1) {
			$('.brief-next-button p').html('SUBMIT');
			$('.brief-next-button').addClass('submittable');
		}

		$('.brief-form-v2').removeClass('active');
		$('.brief-form-v2').eq(currentStep).addClass('active');

		let nextContainer = $('.brief-form-v2.active form').attr('data-name');

		// Get scripts/external libraries for the next step
		//
		self.setDependencies(nextContainer);

		// Send reporting for the current/finished step
		//
		validationRules[currentContainer].eventReporting();
	},

	toggleMeeting: function() {
		$('.form-section').addClass('hidden');
		$('#meeting-container').removeClass('hidden');
		$('.meeting-opener').addClass('hidden');

		$('.brief-title-block').addClass('hidden');
		$(`.brief-title-block[step='4']`).removeClass('hidden');

		let container = $('#meeting-container');

		let template = '';

		if (formSchema['frontendSalesQualificationScore'] > 3) {
			// Implement long-duration meeting aka SQL form
			// 
			template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/amir-keren1/discovery-round-robin?embed=true&firstname=${formSchema['firstName']}&lastname=${formSchema['lastName']}&email=${formSchema['emailAddress']}&company=${formSchema['companyName']}"></div>`;

			briefHench.websiteSDK.reportEvent('Lead SalesQualified', { category: 'Lead', action: 'SalesQualified' });
		} else if (  formSchema['frontendSalesQualificationScore'] === 0 || formSchema['frontendSalesQualificationScore'] === 1 || formSchema['frontendSalesQualificationScore'] === 2 ) {
			template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/omerfarkash/15-minutes-round-robin-homepage-new-test?embed=true&firstname=${formSchema['firstName']}&lastname=${formSchema['lastName']}&email=${formSchema['emailAddress']}&company=${formSchema['companyName']}"></div>`;
		} else if ( formSchema['frontendSalesQualificationScore'] < 0 ) {
			// Redirect users to app
			// 
			window.location.href = 'https://app.mayple.com/login?register=1';
		} else {
			// Implement short-duration meeting aka MQL form
			// 
			template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/amir-keren1/sales-team-round-robin?embed=true&firstname=${formSchema['firstName']}&lastname=${formSchema['lastName']}&email=${formSchema['emailAddress']}&phone=${formSchema['phoneNumber']}"></div>`;
		}

		container.append(template);

		$.getScript("https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js").done(function(script, textStatus) {})

		if (briefHench.ipLocation === 'US' || briefHench.ipLocation === 'IL' || briefHench.ipLocation === 'CA' || briefHench.ipLocation === 'AU' || briefHench.ipLocation === 'UK') {
			jumbleberry("init", "KEWhitJ3HkFzJVXVBya6QsnMjgNhEPutkYqGmbvwm4RyH8vEoGD7vBo9PxR9Y_rbBhwOuAyhgJkHB0ASesVGLg~~");
			jumbleberry("track", "Purchase", { transaction_id: `${formSchema['emailAddress']}`, order_value: 30 });
		}
	}

	setDependencies: function(container) {
		const self = this;

		let dependencies = validationRules[container]['dependencies'];

		if (dependencies.length > 0) {
			dependencies.forEach(function(dependency, index, list) {
				jQuery.ajax({
					url: dependency,
					cache: true
				}).done(function() {
					console.log(dependency, " loaded!");
					if (index === list.length - 1) {
						self.revealNextContainer();
					}
				});
			});

			let inputs = validationRules[container]['inputs'];
			for (let input in inputs) {
				inputs[input].set();
			}
		} else {
			self.revealNextContainer();
		}
		// inputs.forEach(function(input) {
		// 	console.log( 'Input: ', input );
		// });
	},

	toPreviousStep: function() {
		const self = this;

		$('.brief-next-button p').html('NEXT');
		$('.brief-next-button').removeClass('submittable');

		// get current step index
		let currentStep = $('.brief-form-v2.active').index();
		// If it's the first step,
		// there shouldn't be any back buttons
		if (currentStep ===  1) {
			$('.back-button').addClass('hidden'); }
		if (currentStep === 0) {
			return; }
		if (currentStep === 1 && $('.brief-form-v2.active form').attr('data-name') === 'leadForm') {
			$('.next-button').addClass('hidden') };
		currentStep--;
		self.currentStep = currentStep;

		$('.brief-form-v2').removeClass('active');
		$('.brief-form-v2').eq(currentStep).addClass('active');
		$('.brief-title-block').addClass('hidden');
		$(`.brief-title-block[step=${currentStep}]`).removeClass('hidden');

		$('.brief-error').css('display', 'none');
		$('.brief-form-v2.active .brief-next-button').removeClass('disabled');

		self.revealNextContainer();
	},

	revealNextContainer: function() {
		$('.brief-form-v2').addClass('hidden');
		$('.brief-form-v2.active').removeClass('hidden');
	},

	checkErrors: function(container) {
		// Remove previous error states
		//
		$('.error-message').addClass('hidden');

		let isClean = true;

		if (container === 'industrySelection') {
			formSchema['industry'][0].industrySubCategory = $('.business-type-selection').select2('data')[0].id;
			formSchema['industry'][0].industryCategory = $('.business-type-selection').find(':selected').closest('optgroup').attr('data-category');

			if (formSchema['industry'][0].industrySubCategory.length < 1 || formSchema['industry'][0].industryCategory == 'undefined' || !formSchema['industry'][0].industryCategory) {
				isClean = false;
				$('.select2-selection--single').addClass('empty-field');
				return false;
			} else {
				isClean = true;
			}

			return isClean;
		};

		if (container === 'budgetSelection') {
			if ($('#marketingbudget').val().length < 1) {
				$('#marketingbudget').addClass('empty-field');
				isClean = false;
				return false;
			}
		}

		let fields = $('.brief-form-v2.active input').filter('[required]');

		fields.each(function(item) {
			if ($(this).attr('type') === 'checkbox') {
				let field = $(this).attr('name');
				let checked = $(`input[name="${field}"]:checked`);
				formSchema['serviceTypes'] = [];
				briefHench['selectedSkills'] = [];

				checked.each(function(index, selectedCheckbox) {
					let selectedSkill = $(selectedCheckbox).parent().attr('skill-type');

					if(selectedSkill === 'PAID_ADVERTISING') {
						formSchema['serviceTypes'].push('FACEBOOK_ADS');
						formSchema['serviceTypes'].push('GOOGLE_ADS');
					} else {
						formSchema['serviceTypes'].push(selectedSkill);
					}
					briefHench.selectedSkills.push( $(selectedCheckbox).siblings('.service-checkbox-label').html() );
				});
			} else {
				$(this).removeClass('empty-field');

				let field = $(this).attr('name');
				let isValid = validationRules[container]['inputs'][field].validate($(this).val());

				if (!isValid || isValid == null) {
					console.warn( 'Not valid: ', field );
					$(this).addClass('empty-field');

					$('.brief-error div').text(validationRules[container]['inputs'][field].errorLog);
					$('.error-message').removeClass('hidden');
					isClean = false;

					return false;
				} else {
					if (field !== 'estimatedMediaBudget' || field !== 'fullname') {
						formSchema[field] = $(this).val();
					}

					if (field === 'phoneNumber') {
						formSchema[field] = isValid;
					}
				}
			}
		});

		if (container === 'skillsSelection') {
			console.log('length: ', formSchema['serviceTypes'].length);
			if (formSchema['serviceTypes'].length < 1) {
				isClean = false;
				console.log('Is clean: ', isClean);

				return false;
			}
		}

		return isClean;
	},

	submitForm: function() {
		const self = this;

		self.setServices();

		formSchema['frontendSalesQualificationScore'] = self.websiteSDK.calcSalesQualificationLeadScore(formSchema);

		self.websiteSDK.createProjectLead(formSchema);
		self.websiteSDK.submitHubspotForm(formSchema);

		self.websiteSDK.reportEvent('Lead Created', { category: 'Lead', action: 'Created' });

		ttq.track('CompletePayment');

		// self.websiteSDK.reportEvent('Wizard.Brief.Industry StepDone', industryTraits);
	},

	toggleAnimation: function() {
		$('.lottie-animation-holder').removeClass('hidden');
		
		setTimeout(function() {
			window.location.href = `https://app.mayple.com/login?email=${formSchema['emailAddress']}&register=1&asCompany=1`
		}, 1200);
	},

	toggleMeetingForm: function() {
		const trigger = $('.meeting-opener');
		const closer = $('.close-meeting-container');

		trigger.click(function(e) {
			$('.meeting-form-container').removeClass('hidden');
		});
		closer.click(function(e) {
			$('.meeting-form-container').addClass('hidden');
		});

		// $('.brief-stepped-form').addClass('hidden');
		// $('.meeting-step').removeClass('hidden');
		// $('.pagination-buttons').addClass('hidden');

		// let container = $('#meeting-container');

		// let template = '';

		// if (formSchema['frontendSalesQualificationScore'] > 3) {
		// 	// Implement long-duration meeting aka SQL form
		// 	// 
		// 	template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/amir-keren1/discovery-round-robin?embed=true&firstname=${formSchema['firstName']}&lastname=${formSchema['lastName']}&email=${formSchema['emailAddress']}&company=${formSchema['companyName']}"></div>`;

		// 	briefHench.websiteSDK.reportEvent('Lead SalesQualified', { category: 'Lead', action: 'SalesQualified' });
		// } else if (  formSchema['frontendSalesQualificationScore'] === 0 || formSchema['frontendSalesQualificationScore'] === 1 || formSchema['frontendSalesQualificationScore'] === 2 ) {
		// 	template = `>`;
		// } else if ( formSchema['frontendSalesQualificationScore'] < 0 ) {
		// 	// Redirect users to app
		// 	// 
		// 	window.location.href = 'https://app.mayple.com/login?register=1';
		// } else {
		// 	// Implement short-duration meeting aka MQL form
		// 	// 
		// 	template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/amir-keren1/sales-team-round-robin?embed=true&firstname=${formSchema['firstName']}&lastname=${formSchema['lastName']}&email=${formSchema['emailAddress']}&phone=${formSchema['phoneNumber']}"></div>`;
		// }

		// container.append(template);

		

		// if (briefHench.ipLocation === 'US' || briefHench.ipLocation === 'IL' || briefHench.ipLocation === 'CA' || briefHench.ipLocation === 'AU' || briefHench.ipLocation === 'UK') {
		// 	jumbleberry("init", "KEWhitJ3HkFzJVXVBya6QsnMjgNhEPutkYqGmbvwm4RyH8vEoGD7vBo9PxR9Y_rbBhwOuAyhgJkHB0ASesVGLg~~");
		// 	jumbleberry("track", "Purchase", { transaction_id: `${formSchema['emailAddress']}`, order_value: 30 });
		// }
	},

	validatePhone: function(val) {
		const self = this;

		let iti = self.intlTel;
		if (iti.isValidNumber()) {
			return iti.getNumber(intlTelInputUtils.numberFormat.E164); }
		else { return false; }
	},

	initIntlTel: function() {
		const self = this;
		let phoneInput = document.getElementById("phoneNumber");
		self.intlTel = window.intlTelInput(phoneInput, {
			initialCountry: "auto",
			utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js",
			geoIpLookup: function(success, failure) {
				$.get("https://ipinfo.io?token=1fa95a0e3e5a98", function() {}, "jsonp").always(function(resp) { briefHench.ipLocation = resp.country; success((resp && resp.country) ? resp.country : "us"); });
			},
		});
	},

	restructureBudget: function() {
		var rawValue = $('#marketingbudget').val().replace(",", "");
		if (parseInt(rawValue) > 1000000) {
			rawValue = '1000000';
		}
		var withComma = rawValue.split(/(?=(?:\d{3})+$)/).join(",");
		$('#marketingbudget').val(withComma);

		rawValue = parseInt(rawValue);
		formSchema.estimatedMediaBudget = rawValue;
	},

	fillCompanyName: function() {
		let value = $('#website').val();

		if (value.length > 5) {
			let companyName = '';
			// construct the value as a URL
			let hostname = new URL(value).hostname;
			// if we have the www. at the start; trim it e.g. www.website-name.com.au => website-name.com.au
			if (hostname.startsWith('www.')) {
				hostname = hostname.replace('www.', '');
			}
			// turn the value into an array splitted by dots e.g. website-name.com.au => [website-name], [com], [au]
			let valueSplit = hostname.split(".");
			// Get the first of the array which is [website-name]
			companyName = valueSplit[0];
			$('#company').val(companyName);
		}
	},

	splitName: function() {
		let fullName = $('#fullname').val();

		let firstName = fullName.substring(0, fullName.lastIndexOf(" ") + 1);
		let lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.length);

		formSchema['firstName'] = firstName;
		formSchema['lastName'] = lastName;
	},

	fillTrafficSource: function() {
		let pagePath = window.location.pathname;

		if (pagePath.startsWith('/lp')) {
			formSchema['lpTrafficSource'] = pagePath;
		}
		if (pagePath.startsWith('/welcome-v4')) {
			formSchema['trafficSource'] = 'v4_stepped';
		}
	},

	setServices: function() {
		let pagePath = window.location.pathname;
		// Since there is no option to select service on below pages
		// let's manually populate them
		if (pagePath.startsWith('/lp/facebook-ads') || pagePath.startsWith('/lp/ppc-agency')) {
			formSchema['serviceTypes'] = ['FACEBOOK_ADS', 'GOOGLE_ADS'];
		}
		if (pagePath.startsWith('/lp/search-engine-marketing')) {
			formSchema['serviceTypes'] = ['SEARCH_ENGINE_OPTIMIZATION'];
		}
		if (pagePath.startsWith('/lp/social-media')) {
			formSchema['serviceTypes'] = ['SOCIAL_MEDIA_MANAGEMENT'];
		}
	},

	handleSelection: function() {
		// const checkboxes = document.querySelectorAll('.service-selection-checkbox');
		$('input[name="skills"]').change(function() {
			$(this).parent('.service-selection-checkbox').toggleClass('selected');
			$('.brief-next-button.first').removeClass('disabled');
		});
		// checkboxes.forEach(function(checkbox) {
		// 	checkbox.addEventListener('click', function(e) {
		// 		e.target.classList.toggle('selected');
		// 		$('.brief-next-button.first').removeClass('disabled');
		// 	});
		// });
	},

	prefillEmail: function() {
		if (localStorage.getItem('mailAddress') && localStorage.getItem('mailAddress').length > 0) {
			let mailAddress = localStorage.getItem('mailAddress');
			$('#email').val(mailAddress);
		}
	}
}


$(document).ready(function(e) {
	briefHench.insertSDK();
	briefHench.handleStepChange();
	briefHench.initIntlTel();
	briefHench.handleSelection();
	briefHench.toggleMeetingForm();
	briefHench.prefillEmail();

	// $('.submittable').click(function(e) {
	// 	briefHench.submitForm();
	// });

	formSchema['trafficSource'] = 'v5_stepped';
});



$('#marketingbudget').keyup(function(e) {
	let lastChar = $('#marketingbudget').val().slice(-1);

	if (isNaN(lastChar) || parseInt(e.originalEvent.keyCode) === 32) {
		let value = $('#marketingbudget').val().slice(0, -1);
		$('#marketingbudget').val(value);
		return;
	}

	briefHench.restructureBudget();
});

$('#website').keyup(function(e) {
	if (e.originalEvent.keyCode == 32) {
		$(this).val( $(this).val().slice(0, -1) ) }

	// If user didn't write down the protocal name...
	if ($(this).val().length > 5 && !$(this).val().startsWith('http')) {
		// add it programatically as the URL object is not validating the string without the https:// prefix
		$(this).val('https://' + $(this).val());
	} else if ($(this).val().startsWith('http://')) {
		// turn http to https
		$(this).val($(this).val().replace('http://', 'https://'));
	}

	if ($('.brief-next-button').hasClass('disabled')) {
		$('.brief-error').css('display', 'none');
		$('.brief-form-v2.active .brief-next-button').removeClass('disabled');
		$('#marketingbudget').removeClass('empty-field');
	}
});

$('#website').focusout(function(e) {
	briefHench.fillCompanyName();
});

function vaRegisterEvents() {
	window.va.identify();

	briefHench.websiteSDK.reportEvent('Wizard.Brief Started', { category: 'Wizard.Brief', action: 'Started' });
}

$('input').keyup(function() {
	if ($('.brief-next-button').hasClass('disabled')) {
		$('.brief-error').css('display', 'none');
		$('.brief-form-v2.active .brief-next-button').removeClass('disabled');
	}

	if ($(this).val().length < 1) {
		$('.brief-form-v2.active .brief-next-button').addClass('disabled')
	}
});

$('.business-type-selection').on('change', function() {
	$('.brief-error').css('display', 'none');
	$('.select2-selection--single').removeClass('empty-field');
	$('.brief-form-v2.active .brief-next-button').removeClass('disabled');

})

$('#fullname').focusout(function(e) {
	briefHench.splitName();
})