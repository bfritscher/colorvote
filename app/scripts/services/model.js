'use strict';

angular.module('colorvoteApp')
  .service('model', ['$q', '$rootScope', '$timeout', 'uuid4',
    function model($q, $rootScope, $timeout, uuid4) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    var self = this;
    
    var uuid =  uuid4.generate();
    
    var deferreds = [];
    
    this.data = {
      connectedCount: 0
    };
      
    //user
    var question = {
      _id: 1,
      room: 'test',
      possibleAnswers: 8,
      state:'started',
      vote: 3,
      c: 1
    };
    //admin
    question = {
      _id: 1,
      room: 'test',
      possibleAnswers: 8,
      state:'started',
      dateStarted: new Date(),
      results: [0, 2, 6, 8, 2, 5, 4, 7]
      //modified: new Date()
    };
    
    var primus = Primus.connect('ws://debian:3000');
    var protocol = {
      'q': 'question',
      'r': 'rooms',
      'c': 'connectedCount'
    };

    primus.on('open', function () {
      primus.on('data', function (data) {
        data = data || {};
        var obj = protocol[data.o] || data.o,
        property = data.p,
        value = data.v;
        if(self.data[obj] === undefined){
          self.data[obj] = {};
        }
        if(value){
          if(property !== undefined && typeof self.data[obj] === 'object'){
            self.data[obj][property] = value;
          }else{
            self.data[obj] = value;
          }
        }
        $rootScope.$digest();
        deferreds.forEach(function(deferred){
          deferred.updated(obj);
        });
      });
      //rejoin room on reconnect
      if(self.data.question && self.data.question.room){
        self.join(self.data.question.room);
      }
      self.data.online = true;
    });
    primus.on('reconnecting', function () {
      $rootScope.$apply(function(){
        self.data.online = false;
      });
    });

    this.getRooms = function getRooms(){
      primus.write({a:'getRooms'});
    };

    this.vote = function vote(){
      primus.write({a:'v', u: uuid, //TODO: fix 
        q: self.data.question._id,
        v: self.data.question.vote});
    };

    this.join = function join(room){
      //ifadmin -admin
      var deferred = $q.defer();
      deferred.updated = function(obj){
        if(obj === 'question'){
          deferreds.splice(deferreds.indexOf(deferred),1);
          deferred.resolve(self.data.question);
        }//TODO could handle error responses
      };
      $timeout(function(){
        deferred.reject('timeout');
      }, 10000);
      deferreds.push(deferred);
      primus.write({a:'join', v:room});
      return deferred.promise;
    };

    this.leave = function leave(room){
      primus.write({a:'leave', v:room});
    };

    this.questionAction = function questionAction(){
      primus.write({a:'questionAction', v: self.data.question._id});
    };
    
    //TODO: reactif?
    this.possibleAnswers = function(){
      primus.write({a:'possibleAnswers', q: self.data.question._id, v: self.data.question.possibleAnswers});
    };

    this.getHistory = function(){
      primus.write({a:'history', v: self.data.question.roomId});
    };

  }]);
