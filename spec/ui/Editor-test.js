import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Editor from 'codemirror-blocks/ui/Editor';
import TrashCan from 'codemirror-blocks/ui/TrashCan';
import 'codemirror-blocks/languages/wescheme';
import {EVENT_DRAG_START, EVENT_DRAG_END} from 'codemirror-blocks/blocks';

describe('The Editor component,', function() {
  beforeEach(function() {
    this.editor = TestUtils.renderIntoDocument(<Editor language="wescheme" />);
    this.blocks = this.editor.getCodeMirrorBlocks();
  });

  it("should create a CodeMirrorBlocks instance for you", function() {
    let blocks = this.editor.getCodeMirrorBlocks();
    expect(blocks.language.name).toBe('WeScheme');
  });

  it("should toggle block state when the toggle button is clicked", function() {
    let blocks = this.blocks;
    spyOn(blocks, 'toggleBlockMode');
    let toggle = TestUtils.findRenderedDOMComponentWithClass(this.editor, 'blocks-toggle-btn');
    TestUtils.Simulate.click(toggle);
    expect(blocks.toggleBlockMode).toHaveBeenCalled();
  });

  it("should show the trash can when a drag start event is emitted", function() {
    this.blocks.emit(EVENT_DRAG_START);
    expect(this.editor.state.showTrashCan).toBe(true);
  });

  it("should hide the trash can when a drag end event is emitted", function() {
    this.blocks.emit(EVENT_DRAG_END);
    expect(this.editor.state.showTrashCan).toBe(false);
  });

  it("should delete the node that gets dragged on the trash can and hide the trash can", function() {
    spyOn(this.blocks, 'deleteNodeWithId').and.callThrough();
    let trashCan = TestUtils.findRenderedComponentWithType(this.editor, TrashCan);
    trashCan.props.onDrop('some-node-id');
    expect(this.editor.state.showTrashCan).toBe(false);
    expect(this.blocks.deleteNodeWithId)
      .toHaveBeenCalledWith('some-node-id');
  });

  it("should unregister it's listeners when unmounted", function() {
    spyOn(this.blocks, 'off').and.callThrough();
    this.editor.componentWillUnmount();
    expect(this.blocks.off.calls.argsFor(0)).toEqual([EVENT_DRAG_START, jasmine.any(Function)]);
    expect(this.blocks.off.calls.argsFor(1)).toEqual([EVENT_DRAG_END, jasmine.any(Function)]);
  });
});
