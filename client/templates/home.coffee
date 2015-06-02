FEATURED_COUNT = 4

Template.home.helpers
  featuredRecipes: ->
    recipes = _.values(RecipesData)
    selection = []
    i = 0
    while i < FEATURED_COUNT
      selection.push recipes.splice(_.random(recipes.length - 1), 1)[0]
      i++
    selection

  activities: ->
    Activities.latest()

  latestNews: ->
    News.latest()

Template.home.events
  'click .js-add-bookmark': (event) ->
    event.preventDefault()
    if !Meteor.userId()
      return Overlay.open('authOverlay')
    Meteor.call 'bookmarkRecipe', @name
    return

  'click .js-remove-bookmark': (event) ->
    event.preventDefault()
    Meteor.call 'unbookmarkRecipe', @name
    return

  'click .js-show-recipe': (event) ->
    event.stopPropagation()
    Template.home.setTab 'make'
    return

  'click .js-show-feed': (event) ->
    event.stopPropagation()
    Template.home.setTab 'feed'
    return

  'click .js-uncollapse': ->
    Template.home.setTab 'recipe'
    return
    
  'click .js-share': ->
    Overlay.open 'shareOverlay', this
    return