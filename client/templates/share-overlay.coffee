TWEETING_KEY = 'shareOverlayTweeting'
IMAGE_KEY = 'shareOverlayAttachedImage'

Template.shareOverlay.onCreated ->
  Session.set TWEETING_KEY, true
  Session.set IMAGE_KEY, null
  return

Template.shareOverlay.helpers
  attachedImage: ->
    Session.get IMAGE_KEY
  avatar: ->
    Meteor.user().services.twitter.profile_image_url_https
  tweeting: ->
    Session.get TWEETING_KEY

Template.shareOverlay.events
  'click .js-attach-image': ->
    MeteorCamera.getPicture { width: 320 }, (error, data) ->
      if error
        alert error.reason
      else
        Session.set IMAGE_KEY, data
      return
    return

  'click .js-unattach-image': ->
    Session.set IMAGE_KEY, null
    return

  'change [name=tweeting]': (event) ->
    Session.set TWEETING_KEY, $(event.target).is(':checked')
    return

  'submit': (event, template) ->
    self = this
    event.preventDefault()
    text = $(event.target).find('[name=text]').val()
    tweet = Session.get(TWEETING_KEY)
    
    Meteor.call 'createActivity', {
      recipeName: self.name
      text: text
      image: Session.get(IMAGE_KEY)
    }, tweet, Geolocation.currentLocation(), (error, result) ->
      if error
        alert error.reason
      else
        Template.appBody.addNotification
          action: 'View'
          title: 'Your photo was shared.'
          callback: ->
            Router.go 'recipe', { name: self.name }, query: activityId: result
            Template.recipe.setTab 'feed'
            return
      return
      
    Overlay.close()
    return