//* Menus will be stacked horizontally
//* in their order in navGroups array
export const navGroups = [
  {
    groupName: 'main',
    displayName: 'Main',
    dropdownCols: 3,
    links: [
      { text: 'home', href: '/' },
      { text: '/about', href: '/about' }
    ]
  },
  {
    groupName: 'users',
    displayName: 'Users',
    dropdownCols: 3,
    links: [
      { text: 'Users', href: '/users' },
      { text: 'Add User', href: '/users/add' },
      { text: 'useSubmission Demo', href: '/users/use-submission-demo' }
    ]
  },
  {
    groupName: 'cars',
    displayName: 'Cars',
    dropdownCols: 3,
    links: [
      { text: 'Cars', href: '/cars' }
    ]
  },
  {
    groupName: 'actions',
    displayName: 'Actions',
    dropdownCols: 3,
    links: [
      { text: 'With JS', href: '/actions/with-js' },
      { text: 'No JS', href: '/actions/no-js' },
      { text: 'Dot With', href: '/actions/dot-with' }
    ]
  },
  {
    groupName: 'submissions',
    displayName: 'Submissions',
    dropdownCols: 3,
    links: [
      { text: 'Submissions', href: '/submissions/subs' },
      { text: 'Submission Input', href: '/submissions/sub-input' },
      { text: 'Submission Result', href: '/submissions/sub-result' },
      { text: 'Submission Error', href: '/submissions/sub-error' },
      { text: 'Submission URL', href: '/submissions/sub-url' },
      { text: 'Submission Pending', href: '/submissions/sub-pending' }
    ]
  },
  {
    groupName: 'errors',
    displayName: 'Errors',
    dropdownCols: 2,
    links: [
      { text: 'Action Throw', href: '/errors/action-throw' },
      { text: 'Action Try Throw Catch Rethrow', href: '/errors/action-try-throw-catch-rethrow' },
      { text: 'Action Try Throw Catch Return', href: '/errors/action-try-throw-catch-return' },
      { text: 'Query Throw', href: '/errors/query-throw' },
      { text: 'Query Try Throw Catch Rethrow', href: '/errors/query-try-throw-catch-rethrow' },
      { text: 'Query Try Throw Catch Return', href: '/errors/query-try-throw-catch-return' }
    ]
  }
]