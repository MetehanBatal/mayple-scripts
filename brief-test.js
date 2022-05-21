const validationRules = {
	// Inner Object Names (e.g. firstName) Must Match with the Input's "name" Attribute
	// 
	leadForm: {
		firstName: {
			validate: function(val) {
				if (val.length < 3) {
					return false;
				}
			}
		},
		lastName: {
			validate: function(val) {
				if (val.length < 2) {
					return false;
				}
			}
		},
		emailAddress: {
			validate: function(val) {
				return String(val)
					.toLowerCase()
					.match(
						/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					);
			}
		},
		phoneNumber: {
			validate: function(val) {
				briefHench.validatePhone(val);
			}
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
		console.log( validationRules[container] );
		console.log( '----------' );
		console.log( $(container + ' input') );
		console.log( '----------' );
		$(container + ' input').each(function(item) {
			let field = $(this);
			let hasError = validationRules[container].field.validate();
			console.log( field, hasError );
		});
	}
}


$(document).ready(function(e) {
	briefHench.handleStepChange();
});



