Template.activity.onRendered ->
  self = this
  # If the activity is in a list, scroll it into view. Note, we can't just use element.scrollIntoView() because it attempts to scroll in the X direction messing up our animations
  if Router.current().params.activityId == self.data._id
    $activity = $ self.firstNode
    top = $activity.offset().top
    $parent = $(self.firstNode).closest '.content-scrollable'
    parentTop = $parent.offset().top
    $parent.scrollTop top - parentTop
  return
Template.activity.helpers
  userName: ->
    @userName
  postDate: ->
    moment(@date).calendar()
  path: ->
    Router.path 'recipe', { name: @recipeName }, query: activityId: @_id