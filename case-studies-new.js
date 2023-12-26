const baseURL = 'https://mayple.novus.studio/caseStudy/view';

const observerOptions = {
	root: null,
	rootMargin: '0px',
	threshold: 0.0,
};

const requestOptions = {
	method: 'GET',
	redirect: 'follow'
};

let csHench = {
	offsetNumber: 0,

	filterCount: 0,
	selectedIndustry: '',
	selectedService: '',

	previousY: 0,
	lastScrollTop: 0,
	scrollDirection: 'down',

	loadData: function() {
		if (csHench.offsetNumber > 3000) {
			return; }
		console.log('Offset: ', csHench.offsetNumber);
		let filtrationParams = '';
		if (csHench.selectedIndustry.length > 0 || csHench.selectedService.length > 0) {
			filtrationParams = `industry=${csHench.selectedIndustry}&service=${csHench.selectedService}`;
		}
		
		fetch(`${baseURL}?limit=100&offset=${filtrationParams.length > 0 ? 0 : csHench.offsetNumber}&${filtrationParams}`, requestOptions)
			.then(response => response.json())
			.then(result => {
				csHench.appendCards(result);
			})
			.catch(error => console.log('error', error));
	},

	appendCards: function(data) {
		let items = data.data;

		let container = document.querySelector('#cs-main-content-holder .case-study-card-container');
		if (csHench.selectedIndustry.length > 0 || csHench.selectedService.length > 0) {
			container = document.querySelector('#cs-main-content-holdercs-filter-results-holder .case-study-card-container');
		}

		items.forEach(function(item) {
			itemData = item.fieldData;
			
			if (item.results.length > 0) {
				// let hasMailchimp = item.isMailchimp ? 'hasMailchimp' : '';
				// let imageURL = hasMailchimp === 'hasMailchimp' ? itemData['marketer-image-url']['url'] : `https://static.cdn.mayple.com/website/img/success_stories/${itemData.slug}.jpg`;
				// let hasTarget = itemData["target-kpi"] ? itemData["target-kpi"] : '';
				// let hasTargetted = itemData["targetted-kpi"] ? itemData["targetted-kpi"] : '';
				const skillsDivs = item.skillsUsed.map(skillUsed => `<div class="brand-area">${skillUsed}</div>`);
				const skillsHTML = skillsDivs.join("");

				let cardTemplate =
					`<div class="study-cases-collection-item dynamic-case-study-item ${hasMailchimp}">
						<div class="casestudy-pagelist-card">
							<a href="https://www.mayple.com/case-studies/${item.slug}" class="study-case-list-img new w-inline-block">
								<div class="casestudy-pagelist-logo-wrapper new">
									<div class="w-embed">
										<img class="casestudy-pagelist-logo casestudy-pagelist-cover new" src="${imageURL}" data-name="${item.slug}">
									</div>
								</div>
							</a>
							<div class="study-case-card-content new">
								<h4 class="brand-name">${item.name}</h4>
								
								<div class="brand-description w-richtext">
									<p>${item.results}</p>
								</div>
								
								<div class="fn-case-card-categories">
									<div class="fn-case-categories">
										<div class="brand-areas">${skillsHTML}</div>
									</div>
								</div>
								
								<div class="read-case-study-link-wrapper">
									<a href="#" class="read-case-study-link">Read Case Study</a>
									<img src="https://assets-global.website-files.com/5a68f082ae5eb70001efdda4/638492348fdf2a05bf329540_Union.png" loading="lazy" alt="" class="read-study-icon">
								</div>
								
								<a href="https://www.mayple.com/case-studies/${item.slug}" class="case-study-feature-card w-inline-block">
									<div class="study-case-feature-txt-link hide">READ CASE STUDY</div>
								</a>
							</div>
						</div>
					</div>`;
				
				container.insertAdjacentHTML("beforeend", cardTemplate);
			}
		});

		csHench.offsetNumber = csHench.offsetNumber + 100;

		if (items.filter(item => item.hasImage === false).length < 40) {
			console.warn('Re-called loadData due to insufficient result.');
			csHench.loadData();
		} else {
			setTimeout(function() {
				csHench.loadObserver();
			}, 60);

			if (csHench.filterCount < 1) {
				document.getElementById('visible-count').innerHTML = csHench.offsetNumber;
			} else {
				csHench.filterItems();
			}
		}
	},

	loadObserver: function() {
		const observer = new IntersectionObserver(csHench.handleIntersection, observerOptions);
		const target = document.querySelectorAll('#cs-main-content-holder .case-study-card-container .study-cases-collection-item')[document.querySelectorAll('#cs-main-content-holder .case-study-card-container .study-cases-collection-item').length - 20];
		console.log("target: ", target);
		observer.observe(target);
	},

	handleIntersection(entries, observer) {
		entries.forEach(entry => {
			const currentY = entry.boundingClientRect.y;

			if (csHench.scrollDirection === 'down' && entry.isIntersecting) {
				csHench.loadData();
			} else {
				// console.log('do nothing: ', csHench.scrollDirection, entry.isIntersecting);
			}

			csHench.previousY = currentY;
		});
	},

	filterItems: function() {
		document.getElementById('visible-count').innerHTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;

		$('#cs-main-content-holder').addClass('hidden');
		$('#cs-filter-results-holder').removeClass('hidden');

		$('.loader-holder').removeClass('hidden');

		// csHench.loadData();

		csHench.loadData();

		// $('#case-study-card-container .study-cases-collection-item:not(".hidden")').each(function(index, card) {
		// 	if (!$(this).find(`input[name="find-${csHench.selectedFilterType}"]`).val().includes(csHench.selectedFilter)) {
		// 		$(this).addClass('hidden');
		// 	} else {
		// 		$(this).removeClass('hidden');
		// 	}
		// });

		// if ($('#case-study-card-container .study-cases-collection-item:not(".hidden")').length < 19 && csHench.filterCount < 5) {
		// 	csHench.filterCount = csHench.filterCount + 1;
		// 	csHench.loadData('filtration');
		// } else {
		// 	document.getElementById('visible-count').innerHTML = $('#case-study-card-container .study-cases-collection-item:not(".hidden")').filter((index, el) => $(el).find(`input[name="find-${csHench.selectedFilterType}"]`).val().includes(csHench.selectedFilter)).length;
		// }
	}
};

window.addEventListener("scroll", function() {
	var st = window.pageYOffset || document.documentElement.scrollTop;
	csHench.scrollDirection = st < csHench.lastScrollTop ? 'up' : 'down';

	csHench.lastScrollTop = st <= 0 ? 0 : st;
}, false);


$(document).ready(function() {
	csHench.loadData();

	$('.brand-description').each(function() {
		if ($(this).text().length > 360) {
			$(this).text($(this).text().substring(0, 360) + '...');
		}
	});

	$("select[fs-cmsfilter-field='Service']").change(function() {
		csHench.selectedService = $(this).val();
		csHench.filterItems();
	});

	$("select[fs-cmsfilter-field='Industry']").change(function() {
		csHench.selectedIndustry = $(this).val();
		csHench.filterItems();
	});

	$(".fn-case-reset-layout").click(function() {
		csHench.filterCount = 0;
		
		$('#cs-main-content-holder').removeClass('hidden');
		$('#cs-filter-results-holder').addClass('hidden');
		
		$("select[fs-cmsfilter-field='Service']").val('');
		$("select[fs-cmsfilter-field='Industry']").val('');
		
		document.getElementById('visible-count').innerHTML = csHench.offsetNumber;
	});
});










// function runErrors() {
// 	errorIds.forEach(function(itemId) {
// 		var requestOptions = {
// 			method: 'PATCH',
// 			redirect: 'follow'
// 		};
// 		fetch(`https://miracle.novus.studio/updateCaseStudies/update?itemId=${itemId}`, requestOptions)
// 			.then(response => response.json())
// 			.then(result => console.log(result))
// 			.catch(error => console.log('error', error));
// 		});
// }