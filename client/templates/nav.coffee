Template.nav.onRendered ->
  $nav = @$('nav')
  $nav.siblings('.content-scrollable:not(.static-nav)').children().first().waypoint ((direction) ->
    $nav.toggleClass 'scrolled', direction == 'down'
    return
  ),
    context: '.content-scrollable'
    offset: -200
  return

Template.nav.helpers back: ->
  @back and !history.state.initial