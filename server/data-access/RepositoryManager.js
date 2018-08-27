export async function findItems(ReadJSON, selector) {
    const data = await ReadJSON()
    return data.filter(element => selectItem(element, selector))
}

export async function insertItems(ReadJSON, WriteJSON, object) {
  let items = await ReadJSON()
  if (items.some(element => element.id === object.id)) {
    console.erorr('Can\'t add object because ID is not unique')
    return
  }
  
  items.push(object)
  await WriteJSON(items)
}

export async function updateItems(ReadJSON, WriteJSON, selector, changes) {
  const items = await ReadJSON()
  const transformedItems = items.map(element => {
    return selectItem(element, selector) ? transformElement(element, changes) : element
  })
  await WriteJSON(transformedItems)
}

export async function deleteItems(ReadJSON, WriteJSON, selector) {
  const itemsPromise = ReadJSON()
  const itemsToDeletePromise = findItems(selector)
  const [items, itemsToDelete] = await Promise.all([itemsPromise, itemsToDeletePromise])

  const postDelete = items.filter(element => (
    itemsToDelete.every(elementToDelete => element.id !== elementToDelete.id)
  ))

  await WriteJSON(postDelete)
}

function selectItem(object, selector) {
  return Object.entries(selector).every((key, value) => object[key] && object[key] == value)
}

function transformElement(element, changes) {
  return {
    ...element,
    ...changes
  }
}