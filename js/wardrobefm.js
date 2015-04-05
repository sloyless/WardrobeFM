$(document).ready(function() {
	var body, results, form, searchContainer, resultsContainer, artistInfo, dbItemsContainer, fmTags, artistName, songkickAPIKey;

	body = $('body');
	results = false;
	form = $('#searchform');
	searchContainer = $('header');
	resultsContainer = $('#resultscontainer');
	artistInfo = $('#resultsRight div');
	dbItemsContainer = $('#items ul');
	fmTags = '';
	artistName = null;
	songkickAPIKey = 'pMie9zB5boSdFlPK';

	//event binding below

    form.on('submit', function(e) {
	    e.preventDefault(); //stops the default action
	    artistName = form.find('input[type="text"]').val();
	    if (artistName) {
		    if (results === false) { // has the form been submitted already?

			 	searchContainer.animate({"height": "30vh"}, "1000"); // moves header to top on first successful search
			 	resultsContainer.fadeIn(1000); // Show the results container
		    }
		    var artistNameString = artistName.split(' ').join('_'); // replace spaces with underscores for SongKick API;

		    dbItemsContainer.html(''); // Reset the results
		    artistInfo.fadeOut('fast'); // Fade out the artist sidebar
		    songkickArtistID(artistNameString); // call to SongKick API
		    requestArtist(artistName); 	// call to last.fm with artist name
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
    var url;

		results = true; // search has completed, don't animate the bar anymore

    url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistName + '&autocorrect=1&api_key=a522b32b563f5f3789bd76e86dd69930&format=json';

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
  }

  function updateView(data) {
		var resultsHeading, resultsBio;

		resultsHeading = $('#resultsheading h2');
		resultsBio = $('#resultsbio p');

		console.log('Last.FM API: ', data);

    if (data && data.error !== 6) { // Last.FM's default error check
			var fmTags, artistBio, pic;

  		artistName = data.artist.name; // Change artistName var to the proper Last.FM autocorrected Arist name
  		fmTags = data.artist.tags.tag;
  		artistBio = data.artist.bio.summary;
  		pic = data.artist.image[4]['#text']; // The "mega" image;

      if (pic) {
        body.css('background', 'none'); // Clears the default background
        body.css('background', 'url(' + pic + ') no-repeat center center fixed'); // Sets the body background
        body.css('background-size', 'cover');
      }

			resultsHeading.html(artistName); // Heading
			resultsBio.html(artistBio); // Artist Bio

			artistInfo.fadeIn(2000);

      // Lets run the search
      if (fmTags) { // Do tags exist?
        if (fmTags.length > 1) { // Check for more than 1 tag
					var fmTagsArray;

					fmTagsArray = [];

					$.each(fmTags, function(){
						fmTagsArray.push(this.name); // simplifying the array
					});
        } else { // check for only 1 tag
	        fmTagsArray = [fmTags.name];
        }
        getClothes(fmTagsArray); // run the mysql database search
      }
    } else {
      artistInfo.fadeOut('slow');
      dbItems.html("<ul><li>Cannot find an artist by that name. Please search again.</li></ul>");
    }
  }

  // SongKick API Calls below

  function songkickArtistID(artistNameString) {
  	// Songkick's API only allows searches by the Artist ID, so first we must use that API to call the Artist ID text
    var songkickArtistIDNum, url;

    songkickArtistIDNum = null,
		url = 'http://api.songkick.com/api/3.0/search/artists.json?location=clientip&query=' + artistNameString + '&apikey=' + songkickAPIKey + '&jsoncallback=?';
    $.ajax({
	    url: url,
	    dataType: 'jsonp',
	    cache: true,
	    success: function(response) {
		    songkickArtistIDNum = response.resultsPage.results.artist[0].id; // Put the Artist ID into a global variable
		    requestTours(songkickArtistIDNum); // Got the ID, now let's grab the calendar events
	    },
	    error: function(response) {
		    console.log('Songkick Artist Search API error: ', response);
	    }
    });
  }

  function requestTours(songkickArtistIDNum) {
    var url = 'http://api.songkick.com/api/3.0/artists/' + songkickArtistIDNum + '/calendar.json?apikey=' + songkickAPIKey + '&jsoncallback=?';
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
  }

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
		var url = 'dbconnect.php', // MySQL db connection
			unsortedArray = [],
			displayArray = [],
			html = '';

		$.ajax({
			url: url,
			dataType: 'json',
			success: function(dbItems) {

				$.each(dbItems.items, function(index, value){ // loop through db items
					var dbTags, dbImage, unsortedItems;

					dbTags = [this.Tag1, this.Tag2, this.Tag3, this.Tag4, this.Tag5];
					dbImage = this.Image;
					unsortedItems = compareArrays(fmTags, dbTags, dbImage); // Compares the db to lastFM tags

					if (unsortedItems !== undefined) {
						unsortedArray.push(unsortedItems);
					}
				});

				if (typeof unsortedArray !== undefined && unsortedArray.length > 0) {

					displayArray = unsortedArray.sort(function(a,b) { // Sort the array by highest score
						return parseInt(b.score,10) - parseInt(a.score,10);
					});

					console.log('Sorted array: ', displayArray);

					$.each(displayArray, function(){ // Loop through sorted results and put them on the page
						html += '<li class="item"><img src=' + this.image + ' /></li>';
					});
				} else {
					html += '<p>No items found in the database matching this artist. Please enter another artist or try again later.</p>';
				}
				dbItemsContainer.append(html);
			},
			error: function(dbItems) {
				console.log('DB Error: ', dbItems);
			}
		});
  }

  function compareArrays(fmTags, dbTags, dbImage) {
		var score;

		score = 0;

		if (fmTags.length > 1) { // Only run the db query for the number of tags Last.FM outputted
			for (var n=0; n<fmTags.length; n++) {
			    if ($.inArray(dbTags[n], fmTags) === 0) { // Do the tags in the first position of both arrays match?
					score += 40; // Higher score for immediate first tag match
				} else if ($.inArray(dbTags[n], fmTags) === 1) {
					score += 30;
				} else if ($.inArray(dbTags[n], fmTags) === 2) {
					score += 15;
				} else if ($.inArray(dbTags[n], fmTags) === 3) {
					score += 10;
				} else if ($.inArray(dbTags[n], fmTags) === 4) {
					score += 5;
				}
			}

			if (score !== 0) {
				var item = {score: score, image: dbImage};
				return item;
			}
		} else {
			if ($.inArray(dbTags[0], fmTags) === 0) {
				console.log('Only 1 tag');
				score = 100;
				var item = {score: score, image: dbImage};
				return item;
			}
		}
  }
});