'use strict';

angular.module('colorvoteApp')
  .service('model', ['$q', '$rootScope', '$timeout', 'uuid4', 'localStorageService', 'config',
    function model($q, $rootScope, $timeout, uuid4, localStorageService, config) {
    /* jshint camelcase: false */
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    var self = this;
    var deferreds = [];
    
    //create anonymous user
    var userid = localStorageService.get('userId');
    if(null === userid){
      userid = uuid4.generate();
      localStorageService.add('userId', userid);
    }
    
    this.data = {
      connectedCount: 0,
      user: {
        _id: userid,
        admin: false
      }
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
    
    //TODO: config url
    var primus = Primus.connect('ws://colorvote.ch');
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
      primus.write({a:'v', u: self.data.user._id,
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
      primus.write({a:'join',
        v:room,
        u:self.data.user._id});
      return deferred.promise;
    };

    this.leave = function leave(room){
      primus.write({a:'leave', v:room});
    };

    this.getHistory = function(){
      primus.write({a:'history',
        v: self.data.question.roomId});
    };

    //with auth
    this.questionAction = function questionAction(){
      primus.write({a:'questionAction',
        v: self.data.question._id,
        u: self.data.user._id,
        t: self.data.user.access_token});
    };
    
    //TODO: reactif?
    this.possibleAnswers = function(){
      primus.write({a:'possibleAnswers',
        q: self.data.question._id,
        v: self.data.question.possibleAnswers,
        u: self.data.user._id,
        t: self.data.user.access_token});
    };
    
    this.addAdmin = function(adminId){
      primus.write({a:'addAdmin',
        v: adminId,
        u: self.data.user._id,
        t: self.data.user.access_token});
    };
    
    this.authorize = function(){
      var deferred = $q.defer();
      gapi.client.load('oauth2', 'v2', function() {
        var request = gapi.client.oauth2.userinfo.get();
        request.execute(function(result){
          //got info from google, now validate on our server
          primus.write({a:'login',
            t: gapi.auth.getToken().access_token,
            u: result.id});
          localStorageService.add('userId', result.id);
        });
      });
      deferred.updated = function(obj){
        if(obj === 'user'){
          deferreds.splice(deferreds.indexOf(deferred),1);
          if(self.data.user.admin){
            deferred.resolve(self.data.user);
          }else{
            //TODO could handle error responses display
            console.log('Rejected userlogin with id:' + self.data.user._id);
            deferred.reject();
          }
        }
      };
      $timeout(function(){
        deferred.reject('timeout');
      }, 10000);
      deferreds.push(deferred);
      return deferred.promise;
    };
    
    this.requireAuth = function (immediateMode) {
      var token = gapi.auth.getToken();
      var now = Date.now() / 1000;
      if (token && ((token.expires_at - now) > (60))) {
        return $q.when(token);
      } else {
        var params = {
          'client_id': config.clientId,
          'scope': config.scopes,
          'immediate': immediateMode
        };
        var deferred = $q.defer();
        var doAuth = function doAuth(){
          gapi.auth.authorize(params, function (result) {
            if (result && !result.error) {
              deferred.resolve(result);
            } else {
              //try not immediate
              if(params.immediate){
                params.immediate = false;
                doAuth();
              }else{
                deferred.reject(result);
              }
            }
            $rootScope.$digest();
          });
        };
        doAuth();
        return deferred.promise;
      }
    };
  }]);