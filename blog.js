function vaRegisterEvents(){
va.registerTrackClickEvent('#top-navbar', 'Blogpost.Nav.Button', 'Clicked', '{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}');
va.registerTrackClickEvent('#talk-tomm', 'Blogpost.BottomCTA.Button', 'Clicked', '{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}');
va.registerTrackClickEvent('#sticky-cta-b', 'Blogpost.Skicky.Button', 'Clicked', '{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}');
}
if ('{{wf {&quot;path&quot;:&quot;blog-categories:name&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}' === 'Top experts') {
let allQuestions = $('.faq-rtb h2');
let schema = {
"@context": "https://schema.org",
"@type": "FAQPage",
"mainEntity": []
}
allQuestions.each(function(index) {
let newQuestion = {};
newQuestion['@type'] = "Question";
newQuestion['name'] = $(this).html();
let acceptedAnswer = {};
acceptedAnswer['@type'] = "Answer";
acceptedAnswer['text'] = $(this).next('p').html();
newQuestion.acceptedAnswer = acceptedAnswer;
schema.mainEntity.push(newQuestion);
if (index === allQuestions.length - 1) {
var s = document.createElement('script');
s.setAttribute('type', 'application/ld+json');
s.textContent = JSON.stringify(schema);
document.body.appendChild(s);
}
});
}
(function () {
function logElementEvent(eventName, element) {
}
var callback_enter = function (element) {
logElementEvent("🔑 ENTERED", element);
};
var callback_loading = function (element) {
logElementEvent("⌚ LOADING", element);
};
var callback_loaded = function (element) {
logElementEvent("👍 LOADED", element);
};
var callback_error = function (element) {
logElementEvent("💀 ERROR", element);
};
var callback_finish = function () {
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
function makeIds () {var content = document.querySelector('[rich-text-block]');var headings = content.querySelectorAll('h2, h3');var headingMap = {};Array.prototype.forEach.call(headings, function (heading) {var id = heading.textContent.trim().toLowerCase().split(' ').join('-').replace(/[!@#$%^&*():]/ig, '').replace(/\//ig, '-');headingMap[id] = !isNaN(headingMap[id]) ? ++headingMap[id] : 0;heading.id = id})}makeIds();
window.addEventListener('DOMContentLoaded', (event) => {
$('.agency-card-copy').click(function(){window.location.href="https://mayple.com/welcome-v4"});
let scoring = [
{
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
"wording": "Good"},{"score": "9.4","wording": "Good"},{"score": "9.3","wording": "Good"},{"score": "9.3","wording": "Good"},{"score": "9.3","wording": "Good"}];
if(!$('.top-experts-layout.conditional').hasClass('w-condition-invisible')) {
$('.top-expert-card').each(function(index, element, array) {
if (scoring.length > index) {
$(this).find('.agency-score-text').html(scoring[index].score);
$(this).find('.agency-score-wording').html(scoring[index].wording);
}
});
}
if ('{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}' === 'ecommerce-marketing-agency') {$('.ecormmerce-agency-table-wrapper').insertBefore('#reason');}
load_Remodal();
});
function load_Remodal(){
$('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.0/remodal.min.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.0/remodal-default-theme.min.css">');
let hubspotID = "{{wf {&quot;path&quot;:&quot;hubspot-form-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}";
if(hubspotID.length > 0){
jQuery.ajax({
url: "https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.0/remodal.min.js",
dataType: "script",
cache: true
}).done(function() {
hubspot_create_forms(hubspotID);
});}}
function hubspot_create_forms(hubspotID){
var url = "https://js.hsforms.net/forms/v2.js";$.getScript({url: url,dataType: "script",cache: true}).done(function( s, Status ) {hbspt.forms.create({region: "na1",portalId: "4292856",formId: hubspotID,target: "[template-form-box]"});})}

$("[data-share='facebook']").on("click",function(){
var fbpopup = window.open("https://www.facebook.com/sharer/sharer.php?u=https://mayple.com/blog/{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}", "pop", "width=600, height=400, scrollbars=no");
return false;
});
$("[data-share='linkedin']").on("click",function(){
var linkedin = window.open("https://www.linkedin.com/sharing/share-offsite/?mini=true&url=https://mayple.com/blog/{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}", "pop", "width=600, height=400, scrollbars=no");
return false;
});
$("[data-share='twitter']").on("click",function(){
var twitter = window.open("https://twitter.com/intent/tweet?text=Discover%20your%20aura%20at%20https://mayple.com/blog/{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}/colours%20pic.twitter.com/xTreZlYNJh%20@carolynalive", "pop", "width=600, height=400, scrollbars=no");
return false;
});
$("[data-share='copy_url']").on("click",function(){
navigator.clipboard.writeText(window.location.href);
});
if($("article h2").length  < 3){
$("[toc-wrapper]").hide();
}
let noFollowLinks = $( "a[target*='_blank']" );
noFollowLinks.each(function() {
if(!$(this).attr('href').includes('mayple.com')) {
$(this).attr('rel', 'nofollow');
}
});
document.querySelectorAll('.banner-code').forEach(function(banner, index) {
$('p:contains("[Add Banner Here]")').eq(0).replaceWith('<div class="blog-banner-holder"></div>');
$( banner.textContent ).appendTo($('.blog-banner-holder').eq(index));
});



if ({{wf {&quot;path&quot;:&quot;is-hire-page&quot;,&quot;type&quot;:&quot;Bool&quot;\} }} || {{wf {&quot;path&quot;:&quot;is-hire-page&quot;,&quot;type&quot;:&quot;Bool&quot;\} }} === 'true') {
document.addEventListener('DOMContentLoaded', (event) => {
jQuery.ajax({
url: 'https://cdn.jsdelivr.net/npm/typed.js@2.0.9',
dataType: "script",
cache: true
}).done(function() {
var typed = new Typed("[data-type-js]", {
strings: [
"<span class='type_js' style=''>{{wf {&quot;path&quot;:&quot;hero-changeable-text-sentence-1&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</span>",
"<span class='type_js' style=''>{{wf {&quot;path&quot;:&quot;hero-changeable-text-sentence-2&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</span>",
"<span class='type_js' style=''>{{wf {&quot;path&quot;:&quot;hero-changeable-text-sentence-3&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</span>",
"<span class='type_js' style=''>{{wf {&quot;path&quot;:&quot;hero-changeable-text-sentence-4&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}</span>"
],
loop: true,
fadeOut: true,
showCursor: true,
typeSpeed: 60
});
});
jQuery.ajax({
url: 'https://cdn.jsdelivr.net/npm/beefup@1.4.4/dist/js/jquery.beefup.min.js',
dataType: "script",
cache: true
}).done(function() {
var options = $("#select_menu option");
$( "#placeholder" ).append( '<select id="hire" option="selector" name="hire" onchange="window.location = this.options[this.selectedIndex].value"></select>');
$.each( options, function( i, item ) {
$( "#placeholder select" ).append( item );
});
$('#accordion h2').each(function(){
$(this)
.nextUntil("h2")
.addBack()
.wrapAll('<div class="beefup" />');
$(this)
.nextUntil("h2")
.wrapAll('<div class="beefup__body" />');
$(this).wrap('<div class="beefup__head" />');
});
var $beefup = $('.beefup').beefup({
openSingle: true,
scroll: false,
hash: false,
selfBlock: false,
selfClose: true,
scrollOffset: -90
});
$('[data-tabs] h2').each(function(){
$(this)
.nextUntil("h2")
.addBack()
.wrapAll('<div class="js-tabs__content" />');
});
$( "[data-tabs] h2" ).each(function() {
let txt = $( this ).text();
$("#dynamic").append( `<div class="hire-list-item"><a class="js-tabs__title" href="#"> ${txt} </a></div>` );
});
});
var tabs = new Tabs({elem: 'tabs',open: 0});});
document.addEventListener('DOMContentLoaded', (event) => {
jQuery.ajax({
url: "https://unpkg.com/swiper@7.4.1/swiper-bundle.min.js",
dataType: "script",
cache: true
}).done(function() {
install_swiper();
});
});
install_swiper = () => {
const swiper = new Swiper(".swiper", {
slidesPerView: 2.5,
centeredSlides: true,
loop: true,
slideToClickedSlide: true,
spaceBetween: 20,
pagination: {
el: ".swiper-pagination",
clickable: true,
},
navigation: {
nextEl: '[swiper-custom-next]',
prevEl: '[swiper-custom-prev]',
},
breakpoints: {
0: {
slidesPerView: 1.25,
spaceBetween: 10,
},
767: {
slidesPerView: 2,
spaceBetween: 15,
},
988: {
slidesPerView: 2.5,
spaceBetween: 20,
}
}
});
swiper.slideNext();
if( "{{wf {&quot;path&quot;:&quot;brief-key&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}".length > 0 ) {
localStorage.setItem('mayple_marketing_channel', "{{wf {&quot;path&quot;:&quot;brief-key&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}");
}
$('.js-tabs__content').addClass('hidden');
$('.js-tabs__content').eq(0).removeClass('hidden');
$('.hire-list-item').click(function() {
let index = $(this).index();
$('.js-tabs__content').addClass('hidden');
$('.js-tabs__content').eq(index).removeClass('hidden');
$('.js-tabs__title').removeClass('js-tabs__title-active');
$(this + ' .js-tabs__title').addClass('js-tabs__title-active');
});
}}
tocbot.init({tocSelector: '[render-tocbot-here]',contentSelector: '[rich-text-block]',headingSelector: 'h2',orderedList: false,ignoreHiddenElements: true});
