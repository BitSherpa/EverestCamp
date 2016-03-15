import NodeList from '../components/NodeList.jsx';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context}, onData) => {
  const {Meteor, Collections, LocalState} = context();
  const filter = LocalState.get('filter');
  if (Meteor.subscribe('node.list').ready()) {
    const nodes = Collections.Nodes.find().fetch();
    onData(null, {nodes});
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(NodeList);