Accounts.registerLoginHandler(function(options) {
	if (!options.anonymous)
	  return undefined; // don't handle

	// Create and insert a user, bypassing everything. All we want is the token.
	return Accounts.insertUserDoc({generateLoginToken:true}, {type: 'anonymous', services: {}});
});

Meteor.publish('userPresence', function() {
  // ProTip: unless you need it, don't send lastSeen down as it'll make your 
  // templates constantly re-render (and use bandwidth)
  return Meteor.presences.find({}, {fields: {state: true, userId: true}});
});

Meteor.publish("question", function (id) {
	check(id, String);	
	/*
	TODO: precalculate count and send votes array only to admin but need to include
	user's own vote to show it to him...
	var fields = {votesCount: true, possibleAnswers:true,
		dateStarted:true, dateStopped:true, roomId:true, state: true};
	var user = Meteor.users.findOne(this.user);
	if(user && user.type==='admin'){
		fields.votes = true;
	}
	*/
	return Questions.find(id);
});
Meteor.publish("rooms", function () {
	return Rooms.find({});
});

Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, {fields: {'type': 1}});
});

Meteor.publish("questionsHistory", function (roomId) {
	check(roomId, String);
	return Questions.find({roomId: roomId, state:'stopped', $where:"this.votes.length > 0"}, {sort:{dateStopped: -1}, limit:20});
});