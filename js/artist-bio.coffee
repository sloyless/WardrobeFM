angular.module 'artistBio', []
  .controller('artistListController', ($scope, $sce) ->
    artistList = @
    artistList.artists = []

    artistList.addArtist = ->
      artistText = artistList.artistText
      artistNameString = artistText.split(' ').join('_')
      url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistText + '&autocorrect=1&api_key=a522b32b563f5f3789bd76e86dd69930&format=json'
      artistList.artists.push(
        text: artistText
      )
      @requestArtist = $.ajax(
        url: url,
        datatype: 'jsonp',
        cache: true,
        success: (data) ->
          console.log(data)
          $scope.artistBio = $sce.trustAsHtml(data.artist.bio.summary)
          artistList.artists.push(
            name: data.artist.name,
            pic: data.artist.image[2]['#text'],
            bio: data.artist.bio.summary
          )
        ,
        error: (data) -> 
          console.log('Last.FM API Error: ', data)
      )
      artistList.artistText = ''
      console.log(artistList)
  )

jQuery(document).ready ($) ->  