let globalHench = {
	loadWistia: function(array) {
		array.forEach(function(video) {
			console.log( 'Video: ', video );
			const { url, container, lazyLoad } = { video.url, video.container, video.lazyLoad };
		});
	}
}