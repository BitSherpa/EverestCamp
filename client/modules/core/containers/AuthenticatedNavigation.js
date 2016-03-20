import AuthenticatedNavigation from '../components/AuthenticatedNavigation.jsx';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context}, onData) => {
  const {Meteor} = context();
  onData(null, {});
};

export const depsMapper = (context) => ({
  items: {
    left: [
      { uid: 'files', href: '/files', label: 'Files' }
    ],
    right: [
      {
        uid: 'currentUser',
        href: '#',
        label: Meteor.user().emails[0].address,
        dropdown: true,
        dropdownItems: [
          { uid: 'logout', href: '#', label: 'Logout', action: () => {
            return Meteor.logout( () => {
              FlowRouter.go( '/' );
            });
          }}
        ]
      }
    ]
  },
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AuthenticatedNavigation);
