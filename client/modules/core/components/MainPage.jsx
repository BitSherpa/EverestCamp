import React from 'react';
import {GridRow, GridColumn, Input, ButtonGroup, FormGroup} from '../../bootstrap/components/index.jsx';
import { TreeView, NodeInsert, NodeEdit } from '../../nodes/containers';
import { PostInsert, PostEdit, PostSearch } from '../../posts/containers';

export default class MainPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {filterText: ''};
  }

  renderItemView(){
    if(this.props.nodeId && !this.props.postId){
      return (
        <NodeEdit nodeId={this.props.nodeId} />
      );
    } else if(this.props.postId && this.props.nodeId) {
      return (
        <PostEdit postId={this.props.postId} />
      );
    } else {
      return (
        <PostSearch linkTo="post.edit" />
      );
    }
  }

  filterList(event){
    this.setState({
      filterText: event.target.value
    });
  }

  render(){
    return(
      <GridRow className="main-page">
      <GridColumn className="col-md-4">
        <FormGroup>
        <ButtonGroup>
          <NodeInsert nodeId={this.props.nodeId} />
          <PostInsert nodeId={this.props.nodeId} />
        </ButtonGroup>
        </FormGroup>
        <FormGroup>
          <Input
          style="input"
          type="text"
          name="search"
          placeholder="Search"
          onChange={ this.filterList.bind(this) }
          defaultValue="" />
        </FormGroup>
        <TreeView rootUrl="/posts" activeNodeId={this.props.nodeId} filterText={this.state.filterText} />
        </GridColumn>
        <GridColumn className="col-md-8">
        { this.renderItemView() }
        </GridColumn>
      </GridRow>
    );
  }
}
