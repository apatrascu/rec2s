$(document).ready(function(){

	$(".active").removeClass("active");
	$("#status-lease").addClass("active");
	
	//add tooltips
	$(".view-lease-details").each(function(i,e){
		var table = $(this).find("div").html();
		$(this).simpletip({ 
			content: table,
			fixed: true, 
			position: 'left'
		});
	});
});