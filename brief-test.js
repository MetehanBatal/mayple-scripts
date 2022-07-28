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
					if (val.length < 2) {
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
			},
			howDidYouHearAboutMayple: {
				validate: function(val) {
					if (val.length < 2) {
						return false; }
					else { return true; }
				},
				errorLog: 'Please fill the empty field'
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

	// For welcome-v4 page only
	// 
	combinedForm: {
		dependencies: [
			'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js'
		],
		inputs: {
			skill: {
				set: function() {
					$('.country-selection').select2({ placeholder: "Select countries" });
				},
				validate: function(val) {
					if (val.length < 1) {
						return false; }
					else { return true; }
				}
			},
			industry: {
				set: function() {
					$('.business-type-selection').select2({ placeholder: "Try Entertainment, Clothing, etc." });
				},
				validate: function(val) {
					if (val.length < 1) {
						return false; }
					else { return true; }
				}
			},
			estimatedMediaBudget: {
				set: function() {
					console.log( 'Nothing to set' );
				},
				validate: function() {
					const val = formSchema.estimatedMediaBudget;
					if (typeof(val) !== 'number' || val.length < 2 || val < 1) {
						return false;
					} else { return true; }
				},
				errorLog: 'Your budget cannot be less than $0'
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

			let skills = briefHench.selectedSkills;
			const skillsSorted = skills ? skills.map((skill) => skill).sort() : null;
			const skillTraits = {
				label: skills ? skillsSorted : null,
				skills: skills ? skillsSorted : '',
			};
			briefHench.websiteSDK.reportEvent('Wizard.Brief.MarketingSkills StepDone', skillTraits);
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

		// Reveal back/next buttons, if they are not already visible
		// 
		$('.pagination-buttons').removeClass('hidden');

		let currentContainer = $('.brief-stepped-form.active form').attr('data-name');
		console.log( 'current container: ', currentContainer );

		// Run validations for each of the fields inside the current container
		// 
		let isValid = self.checkErrors(currentContainer);
		if(!isValid) {
			console.log( 'There is an issue' );
			return;
		}

		console.log( 'You may pass to next step' );

		// If the validation passes;
		// reveal buttons
		$('.back-button').removeClass('hidden');
		$('.next-button').removeClass('hidden')

		// get current step index
		let currentStep = $('.brief-stepped-form.active').index();
		// If it's the last step,
		// submit the form to Hubspot
		if (currentStep ===  $('.brief-stepped-form').length - 1) {
			self.submitForm();
			return;
		}
		currentStep++;
		self.currentStep = currentStep;

		if (currentStep ===  $('.brief-stepped-form').length - 1) {
			$('.button-text').html('SUBMIT'); }
		
		$('.brief-stepped-form').removeClass('active');
		$('.brief-stepped-form').eq(currentStep).addClass('active');

		let nextContainer = $('.brief-stepped-form.active form').attr('data-name');
		console.log( 'Next container: ', nextContainer );
		
		// Get scripts/external libraries for the next step
		// 
		self.setDependencies(nextContainer);

		// Send reporting for the current/finished step
		// 
		validationRules[currentContainer].eventReporting();
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
		} else {
			self.revealNextContainer();
		}
		// inputs.forEach(function(input) {
		// 	console.log( 'Input: ', input );
		// });
	},

	toPreviousStep: function() {
		const self = this;

		$('.button-text').html('NEXT');

		// get current step index
		let currentStep = $('.brief-stepped-form.active').index();
		// If it's the first step,
		// there shouldn't be any back buttons
		if (currentStep ===  1) {
			$('.back-button').addClass('hidden'); }
		if (currentStep === 0) {
			return; }
		if (currentStep === 1 && $('.brief-stepped-form.active form').attr('data-name') === 'leadForm') {
			$('.next-button').addClass('hidden') };
		currentStep--;
		self.currentStep = currentStep;

		$('.brief-stepped-form').removeClass('active');
		$('.brief-stepped-form').eq(currentStep).addClass('active');

		self.revealNextContainer();
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
		
		if (container === 'industrySelection') {
			formSchema['industry'][0].industrySubCategory = $('.business-type-selection').select2('data')[0].id;
			formSchema['industry'][0].industryCategory = $('.business-type-selection').find(':selected').closest('optgroup').attr('data-category');

			if (formSchema['industry'][0].industrySubCategory.length < 1 || formSchema['industry'][0].industryCategory == 'undefined' || !formSchema['industry'][0].industryCategory) {
				isClean = false;
				return false;
			} else {
				isClean = true;
			}

			return isClean;
		};

		let fields = $('.brief-stepped-form.active input').filter('[required]');
		fields.each(function(item) {
			if ($(this).attr('type') === 'checkbox') {
				let field = $(this).attr('name');
				console.log( 'Field: ', field );
				setTimeout(function() {
					let checked = $(`input[name="${field}"]:checked`);
					console.log( 'Checked: ', checked );
					formSchema['serviceTypes'] = [];
					briefHench['selectedSkills'] = [];

					checked.forEach(function(index, selectedCheckbox) {
						let selectedSkill = $(selectedCheckbox).parent().attr('skill-type');
					
						if(selectedSkill === 'PAID_ADVERTISING') {
							formSchema['serviceTypes'].push('FACEBOOK_ADS');
							formSchema['serviceTypes'].push('GOOGLE_ADS');
						} else {
							formSchema['serviceTypes'].push(selectedSkill);
						}
						briefHench.selectedSkills.push( $(selectedCheckbox).siblings('.checkbox-label').html() );
					});
				}, 200);
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
				} else {
					console.log( $(this).val(), formSchema[field] );
					if (field !== 'estimatedMediaBudget') {
						formSchema[field] = $(this).val();
					}

					if (field === 'phoneNumber') {
						formSchema[field] = isValid;
					}
				}
			}
		});

		return isClean;
	},

	submitForm: function() {
		const self = this;

		formSchema['frontendSalesQualificationScore'] = self.websiteSDK.calcSalesQualificationLeadScore(formSchema);

		console.log( formSchema );

		self.websiteSDK.createProjectLead(formSchema);
		self.websiteSDK.submitHubspotForm(formSchema);

		self.websiteSDK.reportEvent('Lead Created', { category: 'Lead', action: 'Created' });
		self.websiteSDK.reportEvent('Wizard.Brief Finished', { category: 'Wizard.Brief', action: 'Finished' });

		self.toggleMeetingForm();

		// self.websiteSDK.reportEvent('Wizard.Brief.Industry StepDone', industryTraits);
	},

	toggleMeetingForm: function() {
		$('.brief-stepped-form').addClass('hidden');
		$('.meeting-step').removeClass('hidden');
		$('.pagination-buttons').addClass('hidden');

		let container = $('#meeting-container');

		let template = '';

		if (formSchema['frontendSalesQualificationScore'] > 3) {
			// Implement long-duration meeting aka SQL form
			// 
			template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/amir-keren1/discovery-round-robin?embed=true&firstname=${formSchema['firstname']}&lastname=${formSchema['lastname']}&email=${formSchema['emailAddress']}&company=${formSchema['companyName']}"></div>`;

			briefHench.websiteSDK.reportEvent('Lead SalesQualified', { category: 'Lead', action: 'SalesQualified' });
		} else if ( formSchema['frontendSalesQualificationScore'] < 0 ) {
			// Redirect users to app
			// 
			window.location.href = 'https://app.mayple.com/login?register=1';
		} else {
			// Implement short-duration meeting aka MQL form
			// 
			template = `<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/amir-keren1/sales-team-round-robin?embed=true&firstname=${formSchema['firstname']}&lastname=${formSchema['lastname']}&email=${formSchema['emailAddress']}&phone=${formSchema['phoneNumber']}"></div>`;
		}
		
		container.append(template);

		$.getScript("https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js").done(function(script, textStatus) {})
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

	fillTrafficSource: function() {
		let pagePath = window.location.pathname;

		if (pagePath.startsWith('/lp')) {
			formSchema['lpTrafficSource'] = pagePath;
		}
		if (pagePath.startsWith('/welcome-v4')) {
			formSchema['trafficSource'] = 'v4_stepped';
		}
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

		// if (pagePath.startsWith('/welcome-v4')) {
		// 	$('.brief-checkbox').click(function() {
		// 		let selectedSkill = $(this).attr('skill-type');
		// 		if 
		// 	})
		// }
	},

	setServices: function() {
		let pagePath = window.location.pathname;
		if (pagePath.startsWith('/lp/lp-test-for-new-brief')) {
			formSchema['serviceTypes'] = ['FACEBOOK_ADS', 'GOOGLE_ADS'];
		}
	},
}


$(document).ready(function(e) {
	briefHench.insertSDK();
	briefHench.handleStepChange();
	briefHench.initIntlTel();
	briefHench.checkBriefType();
	briefHench.fillTrafficSource();
	//briefHench.setServices();
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
	briefHench.fillCompanyName();
});

function vaRegisterEvents() {
	window.va.identify();

	briefHench.websiteSDK.reportEvent('Wizard.Brief Started', { category: 'Wizard.Brief', action: 'Started' });
}