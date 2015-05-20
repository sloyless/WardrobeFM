Template.feed.helpers
  activities: ->
    Activities.find {}, sort: date: -1
    
  ready: ->
    Router.current().feedSubscription.ready()