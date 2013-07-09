$(document).ready(function() {
	var body = $('body'),
		results = false,
		form = $('#searchform'),
		searchContainer = $('#searchContainer'),
		resultsContainer = $('#resultscontainer'),
		artistInfo = $('#resultsRight div'),
		dbItemsContainer = $('#items ul'),
		fmTags = '',			    
		artistName = null,
		songkickAPIKey = 'pMie9zB5boSdFlPK';

	//event binding below
    
    form.on('submit', function(e) {
	    e.preventDefault(); //stops the default action
	    artistName = form.find('input[type="text"]').val();
	    if (artistName) {
		    if (results === false) { // has the form been submitted already?
			 	var documentHeight = $(document).height(), // grabs the document height
					resultsHeight = documentHeight - searchContainer.height(); // sets the resultscontainer height

			 	searchContainer.animate({"top": "-=210px"}, "1000"); // moves header to top on first successful search
			 	resultsContainer.css('height', resultsHeight);
			 	resultsContainer.fadeIn(1000); // Show the results container
		    }
		    var artistNameString = artistName.split(' ').join('_'); // replace spaces with underscores for SongKick API;
		    
		    artistInfo.fadeOut('fast');
		    songkickArtistID(artistNameString); // call to SongKick API
		    requestArtist(artistName); 	//call to last.fm with artist name
	    }
    });
	
	// Ajax loading animation
	$("body").on({
	    ajaxStart: function() { 
	        $(this).addClass("loading"); 
	    },
	    ajaxStop: function() { 
	        $(this).removeClass("loading"); 
	    }    
	});
	
    function requestArtist(artistName) {
		results = true; // search has completed, don't animate the bar anymore
	    
	    var url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistName + '&autocorrect=1&api_key=a522b32b563f5f3789bd76e86dd69930&format=json';

	    $.ajax({
			url: url,
			datatype: 'jsonp',
			cache: true,
			success: function(response) {
				updateView(response);
			},
			error: function(response) {
				dbItems.html('<li><p>Last.FM is unavailable at this time. Please try again later. ' + response.status + ': ' + response.statusText) + '</p></li>';
				console.log('Last.FM API Error: ', response);
			}
	    });
    };
    
    function updateView(data) {
		var resultsHeading = $('#resultsheading h2'),
			resultsBio = $('#resultsbio p');
	    
		console.log('Last.FM API: ', data);
		
	    if (data && data.error !== 6) { // Last.FM's default error check
    		artistName = data.artist.name; // Change artistName to the proper Last.FM autocorrected Arist name
    		
    		var fmTags = data.artist.tags.tag,
    			artistBio = data.artist.bio.summary,    			
    			pic = data.artist.image[4]['#text']; // The "mega" image; 
	        
	        if (pic) { 
		        body.css('background', 'none'); // Clears the default background
		        body.css('background', 'url(' + pic + ') repeat'); // Sets the body background
	        }
	        
			resultsHeading.html(artistName); // Heading
	        resultsBio.html(artistBio); // Artist Bio
			
			artistInfo.fadeIn(2000);
	        
	        // Lets run the search
	        if (fmTags) { // Do tags exist?
		        if (fmTags.length > 1) { // Check for more than 1 tag
					var fmTagsArray = [];
					for (n=0; n<fmTags.length; n++) {
						fmTagsArray.push(fmTags[n].name); // simplifying the array
					}
		        } else { // check for only 1 tag
			        fmTagsArray = fmTags.name;
		        }
		        getClothes(fmTagsArray); // run the mysql database search
	        }
	        
        } else {
	        artistInfo.fadeOut('slow');
	        dbItems.html("<ul><li>Cannot find an artist by that name. Please search again.</li></ul>");
        }
    };
    
    // SongKick API Calls below
    
    function songkickArtistID(artistNameString) {
    	// Songkick's API only allows searches by the Artist ID, so first we must use that API to call the Artist ID text
	    var songkickArtistID = null,
			url = 'http://api.songkick.com/api/3.0/search/artists.json?location=clientip&query=' + artistNameString + '&apikey=' + songkickAPIKey + '&jsoncallback=?';
	    $.ajax({
		    url: url,
		    dataType: 'jsonp',
		    cache: true,
		    success: function(response) {
			    songkickArtistID = response.resultsPage.results.artist[0].id; // Put the Artist ID into a global variable
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
			    console.log('Songkick API: ', response);
			    updateTour(response); // Got the events, let's update the Artist Info sidebar with the concert info
		    },
		    error: function(response) {
			    console.log('Songkick Calendar Search API error: ', response);
		    }
	    });
    };
    
    function updateTour(response) {
		var tours = $('#resultstours p'),
			numEvents = response.resultsPage.totalEntries,
			songkickURL = 'Visit <a href="http://www.songkick.com/search?query=' + artistName + '" target="_blank">the SongKick Artist Page</a> for more information.</p>';
		
		if (numEvents === 1) {
			tours.html('<p>' + artistName + ' is currently on tour. There is ' + numEvents + ' upcoming show. ' + songkickURL);
		} else if (numEvents > 1) {
			tours.html('<p>' + artistName + ' is currently on tour. There are ' + numEvents + ' upcoming shows. ' + songkickURL);
		} else {
			tours.html('<p>' + artistName + ' has no upcoming concerts scheduled. ' + songkickURL);
		}
    }
    
    // mySQL database integration
    function getClothes(fmTags) {
		var url = 'dbconnect.php'; // MySQL db connection
		
		$.ajax({
			url: url,
			dataType: 'json',
			success: function(dbItems) {
				console.log(dbItems);
				for (i=0; i<dbItems.items.length; i++) {
					var dbTags = [dbItems.items[i].Tag1, dbItems.items[i].Tag2, dbItems.items[i].Tag3, dbItems.items[i].Tag4, dbItems.items[i].Tag5],
						dbImage = [dbItems.items[i].Image];
						
					compareArrays(fmTags, dbTags, dbImage);
				}
			},
			error: function(dbItems) {
				console.log('DB Error: ', dbItems);
			}
		});
    }
    
    function compareArrays(fmTags, dbTags, dbImage) {
		var html = '',
			score = 0;
			
			console.log(fmTags);
			console.log(dbTags);
			console.log(dbImage);
			
		
		if (fmTags.length > 1) {
			// Run each tag through the database json and output the first image that matches the first tag, then second, then third and so on.
			for (n=0; n<fmTags.length; n++) {
			    if ($.inArray(dbTags[n], fmTags) === 0) {
					console.log('Tag #' + n + ': ' + dbTags[n] + ' is the first item in the array!');
					score += 40; // Higher score for immediate first tag match
				} else if ($.inArray(dbTags[n], fmTags) === 1) {
					console.log('Tag #' + n + ': '  + dbTags[n] + ' is the second item in the array!');
					score += 30;
				} else if ($.inArray(dbTags[n], fmTags) === 2) {
					console.log('Tag #' + n + ': '  + dbTags[n] + ' is the third item in the array!');
					score += 15;
				} else if ($.inArray(dbTags[n], fmTags) === 3) {
					console.log('Tag #' + n + ': '  + dbTags[n] + ' is the fourth item in the array!');
					score += 10;
				} else if ($.inArray(dbTags[n], fmTags) === 4) {
					console.log('Tag #' + n + ': '  + dbTags[n] + ' is the fifth item in the array!');
					score += 5;
				} else {
					console.log('No matches for ' + dbTags[n]);
				}
				
			}
			if (score === 100) {
				html += '<li class="item"><img src=' + dbImage + ' /></li>';	
			}
			
			console.log(score);
			dbItemsContainer.append(html);
			
		} else {
			if (fmTags === dbTags) {
				console.log('Only 1 tag');
			}
		}
    }
});