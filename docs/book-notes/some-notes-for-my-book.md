Reintroduction Strategy (in order)
Uncomment basic signals (no reactive functions)

selectedFilePath
isDirty
localContent
Test after each or all three together
Uncomment simple handler functions

handleSave (without calling it)
handleContentChange
Test
Uncomment the content() computed function

This has a dependency on fileData() which doesn't exist yet, so we'd need to modify it temporarily to just return localContent()
Test
Add back imports (one at a time)

useSubmission from @solidjs/router
Test
createAsyncStore from @solidjs/router
Test
getFileContents, saveFileContents from ~/lib/files
Test
Uncomment useSubmission call

const saveSub = useSubmission(saveFileContents)
Test
Uncomment createAsyncStore call (the likely culprit)

This creates a reactive computation that might be blocking
Test
Update content() function to use fileData()

Change from simplified version back to full version
Test

---

const result = await getFileContents(filePath) // wrong

1. You cannot call query without using createAsyncStore.

2. All changes should be made with actions

3. when an action finishes all queries in the same module refetch data. i.e., Once you call a query with createAsyncStore, and if you always use actions for all updates, you never have to manually/explicitly call a query after the

4. If you have multiple queries in the same module there is a way to control which query updates for which action.

5. createAsyncStore has `reconcile` which can be used, if needed, to  control how new data is merged with the existing store.

6. An option to createAsyncStore is `deferStream` which I think will help get the UI to wait for the query to return all the data before trying to render.

documentation: https://docs.solidjs.com/solid-router/reference/data-apis/create-async-store#createasyncstore
