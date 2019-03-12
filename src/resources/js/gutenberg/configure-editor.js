import { elementReady, elementRendered } from './element-ready'
import { data } from '@frontkom/gutenberg-js'
import { editorSettings } from './settings'
import setupLaravelFilemanager from './laravel-filemanager'

/**
 * Configures the editor according to the provided options object
 * @param {Object} options
 */
export default function configureEditor (options) {
  setupSubmit(editorSettings.target)
  setupMedia(options)
  if (options.maxHeight) { setMaxHeight(options.maxHeight) }
  if (options.minHeight) { setMinHeight(options.minHeight) }
  if (options.height) { setHeight(options.height) }
}

/**
 * Set all editor button types to 'button' to prevent submitting the form
 */
export function clearSubmitFromButtons () {
  let buttons = document.getElementById('laraberg__editor').getElementsByTagName('button')
  if (buttons.length > 0) {
    Array.from(buttons).forEach(button => { button.type = 'button' })
  }
}

/**
 * Sets the max-height style value
 * @param {String} maxHeight css value for max-height
 */
function setMaxHeight (maxHeight) {
  const contentContainer = window.Laraberg.editor.querySelector('.edit-post-layout__content')
  contentContainer.style.maxHeight = maxHeight
}

/**
 * Sets the min-height style value
 * @param {String} minHeight css value for min-height
 */
function setMinHeight (minHeight) {
  const contentContainer = window.Laraberg.editor.querySelector('.edit-post-layout__content')
  contentContainer.style.minHeight = minHeight
}

/**
 * Sets the height style value
 * @param {String} height css value for height
 */
function setHeight (height) {
  const contentContainer = window.Laraberg.editor.querySelector('.edit-post-layout__content')
  contentContainer.style.height = height
}

/**
 * Setup media upload capabilities according to provided options
 * @param {Object} options the options object provided on initialization
 */
function setupMedia (options) {
  removeUploadButton()
  if (options.laravelFilemanager) { setupLaravelFilemanager() }
}

/**
 * Makes sure the textarea value gets set to the editor content on submit
 * @param {string} target the textarea to set the value of
 */
function setupSubmit (target) {
  clearSubmitFromButtons()
  const textarea = document.getElementById(target)
  textarea.form.addEventListener('submit', event => {
    textarea.value = data.select('core/editor').getEditedPostContent()
    // Clear content "dirty" state.
    data.dispatch('core/editor').savePost()
    return true
  })
}

/**
 * Removes the default upload button from media blocks
 */
function removeUploadButton () {
  elementRendered('.editor-media-placeholder', mediaEditor => {
    mediaEditor.querySelector('.components-form-file-upload button').remove()
  })
}