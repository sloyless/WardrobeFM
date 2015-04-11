function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div data-module=\"post-artist-tags\" ng-repeat=\"post in postContent\"><ul class=\"nolist\"><li ng-repeat=\"artist in postContent.postArtists.artists\" class=\"tag\"><a href=\"#\">{{artist.name}}</a></li></ul></div>");;return buf.join("");
}