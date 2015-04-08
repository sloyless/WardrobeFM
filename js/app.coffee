angular.module 'wardrobeFM', []

artistBio = ($scope, $sce) ->
  $scope.trustAsHtml = $sce.trustAsHtml
  artistList = @
  artistList.artists = []

  artistList.addArtist = ->
    artistText = artistList.artistText
    #artistNameString = artistText.split(' ').join('_')
    url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistText + '&autocorrect=1&api_key=a522b32b563f5f3789bd76e86dd69930&format=json'
    lastFMjson = $.ajax(
      url: url,
      datatype: 'jsonp',
      cache: true,
      async: false,
      success: (data) ->
        console.log(data)
      ,
      error: (data) ->
        console.log('Last.FM API Error: ', data)
    ).responseJSON

    artistList.artists.push(
      id: artistList.artists.length + 1
      text: artistText,
      name: lastFMjson.artist.name,
      pic: lastFMjson.artist.image[2]['#text'],
      bio: lastFMjson.artist.bio.summary
    )
    artistList.artistText = ''

angular
  .module 'wardrobeFM'
  .controller 'artistListController', artistBio