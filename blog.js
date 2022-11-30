
(function() {
    function logElementEvent(eventName, element) {}
    var callback_enter = function(element) {
        logElementEvent("🔑 ENTERED", element);
    };
    var callback_loading = function(element) {
        logElementEvent("⌚ LOADING", element);
    };
    var callback_loaded = function(element) {
        logElementEvent("👍 LOADED", element);
    };
    var callback_error = function(element) {
        logElementEvent("💀 ERROR", element);
    };
    var callback_finish = function() {
        logElementEvent("✔️ FINISHED", document.documentElement);
    };
    var ll = new LazyLoad({
        elements_selector: ".w-richtext iframe, .w-richtext video, .w-richtext img, aside img",
        callback_enter: callback_enter,
        callback_loading: callback_loading,
        callback_loaded: callback_loaded,
        callback_error: callback_error,
        callback_finish: callback_finish
    });
})();

function makeIds() { var content = document.querySelector('[rich-text-block]'); var headings = content.querySelectorAll('h2, h3'); var headingMap = {};
    Array.prototype.forEach.call(headings, function(heading) { var id = heading.textContent.trim().toLowerCase().split(' ').join('-').replace(/[!@#$%^&*():]/ig, '').replace(/\//ig, '-');
        headingMap[id] = !isNaN(headingMap[id]) ? ++headingMap[id] : 0;
        heading.id = id }) } makeIds();
	window.addEventListener('DOMContentLoaded', (event) => {
    $('.agency-card-copy').click(function() { window.location.href = "https://mayple.com/welcome-v4" });
    let scoring = [{
            "score": "10",
            "wording": "Exceptional"
        },
        {
            "score": "9.9",
            "wording": "Very Good"
        },
        {
            "score": "9.8",
            "wording": "Very Good"
        },
        {
            "score": "9.7",
            "wording": "Very Good"
        },
        {
            "score": "9.6",
            "wording": "Good"
        },
        {
            "score": "9.5",
            "wording": "Good"
        }, { "score": "9.4", "wording": "Good" }, { "score": "9.3", "wording": "Good" }, { "score": "9.3", "wording": "Good" }, { "score": "9.3", "wording": "Good" }
    ];
    if (!$('.top-experts-layout.conditional').hasClass('w-condition-invisible')) {
        $('.top-expert-card').each(function(index, element, array) {
            if (scoring.length > index) {
                $(this).find('.agency-score-text').html(scoring[index].score);
                $(this).find('.agency-score-wording').html(scoring[index].wording);
            }
        });
    }

    load_Remodal();
});

$("[data-share='copy_url']").on("click", function() {
    navigator.clipboard.writeText(window.location.href);
});
if ($("article h2").length < 3) {
    $("[toc-wrapper]").hide();
}
let noFollowLinks = $("a[target*='_blank']");
noFollowLinks.each(function() {
    if (!$(this).attr('href').includes('mayple.com')) {
        $(this).attr('rel', 'nofollow');
    }
});
document.querySelectorAll('.banner-code').forEach(function(banner, index) {
    $('p:contains("[Add Banner Here]")').eq(0).replaceWith('<div class="blog-banner-holder"></div>');
    $(banner.textContent).appendTo($('.blog-banner-holder').eq(index));
});

if ($('p:contains("[Banner][")').length > 0) {
    $('p:contains("[Banner][")').each(function() {
	    let contentArray = $(this).html().split(']');
	    let headline = contentArray[1].substring(1);
	    let description = contentArray[2].substring(1);
	    let ctaText = contentArray[3].substring(1);
	    let ctaLink = contentArray[4].substring(1);
	    let themeClass = 'new-red-gradient';
	    let ctaClass = 'red-button';
	    console.log(contentArray[5].substring(1));

	    if (contentArray[5] && contentArray[5].substring(1) === 'blue') {
		themeClass = 'new-red-blue-gradient-copy';
		ctaClass = '';
	    }

	    let template = `<div class="b-card new-bcard flex-bcard red-grad-bg no-flex ${themeClass}">
		    <div class="b-card-content text-only">
			<h5 class="b-card-headline b-card-head-black text-only-head">${headline}</h5>
			<p class="paragraph-954915">${description}</p>
			<a href="${ctaLink}" target="_blank" class="w-inline-block">
			    <div class="cta-button-blog get-it-now ${ctaClass}">
				<h5 class="heading-174">${ctaText}</h5><img src="https://assets-global.website-files.com/5a68f082ae5eb70001efdda4/62c426f08db421f3e9b73ee9_white-arrow.svg" loading="lazy" alt="">
			    </div>
			</a>
		    </div>
		</div>`

	    $(this).html(template);    
    });
}

if ($('p:contains("[Quote][")').length > 0) {
    $('p:contains("[Quote][")').each(function() {
	    let contentArray = $(this).html().split(']');
	    let authorImg = contentArray[1].substring(1);
	    let authorName = contentArray[2].substring(1);
	    let authorTitle = contentArray[3].substring(1);
	    let quote = contentArray[4].substring(1);

	    let template = `
	    	<div class="quote-block">
	   			<div class="quote-author-box">
	   				<img src="${authorImg}" loading="lazy" alt="${authorName} - Mayple Quote" class="author-image">
		   			<div>
						<p class="no-margin"><strong>${authorName}</strong></p>
						<p class="font-sm no-margin">${authorTitle}</p>
					</div>
				</div>
				<div class="quote-content">
					<img src="https://assets-global.website-files.com/5a68f082ae5eb70001efdda4/6369f61ee696f03ad3376371_quote-icon.svg" loading="lazy" alt="">
					<p class="quote">${quote}</p>
				</div>
			</div>`

	    $(this).html(template);    
    });
}

if ($('p:contains("[Sticky Banner][")').length > 0) {
	$('.blog-grid-layout').append('<div class="sticky-banners-holder"></div>');
    $('p:contains("[Sticky Banner][")').each(function() {
	    let contentArray = $(this).html().split(']');
	    let headline = contentArray[1].substring(1);
	    let ctaText = contentArray[2].substring(1);
	    let ctaLink = contentArray[3].substring(1);
	    let themeClass = contentArray[4].substring(1);
	    let imageLink = contentArray[5].substring(1);
	    // [Sticky Banner][Top 250 Ad Creatives for Ecommerce Campaigns][Download Now][https://link.mayple.com/?start][black]
	    let isHidden = 'hidden';
	    if (imageLink.length > 1) {
	    	isHidden = '';
	    }

	    let template = `<div class="blog-sticky-banner ${themeClass}">
		    <h3 class="blog-sticky-banner-title">${headline}</h3>
		    <img src="${imageLink}" loading="lazy" alt="Mayple Quote" class="stick-banner-image ${isHidden}">
			<a href="${ctaLink}" class="blog-sticky-cta-button ${themeClass} w-button">${ctaText}</a>
		</div>`

	    $(this).html('');
	    $('.blog-grid-layout').addClass('with-sticky-banner');
	    $('.sticky-banners-holder').append(template);
    });
}

let blogsHench = {
	setTags: function() {
		$('.tags-holder').each(function(index, element) {
			let tags = $(this).html().split(',');
			console.log(tags);
		});
	}
}