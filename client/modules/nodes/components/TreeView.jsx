import React from 'react';
import classNames from 'classnames/bind';
import { Alert, GridRow, GridColumn } from '../../bootstrap/components/index.jsx';

export default class TreeView extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      collapsedNodes: JSON.parse(localStorage["collapsedNodes"] || null)
    };
  };

  toggleCollapse(nodeId){
    let collapsedNodes = this.state.collapsedNodes
    // check if undefined
    collapsedNodes = ( typeof collapsedNodes != 'undefined' && collapsedNodes instanceof Array ) ? collapsedNodes : []

    // update collapsed node list
    if(_.contains(collapsedNodes, nodeId)){
      collapsedNodes = _.without(collapsedNodes, nodeId);
    }else{
      collapsedNodes.unshift(nodeId);
    }

    // save list
    this.setState({collapsedNodes: collapsedNodes})
    localStorage.setItem("collapsedNodes", JSON.stringify(collapsedNodes));
  }

  handleDragStart(nodeId, event) {
    this.dragged = event.target.parentNode;
    this.sourceId = nodeId;
    event.target.parentNode.style.opacity = '0.4';  // this / e.target is the source node.
  }

  handleDragEnter(nodeId, event){
    event.target.parentNode.style.backgroundColor = 'lightgrey';
    this.over = event.target.parentNode;
    this.targetId = nodeId;
  }

  handleDragOver(event) {
    if (event.preventDefault) {
      event.preventDefault(); // Necessary. Allows us to drop.
    }
    event.dataTransfer.dropEffect = 'move';
  }

  handleDragLeave(event){
    event.target.parentNode.style.backgroundColor = '';
    this.targetId = undefined;
  }

  handleDrop(event) {
    if(typeof this.targetId != 'undefined'){
      this.props.update_parent(this.sourceId, this.targetId);
    }
  }

  handleDragEnd(event) {
    this.dragged.style.opacity = '';
    if(typeof this.over != 'undefined'){
      this.over.style.backgroundColor = '';
    }
  }

  // iterative funtion to generate lists and its children
  renderNodeTree(parentNodeId){

    var nodes = this.props.nodes;
    if ( !!nodes && nodes.length > 0 ) {

      nodes = _.where(nodes, {parent: parentNodeId});
      if ( nodes.length > 0 ) {

        return (<ul className="tree-view_list">
        {nodes.map((node) => {

          let collapsed = _.contains(this.state.collapsedNodes, node._id);

          var containerClassName = classNames({
            'tree-view_node': true,
            'tree-view_node-collapsed':collapsed,
            'tree-view_node-hasChildren': _.where(this.props.nodes, {parent: node._id}).length > 0
          });

          var linkClassName = classNames({
            'tree-view_label': true,
            'tree-view_node-active': this.props.activeNodeId === node._id
          });

          var iconClassName = classNames({
            'fa fa-lg': true,
            'fa-folder-o': node.type === 'node' && collapsed,
            'fa-folder-open-o': node.type === 'node' && !collapsed,
            'fa-file-text-o': node.type === 'post'
          });

          return (
            <li
            className={containerClassName}
            key={node._id}>
              <span className="text-nowrap">
                <i draggable="true"
                onClick={this.toggleCollapse.bind(this, node._id)}
                onDragStart={this.handleDragStart.bind(this, node._id)}
                onDragEnter={this.handleDragEnter.bind(this, node._id)}
                onDragOver={node.type === 'node' ? this.handleDragOver : null}
                onDragLeave={this.handleDragLeave.bind(this)}
                onDrop={this.handleDrop.bind(this)}
                onDragEnd={this.handleDragEnd.bind(this)}
                className={iconClassName}></i> <a className={linkClassName} href={node.href}>{node.label}</a>
              </span>
              {this.renderNodeTree(node._id)}
            </li>
          );
        })}
        </ul>
        );
      }
    } else {
      return <Alert style="warning">No nodes found.</Alert>;
    }
  }

  render() {
    // console.log({"TreeView": this.props});
    return (
    <GridRow className={this.props.className}>
      <GridColumn className="col-md-12 tree-view">
        <ul className="tree-view_list tree-view_root">
          <li className="tree-view_node">

            <i onDragEnter={this.handleDragEnter.bind(this, "")}
            onDragOver={this.handleDragOver.bind(this)}
            onDragLeave={this.handleDragLeave.bind(this)}
            onDrop={this.handleDrop.bind(this)}
            className="fa fa-globe">
            </i> <a className="tree-view_label" href={this.props.rootUrl}>root</a>

            { this.renderNodeTree() }

          </li>
        </ul>
      </GridColumn>
    </GridRow>
    );
  }
}
