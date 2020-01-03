$(document).ready(function() {
	let visible = false;
	let showPupup = setTimeout(function() {
		$('#banner').css('visibility', 'visible');
		visible = true;
	}, 10000)
	$('#banner .close').click(function(event) {
		$('#banner').css('visibility', 'hidden');
		visible = false;
	});
	$('.main-btn').click(function(event) {
		if (!visible) {
			$('#banner').css('visibility', 'visible');
			$('.main-btn a').css('visibility', 'visible');
			visible = true;
		} else {
			$('#banner').css('visibility', 'hidden');
			$('.main-btn a').css('visibility', 'hidden');
			visible = false;
		}
	});
});