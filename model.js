Config = {
	numMaxAnswers: 8
};
Accounts.config({
	forbidClientAccountCreation: false
});

Rooms = new Meteor.Collection("rooms");

function isAdmin(userId){
	var user = Meteor.users.findOne(userId);
	return user && user.type === 'admin';
}

//Security needed, currently an admin can do what he wants!
Rooms.allow({
	insert: function (userId, room) {
		return isAdmin(userId);
	},
	update: function (userId, room, fields, modifier) {
		return isAdmin(userId);
	},
	remove: function (userId, room) {
		return isAdmin(userId);
	}
});

Questions = new Meteor.Collection("questions");
Questions.allow({
	insert: function (userId, room) {
		return isAdmin(userId);
	},
	update: function (userId, room, fields, modifier) {
		return isAdmin(userId);
	},
	remove: function (userId, room) {
		return isAdmin(userId);
	}
});
QuestionResults = new Meteor.Collection("questionresults");
QuestionResults.allow({
	insert: function (userId, room) {
		return isAdmin(userId);
	},
	update: function (userId, room, fields, modifier) {
		return isAdmin(userId);
	},
	remove: function (userId, room) {
		return isAdmin(userId);
	}
});


Votes = new Meteor.Collection('votes');
Votes.allow({
	insert: function (userId, room) {
		return isAdmin(userId);
	},
	update: function (userId, room, fields, modifier) {
		return isAdmin(userId);
	},
	remove: function (userId, room) {
		return isAdmin(userId);
	}
});

function createQuestionInRoom(roomId, possibleAnswers){
	var newQuestionId = Questions.insert({possibleAnswers: possibleAnswers || Config.numMaxAnswers,
		state:'started', dateStarted: new Date(), roomId: roomId});
	
	QuestionResults.insert({_id: newQuestionId, votes: 0, results: createEmptyResult(Config.numMaxAnswers), modified: new Date()});
	//set as currentQuestion for same room
	Rooms.update(roomId, {$set:{currentQuestion: newQuestionId}});
};
//global functions to use also in client
createEmptyResult = function createEmptyResult(possibleAnswers){
	var result = {};
	for(var i=0; i< possibleAnswers; i++){
		result[i] = 0;
	}
	return result;
}

createQuestionResult = function createQuestionResult(votes, possibleAnswers){
	return _.reduce(votes, function(memo, voteObj){
            if(memo.hasOwnProperty(voteObj.vote)){
                memo[voteObj.vote]++;
            }
            return memo
		}, createEmptyResult(possibleAnswers));
}

Meteor.methods({
	changeNumAnswers: function(questionId, numAnswers){
		check(questionId, String);
		check(numAnswers, Number);
		if(!isAdmin(this.userId)){
			throw new Meteor.Error(403, "Not an admin");
		}
		if(numAnswers > Config.numMaxAnswers){
			throw new Meteor.Error(403, "numAnswers must be less or equal to " + Config.numMaxAnswers);
		}
		Questions.update(questionId, {$set: {possibleAnswers: numAnswers}});
		QuestionResults.update(questionId, {$set: {
			results:createQuestionResult(Votes.find({questionId: questionId}).fetch(), numAnswers)}})
	},
	makeAdmin: function(userId){
		check(userId, String);
		if(!isAdmin(this.userId)){
			throw new Meteor.Error(403, "Not an admin");
		}
		Meteor.users.update(userId, {$set:{type:'admin'}})
	},
		
  vote: function (questionId, voteNb) {
	check(questionId, String);
	check(voteNb, Number);
	var question = Questions.findOne(questionId);
	var questionResult = QuestionResults.findOne(questionId);
	if (! question && ! questionResult){
		throw new Meteor.Error(404, "No such question");
	}
	if(question.state === 'stopped'){
		throw new Meteor.Error(403, "Question stopped");
	}
		
	var vote = Votes.findOne({questionId: questionId, userId: this.userId});
		
	if (vote) {
	  // update existing vote entry
	  Votes.update({_id: vote._id}, {$set:{vote:voteNb}});
	} else {
	  // add new entry
	  Votes.insert({questionId: questionId, userId: this.userId, vote: voteNb});
	}
	if(questionResult.modified && new Date().getTime() - questionResult.modified.getTime() > 1500){ //update every x seconds
		QuestionResults.update({_id: questionId},
		{$set:{votes:Votes.find({questionId: questionId}).count(),
		   results:createQuestionResult(Votes.find({questionId: questionId}).fetch(), question.possibleAnswers),
		   modified: new Date()
		   }});
	}
  },
  
  questionAction: function(questionId){
	check(questionId, String);
	var question = Questions.findOne(questionId);
	if (! question){
	  throw new Meteor.Error(404, "No such question");
	}
	var room = Rooms.findOne(question.roomId);
	if (! room){
	  throw new Meteor.Error(404, "No such room");
	}
	if(!isAdmin(this.userId)){
		throw new Meteor.Error(403, "Not an admin");
	}
	 
	if(question.state==='started'){
		Questions.update(questionId, {$set: {state: 'stopped', dateStopped: new Date()}});
		//calculate real votes
		QuestionResults.update({_id: questionId},
			{$set:{votes:Votes.find({questionId: questionId}).count(),
			   results:createQuestionResult(Votes.find({questionId: questionId}).fetch(), question.possibleAnswers),
			   modified: new Date()
			   }});
	}else if(question.state==='stopped'){
		createQuestionInRoom( question.roomId, question.possibleAnswers);
	}
  },
  newRoom: function(name){
	check(name, String);
	if(!isAdmin(this.userId)){
		throw new Meteor.Error(403, "Not an admin");
	}
	var roomId = Rooms.insert({name:name});
	createQuestionInRoom( roomId );
  }
});