'use strict'

import { triggerEventOn } from '@domql/event'
import { setContentKey, document, window } from '@domql/utils'

export const getActiveRoute = (level = 0, route = window.location.pathname) => {
  const routeArray = route.split('/')
  const activeRoute = routeArray[level + 1]
  if (activeRoute) return `/${activeRoute}`
}

export let lastPathname
export let lastLevel = 0

const defaultOptions = {
  level: lastLevel,
  pushState: true,
  initialRender: false,
  scrollToTop: true,
  scrollToNode: false,
  scrollNode: document && document.documentElement,
  scrollBody: false,
  useFragment: false,
  updateState: true,
  scrollToOffset: 0,
  contentElementKey: 'content',
  scrollToOptions: { behavior: 'smooth' }
}

export const router = (
  path,
  el,
  state = {},
  options = {}
) => {
  const element = el || this
  const win = element.context.window || window
  const doc = element.context.document || document
  const opts = { ...defaultOptions, ...element.context.routerOptions, ...options }
  lastLevel = opts.lastLevel
  const ref = element.__ref

  if ((opts.contentElementKey !== 'content' && opts.contentElementKey !== ref.contentElementKey) || !ref.contentElementKey) {
    ref.contentElementKey = opts.contentElementKey || 'content'
  }

  const contentElementKey = setContentKey(element, opts)

  const urlObj = new win.URL(win.location.origin + path)
  const { pathname, search, hash } = urlObj

  const rootNode = element.node
  const route = getActiveRoute(opts.level, pathname)
  const content = element.routes[route || '/'] || element.routes['/*']
  const scrollNode = opts.scrollToNode ? rootNode : opts.scrollNode
  const hashChanged = hash && hash !== win.location.hash.slice(1)
  const pathChanged = pathname !== lastPathname
  lastPathname = pathname

  if (!content || element.state.root.debugging) {
    element.state.root.debugging = false
    return
  }

  if (opts.pushState) {
    win.history.pushState(state, null, pathname + (search || '') + (hash || ''))
  }

  if (pathChanged || !hashChanged) {
    if (opts.updateState) {
      element.state.update({ route, hash, debugging: false }, { preventContentUpdate: true })
    }

    if (contentElementKey && opts.removeOldElement) {
      element[contentElementKey].remove()
    }

    element.set({
      tag: opts.useFragment && 'fragment',
      extends: content
    }, { contentElementKey })
  }

  if (opts.scrollToTop) {
    scrollNode.scrollTo({
      ...(opts.scrollToOptions || {}), top: 0, left: 0
    })
  }
  if (opts.scrollToNode) {
    content[contentElementKey].node.scrollTo({
      ...(opts.scrollToOptions || {}), top: 0, left: 0
    })
  }

  if (hash) {
    const activeNode = doc.getElementById(hash)
    if (activeNode) {
      const top = activeNode.getBoundingClientRect().top + rootNode.scrollTop - opts.scrollToOffset || 0
      scrollNode.scrollTo({
        ...(opts.scrollToOptions || {}), top, left: 0
      })
    }
  }

  // trigger `on.routeChanged`
  triggerEventOn('routeChanged', element, opts)
}

export default router
