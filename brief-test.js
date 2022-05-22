const validationRules = {
	// Inner Object Names (e.g. firstName) Must Match with the Input's "name" Attribute
	// 
	leadForm: {
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
			}
		},
		estimatedMediaBudget: {
			validate: function(val) {
				if (typeof(val) !== 'number' || val.length < 2) {
					return false;
				}
			}
		}
	},

	industrySelection: {
		
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

		const nextButton = $('.to-next-step');
		const backButton = $('.to-previous-step');

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

		self.checkErrors(currentContainer);
	},

	checkErrors: function(container) {
		// Remove previous error states
		// 
		$('.error-message').addClass('hidden');
		
		$('.brief-stepped-form.active input').each(function(item) {
			$(this).removeClass('empty-field');

			let field = $(this).attr('name');
			let valid = validationRules[container][field].validate($(this).val());

			if (!valid || valid == null) {
				$(this).addClass('empty-field');
				$('.error-message div').text(validationRules[container][field].errorLog);
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
		let phoneInput = $("#phoneNumber");
		console.log( 'Phone: ', phoneInput );
		self.intlTel = window.intlTelInput(phoneInput, {
			initialCountry: "auto",
			utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js",
			geoIpLookup: function(success, failure) {
				$.get("https://ipinfo.io?token=1fa95a0e3e5a98", function() {}, "jsonp").always(function(resp) { success((resp && resp.country) ? resp.country : "us"); });
			},
		});
	},
}


$(document).ready(function(e) {
	briefHench.handleStepChange();
	briefHench.initIntlTel();
});



