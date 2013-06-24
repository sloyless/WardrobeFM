$(document).ready(function() {
	var body = $('body'),
		header = $('#header'),
		results = false,
		resultsContainer = $('#resultscontainer'),
		form = $('#searchform'),
		artistName = null;

    function requestArtist(artistName) {
	    var url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistName + '&autocorrect=1&api_key=a522b32b563f5f3789bd76e86dd69930&format=json';
	    $.ajax({
			url: url,
			success: function(response) {
				updateView(response);
			},
			error: function(response) {
				console.log('error', response);
			}
	    });
    };
    
    function updateView(data) {
		var lastFmData = $('#lastfmdata ul');
		results = true; // search has completed!
		console.log(data);
	    if (data.error !== 6) { // Last.FM's default error check
    		var artistName = data.artist.name,
    			html = '',
    			resultsHeading = $('#resultsheading h2'),
    			pic = data.artist.image[4]['#text']; // The "mega" image;

	        if (pic) { 
		        body.css('background', 'none'); // Clears the default background
		        body.css('background', 'url(' + pic + ') repeat'); // Sets the body background
	        }
	        
			resultsHeading.replaceWith('<h2>Search results for ' + artistName + '</h2>'); // Heading
	        
	        // Lets grab the top 5 tags for this artist
	        $.each(data.artist.tags.tag, function(i, item) {
	            html += "<li>" + item.name + "</li>";
	        });
	        
	        lastFmData.replaceWith('<ul>' + html + '</ul>');
        } else {
	        lastFmData.replaceWith("<ul>Cannot find an artist by that name. Please search again.</ul>");
			
        }
    };
    
    //event binding below
    
    form.on('submit', function(e) {
	    e.preventDefault(); //stops the default action
	    artistName = form.find('input[type="text"]').val();
	    if (artistName) {
		    if (results === false) { // has the form been submitted already?
			 	header.animate({"top": "-=280px"}, "slow"); // moves header to top on first successful search
			 	resultsContainer.fadeIn(1000); // Show the results container
		    }
		    requestArtist(artistName); 	//call to last.fm with artist name
	    } else {
		    //error handling
	    }
    });
});