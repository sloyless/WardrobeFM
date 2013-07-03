$(document).ready(function() {
	var body = $('body'),
		header = $('#header'),
		results = false,
		form = $('#searchform'),
		resultsContainer = $('#resultscontainer'),
		artistInfo = $('#resultsRight div'),
		artistName = null,
		songkickArtistID = null,
		songkickAPIKey = 'pMie9zB5boSdFlPK';

	//event binding below
    
    form.on('submit', function(e) {
	    e.preventDefault(); //stops the default action
	    artistName = form.find('input[type="text"]').val();
	    if (artistName) {
		    if (results === false) { // has the form been submitted already?
			 	header.animate({"top": "-=260px"}, "slow"); // moves header to top on first successful search
			 	resultsContainer.fadeIn(1000); // Show the results container
		    }
		    requestArtist(artistName); 	//call to last.fm with artist name
	    }
    });

    function requestArtist(artistName) {
	    var url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistName + '&autocorrect=1&api_key=a522b32b563f5f3789bd76e86dd69930&format=json';
	    $.ajax({
			url: url,
			datatype: 'jsonp',
			cache: true,
			success: function(response) {
				updateView(response);
			},
			error: function(response) {
				console.log('Last.FM API Error: ', response);
			}
	    });
    };
    
    function updateView(data) {
		var lastFmData = $('#lastfmdata ul'),
			resultsHeading = $('#resultsheading h2'),
			resultsBio = $('#resultsbio p'),
			documentHeight = $(document).height(), // grabs the document height
	    	headerHeight = $("#container").height(), // grabs the height of the header
	    	resultsHeight = documentHeight - headerHeight; // sets the resultscontainer height
	    
	    resultsContainer.css('height', resultsHeight);
		results = true; // search has completed!
		console.log(data);
		
	    if (data.error !== 6) { // Last.FM's default error check
    		var artistBio = data.artist.bio.summary,
    			html = '',
    			pic = data.artist.image[4]['#text']; // The "mega" image;
    		
    		artistName = data.artist.name; // Change artistName to the proper Last.FM autocorrected Arist name

	        if (pic) { 
		        body.css('background', 'none'); // Clears the default background
		        body.css('background', 'url(' + pic + ') repeat'); // Sets the body background
	        }
	        
			resultsHeading.replaceWith('<h2>' + artistName + '</h2>'); // Heading
	        artistInfo.fadeIn('slow');
	        resultsBio.replaceWith('<p>' + artistBio + '</p>'); // Artist Bio
	        
	        // Lets grab the top 5 tags for this artist
	        if (data.artist.tags.tag) { // Do tags exist?
		        if (data.artist.tags.tag.length > 1) { // Check for more than 1 tag
			        $.each(data.artist.tags.tag, function(i, item) {
			            html += "<li>" + item.name + "</li>";
			        });
		        } else { // check for only 1 tag
			        html = '<li>' + data.artist.tags.tag.name + '</li>';
		        }
	        } else {
		        html = '<li>No tags exist for this artist</li>';
	        }
	        
	        getClothes();
	        
	        lastFmData.replaceWith('<ul>' + html + '</ul>');
	        
	        var artistNameString = artistName.split(' ').join('_'); // replace spaces with underscores for SongKick API
	        songkickRequestArtistID(artistNameString); // call to SongKick API
        } else {
	        artistInfo.fadeOut('slow');
	        lastFmData.replaceWith("<ul>Cannot find an artist by that name. Please search again.</ul>");
	        
        }
    };
    
    // SongKick API Calls below
    
    function songkickRequestArtistID(artistNameString) {
    	// Songkick's API only allows searches by the Artist ID, so first we must use that API to call the Artist ID text
	    var url = 'http://api.songkick.com/api/3.0/search/artists.json?location=clientip&query=' + artistNameString + '&apikey=' + songkickAPIKey + '&jsoncallback=?';
	    $.ajax({
		    url: url,
		    dataType: 'jsonp',
		    cache: true,
		    success: function(response) {
			    songkickArtistID = data.resultsPage.results.artist[0].id; // Put the Artist ID into a global variable
			    requestTours(songkickArtistID); // Got the ID, now let's grab the calendar events
		    },
		    error: function(response) {
			    console.log('Songkick Artist Search API error: ', response);
		    }
	    })
    }
   
    function requestTours(songkickArtistID) {
	    var url = 'http://api.songkick.com/api/3.0/artists/' + songkickArtistID + '/calendar.json?apikey=' + songkickAPIKey + '&jsoncallback=?';
	    $.ajax({
		    url: url,
		    dataType: 'jsonp',
		    cache: true,
		    success: function(response) {
			    console.log(response);
			    updateTour(response); // Got the events, let's update the Artist Info sidebar with the concert info
		    },
		    error: function(response) {
			    console.log('Songkick Calendar Search API error: ', response);
		    }
	    });
    };
    
    function updateTour(response) {
		var tours = $('#resultstours p'),lastFmData = $('#lastfmdata ul'),
			numEvents = response.resultsPage.totalEntries,
			songkickURL = 'http://www.songkick.com/search?query=' + artistName;
		if (numEvents === 1) {
			tours.replaceWith('<p>' + artistName + ' is currently on tour. There is ' + numEvents + ' upcoming show. Visit <a href="' + songkickURL + '" target="_blank">the SongKick Artist Page</a> for dates and ticket prices</p>');
		} else if (numEvents > 1) {
			tours.replaceWith('<p>' + artistName + ' is currently on tour. There are ' + numEvents + ' upcoming shows. Visit <a href="' + songkickURL + '" target="_blank">the SongKick Artist Page</a> for dates and ticket prices</p>');
		} else {
			tours.replaceWith('<p>' + artistName + ' has no upcoming concerts scheduled. Visit <a href="' + songkickURL + '" target="_blank">the SongKick Artist Page</a> more information.</p>');
		}
    }
    
    // mySQL database integration
    function getClothes() {
		var url = 'dbconnect.php',
			html = '',
			lastFmData = $('#lastfmdata');
		$.ajax({
			url: url,
			dataType: 'json',
			success: function(wardrobeDB) {
				console.log(wardrobeDB);
				for (n=0; n<wardrobeDB.items.length; n++) {
					html += '<p><img src=' + wardrobeDB.items[n].Image + ' /></p>';
				}
				lastFmData.append(html);
			},
			error: function(wardrobeDB) {
				console.log('DB Error: ', wardrobeDB);
			}
		})
    }
});