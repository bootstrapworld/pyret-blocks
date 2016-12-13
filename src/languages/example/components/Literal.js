import React, {Component, PropTypes} from 'react';

import Node from '../../../components/Node';
import {Literal as LiteralASTNode} from '../../../ast';

export default class Literal extends Component {
  static propTypes = {
    node: PropTypes.instanceOf(LiteralASTNode),
  }

  render() {
    const {node} = this.props;
    return (
      <Node type="literal" node={node}>
        <span className="data-type">
          ({node.dataType})
        </span>
        <br />
        <span className={`blocks-literal-${node.dataType}`}>
          {node.toString()}
        </span>
      </Node>
    );
  }
}
