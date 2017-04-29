var user = new PouchDB('User');
var period = new PouchDB('Period');
var docURI = require('docuri');

exports.addUser = function(username, password, lastPeriod, mentsCycle, avgPeriod, callback)
{
    var person = {
      "_id": username,
      "Password": password,
      "LastPeriod": lastPeriod,
      "MentsCycle": mentsCycle,
      "AvgPeriod": avgPeriod
    };

    user.put(person).then(function()
    	{
    		callback(null);
    	}).catch(function(err){
    		callback(err);
    	}); 
};

exports.getUser = function(username, password, callback)
{
    user.get(username).then(function(doc)
    {
    	callback(doc);
    }).catch(function(err){
    	console.log(err);
    	return 0;
    });                                                                                                                                                                                                 
};

exports.updateUser = function(username, newUsername, newPassword, newMentsCycle, newAvgPeriod)
{
    user.get(username).then(function(doc)
    {
    	return user.put({
    		_id: newUsername,
    		_rev: doc._rev,
    		Password: newPassword,
      		LastPeriod: lastPeriod,
      		MentsCycle: newMentsCycle,
      		AvgPeriod: newAvgPeriod
  		});
    }).catch(function(err){
    	console.log(err);
    	return 0;
    });                                                                                                                                                                                                 
};


exports.addPeriod = function(username, firstDay, lastDay)
{

  var periodIDs = docURI.route('periodIDs/:Username/:FirstDay');
  var id = {Username: username, FirstDay: firstDay};
    var per = {
      "_id": periodIDs(id),      //chuyển object id thành chuỗi (để chuyển ngược _id thành id dùng periodIDs(_id))
      "LastPeriod": lastDay,
    };

    period.put(per).then(function()
      {
        callback(null);
      }).catch(function(err){
        callback(err);
      }); 
};


