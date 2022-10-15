
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
    let contentArray = $('p:contains("[Banner][")').eq(0).html().split(']');
    let headline = array[1].substring(1);
    let description = array[2].substring(1);
    let ctaText = array[3].substring(1);
    let themeClass = 'new-red-gradient';

    if (array[4] && array[4] === 'blue') {
        themeClass = 'new-red-blue-gradient-copy';
    }

    let template = `<div class="b-card new-bcard flex-bcard red-grad-bg no-flex ${themeClass}">
	    <div class="b-card-content text-only">
	        <h2 class="b-card-headline b-card-head-black text-only-head">${headline}</h2>
	        <p class="paragraph-954915">${description}</p>
	        <a href="https://www.mayple.com/welcome-v4/?utm_content=blog-banner-hire-an-ecommerce-marketer" target="_blank" class="w-inline-block">
	            <div class="cta-button-blog get-it-now red-button">
	                <h4 class="heading-174">${ctaText}</h4><img src="https://assets-global.website-files.com/5a68f082ae5eb70001efdda4/62c426f08db421f3e9b73ee9_white-arrow.svg" loading="lazy" alt="">
	            </div>
	        </a>
	    </div>
	</div>`

    $('p:contains("[Banner][")').eq(0).html(template);
}
