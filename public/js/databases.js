$(document).ready(function() {


	$(".installed-databases__list__item").on("click", function(event) {
		//console.log("Нажали");
		var node = $(this).
		find("p").
		find(".installed-databases__list__item__dbname").
		find("input");
		if (!$(event.target).is(node)) {
			node.trigger("click");
		}

	});

});