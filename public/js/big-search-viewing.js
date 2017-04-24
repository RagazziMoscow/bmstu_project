var viewProperties = {
	null: true
};

$(document).ready(function() {
	$('.properties-null-option input').on('click', function() {
		viewProperties.null = Boolean(Number($(this).val()));
	})
});

function view(data) {
	var source = $("#view-template").html();
	var template = Handlebars.compile(source);
	$("#results").html(template({
		data: data,
		properties: viewProperties
	}));
}