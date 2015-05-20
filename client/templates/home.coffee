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