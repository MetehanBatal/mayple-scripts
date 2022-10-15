function vaRegisterEvents() {
    va.registerTrackClickEvent('#top-navbar', 'Blogpost.Nav.Button', 'Clicked', '{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}');
    va.registerTrackClickEvent('#talk-tomm', 'Blogpost.BottomCTA.Button', 'Clicked', '{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}');
    va.registerTrackClickEvent('#sticky-cta-b', 'Blogpost.Skicky.Button', 'Clicked', '{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}');
}
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

function load_Remodal() {
    $('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.0/remodal.min.css">');
    $('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.0/remodal-default-theme.min.css">');
    let hubspotID = "{{wf {&quot;path&quot;:&quot;hubspot-form-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}";
    if (hubspotID.length > 0) {
        jQuery.ajax({
            url: "https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.0/remodal.min.js",
            dataType: "script",
            cache: true
        }).done(function() {
            hubspot_create_forms(hubspotID);
        });
    }
}

function hubspot_create_forms(hubspotID) {
    var url = "https://js.hsforms.net/forms/v2.js";
    $.getScript({ url: url, dataType: "script", cache: true }).done(function(s, Status) { hbspt.forms.create({ region: "na1", portalId: "4292856", formId: hubspotID, target: "[template-form-box]" }); })
}
$("[data-share='facebook']").on("click", function() {
    var fbpopup = window.open("https://www.facebook.com/sharer/sharer.php?u=https://mayple.com/blog/{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}", "pop", "width=600, height=400, scrollbars=no");
    return false;
});
$("[data-share='linkedin']").on("click", function() {
    var linkedin = window.open("https://www.linkedin.com/sharing/share-offsite/?mini=true&url=https://mayple.com/blog/{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}", "pop", "width=600, height=400, scrollbars=no");
    return false;
});
$("[data-share='twitter']").on("click", function() {
    var twitter = window.open("https://twitter.com/intent/tweet?text=Discover%20your%20aura%20at%20https://mayple.com/blog/{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}/colours%20pic.twitter.com/xTreZlYNJh%20@carolynalive", "pop", "width=600, height=400, scrollbars=no");
    return false;
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
