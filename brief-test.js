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

	locations: [],

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
		dependencies: [
			'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/intlTelInput.min.js',
			'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/css/intlTelInput.css'
		],
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
					console.log( 'Value: ', val );
					console.log( 'Type: ', typeof(val) );
					if (typeof(val) !== 'number' || val.length < 2) {
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
		}
	},


}

let briefHench = {
	currentStep: 0,

	insertSDK: function() {
		const self = this;
		const WebsiteSDK = window.WebsiteSDK.default;
		self.websiteSDK = new WebsiteSDK();

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

		let currentContainer = $('.brief-stepped-form.active form').attr('data-name');

		let isValid = self.checkErrors(currentContainer);
		if(!isValid) {
			console.log( 'There is an issue' );
			return;
		}

		console.log( 'You may pass to next step' );
	},

	checkErrors: function(container) {
		// Remove previous error states
		// 
		$('.error-message').addClass('hidden');
		
		let fields = $('.brief-stepped-form.active input').filter('[required]');
		fields.each(function(item) {
			if ($(this).attr('type') === 'checkbox') {
				if ( !$(this).is(':checked') ) {
					$(this).addClass('empty-field');
					$('.error-message div').text('You must agree the Terms of Use in order to continue');
					$('.error-message').removeClass('hidden');

					return false;
				}  
				return true;
			}
			$(this).removeClass('empty-field');

			let field = $(this).attr('name');
			console.log( 'Field: ', field );
			let isValid = validationRules[container]['inputs'][field].validate($(this).val());

			if (!isValid || isValid == null) {
				$(this).addClass('empty-field');
				$('.error-message div').text(validationRules[container]['inputs'][field].errorLog);
				$('.error-message').removeClass('hidden');
				return false;
			}
		});
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
		console.log( 'Called' );
		var rawValue = $('#marketingbudget').val().replace(",", "");
		if (parseInt(rawValue) > 1000000) {
			rawValue = '1000000';
		}
		var withComma = rawValue.split(/(?=(?:\d{3})+$)/).join(",");
		$('#marketingbudget').val(withComma);

		rawValue = parseInt(rawValue);
		formSchema.estimatedMediaBudget = rawValue;
		console.log( formSchema.estimatedMediaBudget, typeof(formSchema.estimatedMediaBudget) );
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
	}
}


$(document).ready(function(e) {
	briefHench.handleStepChange();
	briefHench.initIntlTel();
});



$('#marketingbudget').keyup(function(e) {
	let lastChar = $('#marketingbudget').val().slice(-1);
	console.log( lastChar );
	
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

	console.log( briefHench );
	briefHench.restructureBudget();
});

$('#website').keyup(function(e) {
	if (e.originalEvent.keyCode == 32) {
		$(this).val( $(this).val().slice(0, -1) ) }
	briefHench.fillCompanyName();
});