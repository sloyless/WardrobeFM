angular.module("artistBio",[]).controller("artistListController",function(){var t=this;t.artists=[{text:"learn angular",done:!0},{text:"build an angular app",done:!1}],t.addArtist=function(){t.artists.push({text:t.artistText,done:!1}),t.artistText=""},t.remaining=function(){var a=0;return angular.forEach(t.artists,function(t){a+=t.done?0:1}),a}});