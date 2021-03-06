import {Meteor} from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

export default () => {

  Accounts.urls.resetPassword = (token) => {
    return Meteor.absoluteUrl('reset-password/' + token);
  };

  Accounts.urls.verifyEmail = (token) => {
    return Meteor.absoluteUrl('email-verification/' + token);
  };

  Accounts.onCreateUser((options, user) => {

    user.profile = options.profile ? options.profile : {};
    user.roles = options.roles || Meteor.settings.private.defaultRole;

    // send verification mail
    Meteor.setTimeout(function() {
      Accounts.sendVerificationEmail(user._id);
    }, 2 * 1000);

    return user;
  });
}
