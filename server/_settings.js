// Provide defaults for Meteor.settings
//
// To configure your own Twitter keys, see:
//   https://github.com/meteor/meteor/wiki/Configuring-Twitter-in-Local-Market
if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

_.defaults(Meteor.settings, {
  twitter: {
    consumerKey: "4x2yxTTf9Ul3UeTFx6aFZTW42", 
    secret: "KRyb7IliVqMSTbNcjPLzxQ8wEYvg4uJ1Us6kZmnG1k6IgwbWqx"
  }
});

ServiceConfiguration.configurations.upsert(
  { service: "twitter" },
  {
    $set: {
      consumerKey: Meteor.settings.twitter.consumerKey,
      secret: Meteor.settings.twitter.secret
    }
  }
);
