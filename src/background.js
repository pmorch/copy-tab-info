'use strict';

import Mustache from 'mustache'
import { parse } from 'yaml'

import { contextMenus, resolveRemoteConfigs } from './config.js'
import { applyUrlRules } from '../src/urlRules.js'

import factoryConfig from '../public/factoryConfig.yaml?raw'

async function getConfigWithRemotesResolved() {
  const config = parse(factoryConfig)
  return await resolveRemoteConfigs(config)
}

getConfigWithRemotesResolved()
  .then(config => { console.log("TODO: Removeme - config is", config) })
  .catch(error => { console.log("error from getConfigWithRemotesResolved", error) })

async function getTabs() {
  const rawTabs = await chrome.tabs.query({ highlighted: true, currentWindow: true });
  return rawTabs.map((t) => { return { title: t.title, url: t.url } });
}

function getRenderedTabs(tabs, config, formatName) {
  const format = config.formats[formatName]
  const joinString = 'joinString' in format ? format.joinString : "\n"
  for (const tab of tabs) {
    applyUrlRules(tab, config.urlRules)
  }
  return tabs.map(t => Mustache.render(format.template, t)).join(joinString)
}

async function writeToClipboard(data) {
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: 'Write text to the clipboard.'
  });

  // Now that we have an offscreen document, we can dispatch the
  // message.
  return await chrome.runtime.sendMessage({
    type: 'copy-data-to-clipboard',
    target: 'offscreen-doc',
    data
  });
}

async function refreshContextMenu() {
  const config = await getConfigWithRemotesResolved()
  chrome.contextMenus.removeAll();
  let cmenus = contextMenus(config)
  for (const cmenu of cmenus) {
    chrome.contextMenus.create(cmenu);
  }
}

refreshContextMenu()

chrome.action.onClicked.addListener(async (tab) => {
  const tabs = await getTabs()
  const config = await getConfigWithRemotesResolved()
  const HTML = getRenderedTabs(tabs, config, 'HTML')
  const text = getRenderedTabs(tabs, config, 'text')
  const data = { text, HTML }
  await writeToClipboard(data)
})

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  const formatName = info.menuItemId
  const tabs = await getTabs()
  const config = await getConfigWithRemotesResolved()
  if (!(formatName in config.formats)) {
    throw new Error(`How could ${formatName} be unknown and not in config.formats?`)
  }
  const text = getRenderedTabs(tabs, config, formatName)
  const data = { text }
  await writeToClipboard(data)
})

console.log("background.js loaded")
