let formSchema = {
	firstName: '',
	lastName: '',
	phoneNumber: '',
	emailAddress: '',
	howDidYouHearAboutMayple: '',
	source: '',
	
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

	trafficSource: '',
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
			firstName: {
				validate: function(val) {
					if (val.length < 3) {
						return false; }
					else { return true; }
				},
				errorLog: 'Please fill the name field'
			},
			lastName: {
				validate: function(val) {
					if (val.length < 2) {
						return false; }
					else { return true; }
				},
				errorLog: 'Please fill the last name field'
			},
			emailAddress: {
				validate: function(val) {
					return String(val)
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
					let url;

					try {
						url = new URL(val);
					} catch (_) {
						return false;  
					}

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
			estimatedMediaBudget: {
				validate: function() {
					const val = formSchema.estimatedMediaBudget;
					if (typeof(val) !== 'number' || val.length < 2 || val < 1) {
						return false;
					} else { return true; }
				},
				errorLog: 'Your budget cannot be less than $0'
			}
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
		}
	}
}

let briefHench = {
	currentStep: 0,

	insertSDK: function() {
		const self = this;
		const WebsiteSDK = window.WebsiteSDK.default;
		self.websiteSDK = new WebsiteSDK({ debug: true });

		console.log('SDK: ', self.websiteSDK);
	},

	handleStepChange: function() {
		const self = this;

		const nextButton = $('.next-button');
		const backButton = $('.back-button');

		nextButton.click(function(e) {
			self.toNextStep();
		});
		backButton.click(function(e) {
			self.toPreviousStep();
		});
	},

	toNextStep: function() {
		const self = this;

		$('.pagination-buttons').removeClass('hidden');

		let currentContainer = $('.brief-stepped-form.active form').attr('data-name');
		console.log( 'current container: ', currentContainer );

		let isValid = self.checkErrors(currentContainer);
		if(!isValid) {
			console.log( 'There is an issue' );
			return;
		}

		console.log( 'You may pass to next step' );

		// If the validation passes;
		// reveal the back button
		$('.back-button').removeClass('hidden');

		// get current step index
		let currentStep = $('.brief-stepped-form.active').index();
		if (currentStep ===  $('.brief-stepped-form').length - 1) {
			self.submitForm();
			return;
		}
		currentStep++;
		

		$('.brief-stepped-form').removeClass('active');
		$('.brief-stepped-form').eq(currentStep).addClass('active');

		let nextContainer = $('.brief-stepped-form.active form').attr('data-name');
		console.log( 'Next container: ', nextContainer );
		self.setDependencies(nextContainer);
	},

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
					console.log( index, list.length );
					if (index === list.length - 1) {
						self.revealNextContainer();
					}
				});
			});
		
			let inputs = validationRules[container]['inputs'];
			for (input in inputs) {
				console.log( 'Input: ', inputs[input] );
				inputs[input].set();
			}
		}
		// inputs.forEach(function(input) {
		// 	console.log( 'Input: ', input );
		// });
	},

	revealNextContainer: function() {
		$('.brief-stepped-form').addClass('hidden');
		$('.brief-stepped-form.active').removeClass('hidden');
	},

	checkErrors: function(container) {
		// Remove previous error states
		// 
		$('.error-message').addClass('hidden');

		let isClean = true;
		
		let fields = $('.brief-stepped-form.active input').filter('[required]');
		fields.each(function(item) {
			// if ($(this).attr('type') === 'checkbox') {
			// 	if ( !$(this).is(':checked') ) {
			// 		$(this).addClass('empty-field');
			// 		$('.error-message div').text('You must agree the Terms of Use in order to continue');
			// 		$('.error-message').removeClass('hidden');

			// 		return false;
			// 	}  
			// 	return true;
			// }
			// 
			
			if ($(this).attr('type') === 'checkbox') {
				let field = $(this).attr('name');
				console.log( 'Checkbox: ', field );
			} else {
				$(this).removeClass('empty-field');

				let field = $(this).attr('name');
				let isValid = validationRules[container]['inputs'][field].validate($(this).val());	

				if (!isValid || isValid == null) {
					console.log( 'Not valid: ', field );
					$(this).addClass('empty-field');
					$('.error-message div').text(validationRules[container]['inputs'][field].errorLog);
					$('.error-message').removeClass('hidden');
					isClean = false;

					return false;
				}
			}
		});

		return isClean;
	},

	submitForm: function() {
		const self = this;

		formSchema['frontendSalesQualificationScore'] = self.websiteSDK.calcSalesQualificationLeadScore(formSchema);

		self.websiteSDK.createProjectLead(formSchema);
		self.websiteSDK.submitHubspotForm(formSchema);

		// self.websiteSDK.reportEvent('Wizard.Brief.Industry StepDone', industryTraits);
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
				$.get("https://ipinfo.io?token=1fa95a0e3e5a98", function() {}, "jsonp").always(function(resp) { success((resp && resp.country) ? resp.country : "us"); });
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
		// If user didn't write down the protocal name...
		if (value.length > 5 && !value.startsWith('http')) {
			// add it programatically as the URL object is not validating the string without the https:// prefix
			$('#website').val('https://' + value);
		} else if (value.startsWith('http://')) {
			// turn http to https
			$('#website').val(value.replace('http://', 'https://'));
		}
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

	fillLPSource: function() {
		let pagePath = window.location.pathname;
		formSchema['lpTrafficSource'] = pagePath;
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

	checkBriefType: function() {
		const self = this;

		let initialContainer = $('.brief-stepped-form.active form').attr('data-name');

		if (initialContainer === 'skillsSelection') {
			// Hide the next/back buttons
			$('.pagination-buttons').addClass('hidden');
			$('.brief-checkbox').one('click', function(e) {
				self.toNextStep();
			});
		}
	},

	setServices: function() {
		let pagePath = window.location.pathname;
		if (pagePath.startsWith('/lp/lp-test-for-new-brief')) {
			formSchema['serviceTypes'] = ['FACEBOOK_ADS', 'GOOGLE_ADS'];
		}
	}
}


$(document).ready(function(e) {
	briefHench.insertSDK();
	briefHench.handleStepChange();
	briefHench.initIntlTel();
	briefHench.checkBriefType();
	//briefHench.setServices();
});



$('#marketingbudget').keyup(function(e) {
	let lastChar = $('#marketingbudget').val().slice(-1);
	
	if (isNaN(lastChar) || parseInt(e.originalEvent.keyCode) === 32) {
		let value = $('#marketingbudget').val().slice(0, -1);
		$('#marketingbudget').val(value);
		return;
	}


	// const isNumber = Number(e.originalEvent.key) ? true : false;
	// if (e.originalEvent.keyCode != 188 && e.originalEvent.keyCode != 8 && e.originalEvent.keyCode != 48 && e.originalEvent.keyCode != 13 && e.originalEvent.keyCode != 37 && e.originalEvent.keyCode != 39) {
	// 	if (!isNumber) {
	// 		let value = $('#marketingbudget').val().slice(0, -1);
	// 		$('#marketingbudget').val(value);
	// 		return;
	// 	}
	// }

	briefHench.restructureBudget();
});

$('#website').keyup(function(e) {
	if (e.originalEvent.keyCode == 32) {
		$(this).val( $(this).val().slice(0, -1) ) }
	briefHench.fillCompanyName();
});