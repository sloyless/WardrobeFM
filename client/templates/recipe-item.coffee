Template.recipeItem.helpers
  path: ->
    Router.path 'recipe', @recipe

  highlightedClass: ->
    if @size == 'large'
      return 'highlighted'
    return
    
  bookmarkCount: ->
    count = BookmarkCounts.findOne(recipeName: @name)
    count and count.count