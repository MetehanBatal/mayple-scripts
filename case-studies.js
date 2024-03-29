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
	selectedFilter: '',
	selectedFilterType: '',

	previousY: 0,
	lastScrollTop: 0,
	scrollDirection: 'down',

	loadData: function() {
		if (csHench.offsetNumber > 3000) {
			return; }
		console.log('Offset: ', csHench.offsetNumber);
		fetch(`https://miracle.novus.studio/mayple/view?collectionId=6437e3124e5a5d375f887058&limit=100&offset=${csHench.offsetNumber}`, requestOptions)
			.then(response => response.json())
			.then(result => {
				csHench.appendCards(result);
			})
			.catch(error => console.log('error', error));
	},

	appendCards: function(data) {
		let items = data.data.items;
		const container = document.getElementById('case-study-card-container');

		items.forEach(function(item) {
			if (item.isDraft || item.isArchived) { return; }
		
			itemData = item.fieldData;
			
			if (itemData['has-image'] === 'f' && itemData.results.length > 0) {
				let hasMailchimp = itemData.ismailchimp ? 'hasMailchimp' : '';
				let imageURL = hasMailchimp === 'hasMailchimp' ? itemData['marketer-image-url']['url'] : `https://static.cdn.mayple.com/website/img/success_stories/${itemData.slug}.jpg`;
				let hasTarget = itemData["target-kpi"] ? itemData["target-kpi"] : '';
				let hasTargetted = itemData["targetted-kpi"] ? itemData["targetted-kpi"] : '';
				let industries = itemData['skills-used'] ? itemData['skills-used'].split(",") : '';
				const uniqueIndustries = [...new Set(industries)];
				const industriesDivs = uniqueIndustries.map(industry => `<div class="brand-area">${industry}</div>`);
				const industriesHTML = industriesDivs.join("");

				let cardTemplate =
					`<div class="study-cases-collection-item dynamic-case-study-item ${hasMailchimp}">
						<div class="casestudy-pagelist-card">
							<a href="https://www.mayple.com/case-studies/${itemData.slug}" class="study-case-list-img new w-inline-block">
								<div class="casestudy-pagelist-logo-wrapper new">
									<div class="casestudy-img-overlay">
										<h3 class="h2-34 no-margin">${hasTarget}</h3>
										<h3 class="no-margin">${hasTargetted}</h3>
									</div>
									
									<div class="w-embed">
										<img class="casestudy-pagelist-logo casestudy-pagelist-cover new" src="${imageURL}" data-name="${itemData.slug}">
									</div>
								</div>
							</a>
							<div class="study-case-card-content new">
								<h4 class="brand-name">${itemData.name}</h4>
								
								<div class="brand-description w-richtext">
									<p>${itemData.results}</p>
								</div>
								
								<div class="fn-case-card-categories">
									<div class="fn-case-categories">
										<div class="brand-areas">${industriesHTML}</div>
									</div>
								</div>
								
								<div class="read-case-study-link-wrapper">
									<a href="#" class="read-case-study-link">Read Case Study</a>
									<img src="https://assets-global.website-files.com/5a68f082ae5eb70001efdda4/638492348fdf2a05bf329540_Union.png" loading="lazy" alt="" class="read-study-icon">
								</div>
								
								<a href="https://www.mayple.com/case-studies/${itemData.slug}" class="case-study-feature-card w-inline-block">
									<div class="study-case-feature-txt-link hide">READ CASE STUDY</div>
								</a>
								
								<input hidden disabled class="hidden" name="find-service" value="${itemData['skills-used']}" />
								<input hidden disabled class="hidden" name="find-industry" value="${itemData['industry']} />"
							</div>
						</div>
					</div>`;
				
				container.insertAdjacentHTML("beforeend", cardTemplate);
			}
		});

		csHench.offsetNumber = csHench.offsetNumber + 100;

		if (items.filter(item => item.fieldData['has-image'] === 'f').length < 40) {
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
		const target = document.querySelectorAll('#case-study-card-container .study-cases-collection-item')[document.querySelectorAll('#case-study-card-container .study-cases-collection-item').length - 20];
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
		if (csHench.selectedFilter.length < 2) {
			// removed filter
			//
			$('.w-layout-blockcontainer').removeClass('hidden');
			$('.study-cases-collection-item.hidden').removeClass('hidden');

			return;
		}

		document.getElementById('visible-count').innerHTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;

		$('#case-study-card-container').addClass('hidden');
		$('.w-layout-blockcontainer').addClass('hidden');

		$('.loader-holder').removeClass('hidden');

		// csHench.loadData();

		console.log('Selected service: ', csHench.selectedFilter);

		$('#case-study-card-container .study-cases-collection-item:not(".hidden")').each(function(index, card) {
			if (!$(this).find(`input[name="find-${csHench.selectedFilterType}"]`).val().includes(csHench.selectedFilter)) {
				$(this).addClass('hidden');
			} else {
				$(this).removeClass('hidden');
			}
		});

		if ($('#case-study-card-container .study-cases-collection-item:not(".hidden")').length < 19 && csHench.filterCount < 5) {
			csHench.filterCount = csHench.filterCount + 1;
			csHench.loadData('filtration');
		} else {
			document.getElementById('visible-count').innerHTML = $('#case-study-card-container .study-cases-collection-item:not(".hidden")').filter((index, el) => $(el).find(`input[name="find-${csHench.selectedFilterType}"]`).val().includes(csHench.selectedFilter)).length;
		}
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
		csHench.selectedFilter = $(this).val();
		csHench.selectedFilterType = 'service';
		csHench.filterItems();
	});

	$("select[fs-cmsfilter-field='Industry']").change(function() {
		csHench.selectedFilter = $(this).val();
		csHench.selectedFilterType = 'industry';
		csHench.filterItems();
	});

	$(".fn-case-reset-layout").click(function() {
		csHench.filterCount = 0;
		$('.w-layout-blockcontainer').removeClass('hidden');
		$('#case-study-card-container .study-cases-collection-item').removeClass('hidden');
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