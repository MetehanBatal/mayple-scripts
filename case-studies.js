const excludedOptions = ["Travel & Leisure", "Nonprofit & Government", "Automotive & Transportation", "Real Estate", "Sports, Outdoors & Fitness", "Pets", "Gaming", "Baby"];

$('[select-item="Industry"]').each(function() {
	let s = $(this).text();
	if (!excludedOptions.includes(s)) {
		$("select[fs-cmsfilter-field='Industry']").append('<option value="' + s + '">' + s + '</option>');
	}
});

$('[select-item="Service"]').each(function() {
	let s = $(this).text();
	$("select[fs-cmsfilter-field='Service']").append('<option value="' + s + '">' + s + '</option>');
})

const options = {
	root: null,
	rootMargin: '0px',
	threshold: 0.0,
};

const bannedItems = [
	'themadpotter',
  'university-of-georgia',
  'aph',
  'gotham-writers',
  'hudson-dermatology',
  'roots-natural-kitchen',
  'spanish-and-go',
  'ssr',
  'acme-hospitality'
];

let offsetNumber = 0;
let filterCount = 0;
let index = 0;
let errorIds = [];

function loadData() {
	console.log('Load Data called');
	// fetch content
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	fetch(`https://miracle.novus.studio/mayple/view?collectionId=6437e3124e5a5d375f887058&limit=100&offset=${offsetNumber}`, requestOptions)
		.then(response => response.json())
		.then(result => {
			appendCards(result);
		})
		.catch(error => console.log('error', error));
}

function appendCards(data) {
	let items = data.data.items;
	const container = document.getElementById('case-study-card-container');

	items.forEach(function(item) {
  	if (item.isDraft || item.isArchived) { return; }
    
		itemData = item.fieldData;
    console.log('Appending: ', itemData.slug);
    
		let hasMailchimp = itemData.ismailchimp ? 'hasMailchimp' : '';
    let imageURL = hasMailchimp === 'hasMailchimp' ? itemData['marketer-image-url']['url'] : `https://static.cdn.mayple.com/website/img/success_stories/${itemData.slug}.jpg`;

		let hasTarget = itemData["target-kpi"] ? itemData["target-kpi"] : '';
		let hasTargetted = itemData["targetted-kpi"] ? itemData["targetted-kpi"] : '';
		let industries = itemData['skills-used'].split(",");
		const uniqueIndustries = [...new Set(industries)];
		const industriesDivs = uniqueIndustries.map(industry => `<div class="brand-area">${industry}</div>`);
		const industriesHTML = industriesDivs.join("");
		if (itemData['has-image'] === 'f' && itemData.results.length > 0) {
			index = index + 1;

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
									<img id="case-study-img--${index}" class="casestudy-pagelist-logo casestudy-pagelist-cover new" src="${imageURL}" data-name="${itemData.slug}" data-mailchimp-cs="false">
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
      
      if (bannedItems.includes(itemData.slug)) {
      	document.getElementById(`case-study-img--${index}`).src = `https://metehanbatal.github.io/mayple-scripts/cs_images/${itemData.slug}.jpg`;
      }

			document.getElementById(`case-study-img--${index}`).addEventListener('error', function() {
				errorIds.push(item.id);
				// this.closest('.study-cases-collection-item').remove();
			});
		}
	});

	offsetNumber = offsetNumber + 100;
	
	setTimeout(function() {
		loadObserver();
	}, 360);

	if (filterCount < 1) {
		document.getElementById('visible-count').innerHTML = offsetNumber;
	}

	console.log('Error IDs: ', errorIds);
}

function runErrors() {
	errorIds.forEach(function(itemId) {
		var requestOptions = {
			method: 'PATCH',
			redirect: 'follow'
		};
		fetch(`https://miracle.novus.studio/updateCaseStudies/update?itemId=${itemId}`, requestOptions)
			.then(response => response.json())
			.then(result => console.log(result))
			.catch(error => console.log('error', error));
		});
}

function filterItems(selectedFilteringItem, type) {
	if (selectedFilteringItem.length < 2) {
		$('.w-layout-blockcontainer').removeClass('hidden');
		$('.study-cases-collection-item.hidden').removeClass('hidden');

		return;
	}
  
	$('.w-layout-blockcontainer').addClass('hidden');

	console.log('Selected service: ', selectedFilteringItem);

	$('#case-study-card-container .study-cases-collection-item:not(".hidden")').each(function(index, card) {
		if (!$(this).find(`input[name="find-${type}"]`).val().includes(selectedFilteringItem)) {
			$(this).addClass('hidden');
		} else {
			$(this).removeClass('hidden');
		}
	});

	if ($('.study-cases-collection-item:not(".hidden")').length < 10 && filterCount < 5) {
		loadData();
		
		setTimeout(function() {
			filterItems(selectedFilteringItem, type);

			filterCount = filterCount + 1;
		}, 1600);
	} else {
		document.getElementById('visible-count').innerHTML = $('.study-cases-collection-item:not(".hidden")').length;
	}
}

$(document).ready(function() {
	loadData();

	$('.brand-description').each(function() {
		if ($(this).text().length > 360) {
			$(this).text($(this).text().substring(0, 360) + '...');
		}
	});

	$("select[fs-cmsfilter-field='Service']").change(function() {
		filterItems($(this).val(), 'service');
	});

	$("select[fs-cmsfilter-field='Industry']").change(function() {
		filterItems($(this).val(), 'industry');
	});

	$(".fn-case-reset-layout").click(function() {
		filterCount = 0;
		$('.w-layout-blockcontainer').removeClass('hidden');
		$('#case-study-card-container .study-cases-collection-item').removeClass('hidden');
		$("select[fs-cmsfilter-field='Service']").val('');
		$("select[fs-cmsfilter-field='Industry']").val('');
		document.getElementById('visible-count').innerHTML = offsetNumber;
	});
});

let lastScrollTop = 0;
let scrollDirection = 'down';

window.addEventListener("scroll", function() {
	var st = window.pageYOffset || document.documentElement.scrollTop;
	scrollDirection = st < lastScrollTop ? 'up' : 'down';

	lastScrollTop = st <= 0 ? 0 : st;
}, false);

let previousY = 0;
function handleIntersection(entries, observer) {
	entries.forEach(entry => {
		const currentY = entry.boundingClientRect.y;

		if (scrollDirection === 'down' && entry.isIntersecting) {
			loadData();
		} else {
			console.log('do nothing: ', scrollDirection, entry.isIntersecting);
		}

		previousY = currentY;
	});
}

function loadObserver() {
	const observer = new IntersectionObserver(handleIntersection, options);
	const target = document.querySelectorAll('#case-study-card-container .study-cases-collection-item')[document.querySelectorAll('#case-study-card-container .study-cases-collection-item').length - 50];
	console.log("target: ", target);
	observer.observe(target);
}