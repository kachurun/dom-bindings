

module.exports = function(suite, testName, domBindings) {
  function generateItems(amount, hasChildren) {
    const items = []
    while (amount--) { // eslint-disable-line
      items.push({
        name: `foo ${Math.random()}`,
        props: hasChildren ? generateItems(3, false) : []
      })
    }
    return items
  }

  const tag = domBindings.template('<ul><li expr0></li></ul>', [{
    selector: '[expr0]',
    type: domBindings.bindingTypes.EACH,
    itemName: 'item',
    evaluate(scope) { return scope.items },
    template: domBindings.template('<!----><p expr1></p>', [{
      expressions: [
        {
          type: domBindings.expressionTypes.TEXT,
          childNodeIndex: 0,
          evaluate(scope) { return scope.item.name }
        }
      ]
    }, {
      selector: '[expr1]',
      type: domBindings.bindingTypes.EACH,
      itemName: 'prop',
      evaluate(scope) { return scope.item.props },
      template: domBindings.template('<!---->', [{
        expressions: [
          {
            type: domBindings.expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate(scope) { return scope.prop.name }
          }
        ]
      }])
    }])
  }])


  suite
    .on('start', function() {
      // setup
      const loopTag = document.createElement('div')
      tag.mount(loopTag, { items: [] })
    })
    .on('complete', function() {
      tag.unmount()
    })
    .add(testName, () => {
      const items = generateItems(50, true)
      tag.update({ items })
      tag.update({ items: items.concat(generateItems(30, true)) })
    })

}

