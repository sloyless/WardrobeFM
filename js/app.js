// Generated by CoffeeScript 1.8.0
(function() {
  var createPost;

  angular.module('wardrobeFM', []);

  createPost = function($scope, $sce) {
    var artistText, postContent;
    $scope.trustAsHtml = $sce.trustAsHtml;
    postContent = [
      {
        postId: 'post-0',
        datestamp: '20150408',
        user: {
          id: 'user-1',
          name: 'Sean Loyless',
          description: 'Just this guy, you know?',
          location: 'Austin, TX'
        },
        postImage: {
          images: {
            id: 'image-1',
            src: '/images/'
          }
        },
        postArtists: {
          artists: ''
        },
        postCaption: {
          text: 'Title of photo'
        }
      }
    ];
    artistText = postContent.postArtists.text;
    postContent.addArtist = function() {
      var lastFMjson, url;
      url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistText + '&autocorrect=1&api_key=a522b32b563f5f3789bd76e86dd69930&format=json';
      return lastFMjson = $.ajax({
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
    };
    postContent.artistList.artists.push({
      id: postContent.postArtists.artists.length + 1,
      text: artistText,
      name: lastFMjson.artist.name,
      pic: lastFMjson.artist.image[2]['#text'],
      bio: lastFMjson.artist.bio.summary
    });
    return postContent.artistList.artistText = '';
  };

  angular.module('wardrobeFM').controller('createPost', createPost);

}).call(this);


//# sourceMappingURL=app.js.map
