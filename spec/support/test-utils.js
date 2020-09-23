const { click, doubleClick, blur, keyDown, keyPress, insertText } = require('./simulate');
import { store } from '../../src/store';

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function removeEventListeners() {
  const oldElem = document.body;
  const newElem = oldElem.cloneNode(true);
  oldElem.parentNode.replaceChild(newElem, oldElem);
}

function cleanupAfterTest(rootId, store) {
  let rootNode = document.getElementById('root');
  if (rootNode) {
  document.body.removeChild(rootNode);
  } else {
    console.log('doing cleanupAfterTest', 'MISSING ROOT');
  }

  store.dispatch({type: "RESET_STORE_FOR_TESTING"});
  const textareas = document.getElementsByTagName("textarea");
  while (textareas[0]) {
    const current = textareas[0];
    current.parentNode.removeChild(current);
  }
}

function teardown() {
  cleanupAfterTest('root', store);
}

module.exports.testing = {
  TeardownAfterTest: teardown,
  click : click,
  doubleClick : doubleClick,
  blur : blur,
  keyDown : keyDown,
  keyPress : keyPress,
  insertText : insertText,
  wait: wait
};
