$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		// $('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
	$('.inspiration-getter').submit(function(event){
		var tags = $(this).find("input[name='answerers']").val();
		topAnswerer(tags);
	});
});

// this function takes the question object returned by StackOverflow
// and creates new result to be appended to DOM
var showQuestion = function(question) {

	// clone our result template code
	var result = $('.templates .question').clone();

	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +	question.owner.display_name + '</a>' + '</p>' +	'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

// ADDED BY MARS
var showAnswerer = function(answerer) {

	// clone our result template code
	var result = $('.templates .answerer').clone();

	// Set answerer properties in the results
	var nameElem = result.find('.answerer-name a');
	nameElem.attr('href', answerer.user.link);
	nameElem.text(answerer.user.displ);

	var rep = result.find('.answerer-rep');
	rep.text(answerer.user.reputation);

	var acceptRate = result.find('.answerer-accept-rate');
	if(answerer.user.accept_rate == undefined) {
		acceptRate.text('0');
	} else {
		acceptRate.text(answerer.user.accept_rate);
	}
	var profileImage = result.find('.answerer-profile-img img');
	profileImage.attr('src', answerer.user.profile_image);

	return result;

};

// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	$('.results').html('');
	var results = resultNum + ' results for <strong>' + query + "</strong>";
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {

	// the parameters we need to pass in our request to StackOverflow's API
	var request = {
					tagged: tags,
					site: 'stackoverflow',
					order: 'desc',
					sort: 'creation'
				};

	var result = $.ajax({
					url: "http://api.stackexchange.com/2.2/questions/unanswered",
					data: request,
					dataType: "jsonp",
					type: "GET",
				})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var unanswered = showQuestion(item);
			$('.results').append(unanswered);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

//  CODE I'M ADDING TO STARTER
var topAnswerer = function(tags) {
	var request = {
				tagged: tags,
				site: 'stackoverflow'
				};

	var result = $.ajax({
					url: 'http://api.stackexchange.com/2.2/tags/' + request.tagged + '/top-answerers/all_time',
					data: request,
					dataType: "jsonp",
					type: "GET",
					})

	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var answerer = showAnswerer(item);
			$('.results').append(answerer);
		});

	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};
