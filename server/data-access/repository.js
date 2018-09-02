
export async function findItems(ReadJSON, selector) {
  try {
    const data = await ReadJSON()
    return data.filter(element => selectItem(element, selector))
  } catch (error) {
    console.error('Something went wrong finding items with selector: ', selector)
    console.error(error.message)
    return null
  }
}

export async function selectN(ReadJSON, count) {
  const data = await ReadJSON()
  if (data != null || data.length === 0) {
    return data.slice(0, count)
  }
  return null
}

export async function insertItems(ReadJSON, WriteJSON, uniqueFields = ['id'], object) {
  let items = await ReadJSON()
  
  console.log(uniqueFields, object)

  if (items.some(element => uniqueFields.some(field => element[field] == object[field]))) {
    console.error("Can't add object because item is not unique")
    throw new Error("not-unique")
  }

  items.push(object)
  return await WriteJSON(items)
}

export async function updateItems(ReadJSON, WriteJSON, selector, changes) {
  const items = await ReadJSON()
  const transformedItems = items.map(element => {
    return selectItem(element, selector)
      ? transformElement(element, changes)
      : element
  })
  return await WriteJSON(transformedItems)
}

export async function deleteItems(ReadJSON, WriteJSON, selector) {
  const items = await ReadJSON()

  const postDelete = items.filter(element => !selectItem(element, selector))
  await WriteJSON(postDelete)
}

export async function deleteCollection(ReadJSON, WriteJSON, ids) {
  const items = await ReadJSON()

  const postDelete = items.filter(element => !ids.includes(element.id))
  return await WriteJSON(postDelete)
}

export async function insertForeignKey(ReadJSON, WriteJSON, selector, foreignKey) {
  const items = await ReadJSON()
  
  const transformedItems = items.map(element => {
    return selectItem(element, selector)
      ? insertForeignKeyToElement(element, foreignKey)
      : element
  })

  return await WriteJSON(transformedItems)
}

export async function removeForeignKey(ReadJSON, WriteJSON, selector, foreignKey) {
  const items = await ReadJSON()

  const transformedItems = items.map(element => {
    return selectItem(element, selector) 
      ? removeForeignKeyFromElement(element, foreignKey)
      : element
  })

  return await WriteJSON(transformedItems)
}

export async function removeReference(ReadJSON, WriteJSON, foreignKey) {
  const items = await ReadJSON()
  const transformedItems = items.map(element => removeForeignKeyFromElement(element, foreignKey))

  return await WriteJSON(transformedItems)
}

function selectItem(object, selector) {
  return Object.entries(selector).every(([key, value]) => {
    return object[key] && object[key] == value
  })
}

function transformElement(element, changes) {
  return {
    ...element,
    ...changes
  }
}

function insertForeignKeyToElement(element, foreignKey) {
  if (!element[foreignKey.key]) {
    element[foreignKey.key] = []
  }
  element[foreignKey.key].push(foreignKey.value)
  return element
}

function removeForeignKeyFromElement(element, foreignKey) {
  element[foreignKey.key] = element[foreignKey.key].filter(e => e !== foreignKey.value)
  return element
}
