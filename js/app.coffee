angular.module 'wardrobeFM', []

createPost = ($scope, $sce) ->
  $scope.trustAsHtml = $sce.trustAsHtml

  postContent = [
    postId: 'post-0',
    datestamp: '20150408',
    user:
      id: 'user-1',
      name: 'Sean Loyless',
      description: 'Just this guy, you know?',
      location: 'Austin, TX'
    ,
    postImage:
      images:
        id: 'image-1',
        src: '/images/'
    ,
    postArtists:
      artists: ''
    ,
    postCaption:
      text: 'Title of photo'
  ]

  artistText = postContent.postArtists.text

  postContent.addArtist = ->
    
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

  postContent.artistList.artists.push(
    id: postContent.postArtists.artists.length + 1
    text: artistText,
    name: lastFMjson.artist.name,
    pic: lastFMjson.artist.image[2]['#text'],
    bio: lastFMjson.artist.bio.summary
  )
  postContent.artistList.artistText = ''

angular
  .module 'wardrobeFM'
  .controller 'createPost', createPost
