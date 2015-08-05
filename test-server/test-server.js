if (Meteor.isClient) {
  Meteor.startup(function() {
    Meteor.call('getPort', function(err, port) {
      Session.set('port', port);
    });
  });

  Template.info.helpers({
    port: function () {
      return Session.get('port');
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    'getPort': function() {
      return process.env.PORT;
    }
  });
}
