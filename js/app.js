var createPost, postContent;

angular.module('wardrobeFM', []);

createPost = function($scope, $sce) {
  var postArtists;
  $scope.trustAsHtml = $sce.trustAsHtml;
  $scope.postContent = postContent;
  postArtists = this;
  postArtists.artists = [];
  return postArtists.addArtist = function() {
    var artistText, lastFMjson, url;
    artistText = postArtists.text;
    url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistText + '&autocorrect=1&api_key=a522b32b563f5f3789bd76e86dd69930&format=json';
    lastFMjson = $.ajax({
      url: url,
      datatype: 'jsonp',
      cache: true,
      async: false,
      success: function(data) {
        return console.log(data);
      },
      error: function(data) {
        return console.log('Last.FM API Error: ', data);
      }
    }).responseJSON;
    $scope.postContent.postArtists.artists.push({
      'id': $scope.postContent.postArtists.artists.length + 1,
      'text': artistText,
      'name': lastFMjson.artist.name,
      'pic': lastFMjson.artist.image[2]['#text'],
      'bio': lastFMjson.artist.bio.summary
    });
    postArtists.text = '';
    return console.log($scope.postContent);
  };
};

angular.module('wardrobeFM').controller('createPost', createPost);

postContent = {
  'postId': 'post-0',
  'datestamp': 'Friday, April 10, 2015 at 12:31 AM',
  'user': {
    'id': 'user-1',
    'name': 'Sean Loyless',
    'description': 'Just this guy, you know?',
    'location': 'Austin, TX',
    'avatarSrc': '/images/demo/avatar.jpg'
  },
  'postImage': {
    'src': '/images/demo/postimage.jpg'
  },
  'postCaption': {
    'text': ''
  },
  'postArtists': {
    'artists': []
  }
};
