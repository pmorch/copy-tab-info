const routes = [
    { path: '/', redirect: { name: 'formats' } },
    { path: '/formats', name: 'formats', meta: { title: "Formats" } },
    { path: '/urlRules', name: 'urlRules', meta: { title: "URL Rules" } },
    { path: '/editor', name: 'editor', meta: { title: "Editor" } },
]

export default routes