'use strict';

import Mustache from 'mustache'

import { contextMenus, originalName } from './config.js'
import { applyUrlRules } from './urlRules.js'
import { getResolvedConfig, onConfigChange } from './browserConfig.js'

async function getTabs() {
  const rawTabs = await chrome.tabs.query({ highlighted: true, currentWindow: true });
  return rawTabs.map((t) => { return { title: t.title, url: t.url } });
}

function getRenderedTabs(tabs, config, formatName) {
  const format = config.formats.filter(e => e.name === formatName)[0]
  if (!format) {
    throw new Error(`How could ${formatName} be unknown and not in config.formats?`)
  }
  const joinString = 'joinString' in format ? format.joinString : "\n"
  for (const tab of tabs) {
    applyUrlRules(tab, config.urlRules)
  }
  return tabs.map(t => Mustache.render(format.template, t)).join(joinString)
}

function getOriginalRenderedTabs(tabs) {
  return tabs.map(t => Mustache.render("{{{title}}}\n{{{url}}}", t)).join("\n")
}

async function writeToClipboard(data) {
  await chrome.offscreen.createDocument({
    url: '/src/offscreen/offscreen.html',
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: 'Write text to the clipboard.'
  })

  // Now that we have an offscreen document, we can dispatch the
  // message.
  return await chrome.runtime.sendMessage({
    type: 'copy-data-to-clipboard',
    target: 'offscreen-doc',
    data
  });
}

async function refreshContextMenu() {
  const config = await getResolvedConfig()
  chrome.contextMenus.removeAll();
  let cmenus = contextMenus(config)
  for (const cmenu of cmenus) {
    chrome.contextMenus.create(cmenu);
  }
}

function setupOnclickedHandlers() {
  chrome.action.onClicked.addListener(async (tab) => {
    const tabs = await getTabs()
    const config = await getResolvedConfig()
    const HTML = getRenderedTabs(tabs, config, 'HTML')
    const text = getRenderedTabs(tabs, config, 'text')
    const data = { text, HTML }
    await writeToClipboard(data)
  })

  chrome.contextMenus.onClicked.addListener(async function (info, tab) {
    const formatName = info.menuItemId
    const tabs = await getTabs()
    let text
    if (formatName == originalName()) {
      text = getOriginalRenderedTabs(tabs)
    } else {
      const config = await getResolvedConfig()
      text = getRenderedTabs(tabs, config, formatName)
    }
    const data = { text }
    await writeToClipboard(data)
  })
}

(async function () {
  const config = await getResolvedConfig()
  await refreshContextMenu()
  onConfigChange(refreshContextMenu)
  setupOnclickedHandlers()
})()

console.log("background.js loaded")
