//mysql_db: haggis_wardrobefm
//mysql_login: haggis_wardrobef
//mysql_pw: %TdU!q#m(T)^

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
		var lastFmData = $('#lastfmdata ul'),
			artistInfo = $('#resultsRight div'),
			documentHeight = $(document).height(), // grabs the document height
	    	headerHeight = $("#container").height(), // grabs the height of the header
	    	resultsHeight = documentHeight - headerHeight; // sets the resultscontainer height
	    resultsContainer.css('height', resultsHeight);
		results = true; // search has completed!
		console.log(data);
	    if (data.error !== 6) { // Last.FM's default error check
    		var artistName = data.artist.name,
    			artistBio = data.artist.bio.summary,
    			html = '',
    			resultsHeading = $('#resultsheading h2'),
    			resultsBio = $('#resultsbio p'),
    			pic = data.artist.image[4]['#text']; // The "mega" image;

	        if (pic) { 
		        body.css('background', 'none'); // Clears the default background
		        body.css('background', 'url(' + pic + ') repeat'); // Sets the body background
	        }
	        
			resultsHeading.replaceWith('<h2>' + artistName + '</h2>'); // Heading
	        resultsBio.replaceWith('<p>' + artistBio + '</p>');
	        // Lets grab the top 5 tags for this artist
	        $.each(data.artist.tags.tag, function(i, item) {
	            html += "<li>" + item.name + "</li>";
	        });
	        
	        //getClothes();
	        
	        lastFmData.replaceWith('<ul>' + html + '</ul>');
        } else {
	        lastFmData.replaceWith("<ul>Cannot find an artist by that name. Please search again.</ul>");
			
        }
    };
    
    function getClothes() {

    }
    
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