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
    	callback(doc, null);
    }).catch(function(err){
      callback(null, err);
    	console.log(err);
    	return 0;
    });
};

exports.updateUser = function(username, newPassword, newMentsCycle, newAvgPeriod, callback)
{
    user.get(username).then(function(doc)
    {
      callback(null);
    	return user.put({
			_id: username,
    		_rev: doc._rev,
    		Password: newPassword,
      		MentsCycle: newMentsCycle,
      		AvgPeriod: newAvgPeriod
  		});
    }).catch(function(err){
    	console.log(err);
      callback(err);
    	return 0;
    });
};


exports.addPeriod = function(username, firstDay, lastDay, callback)
{

  var periodIDs = docURI.route('periodIDs/:Username/:FirstDay');
  var id = {Username: username, FirstDay: firstDay};
    var per = {
      "_id": periodIDs(id),      //chuyển object id thành chuỗi (để chuyển ngược _id thành id dùng periodIDs(_id))
      "LastDay": lastDay,
    };
      period.put(per).then(function()
        {
            callback(null);
        }).catch(function(err){
            callback(err);
        });
};

exports.getAllPeriod = function(username, callback)
{
    var periodIDs = docURI.route('periodIDs/:Username/:FirstDay');
      // Get all period from the database
      period.allDocs({include_docs: true}).then(function (docs) {
        var res = [];
        for ( i = 0; i < docs.total_rows; i++) {
            start = periodIDs(docs.rows[i].doc._id);
            id = {Username: username, FirstDay: start.FirstDay};
            if(periodIDs(id).localeCompare(docs.rows[i].doc._id) === 0)
              res.push(docs.rows[i].doc);
          }
          callback(res, null);
      }).catch(function(err){
          callback(null, err);
      })
}


//tìm ngày kết thúc
  exports.find_endday = function(username, start, callback){
    period.get('periodIDs/'+username+'/'+ start).then(function(doc){
      callback(doc.LastDay, null);
    }).catch(function(err){
        callback(null, err);
    });
  };

//chỉnh sửa kỳ kinh
  exports.updatePeriod = function(username, start, end, callback){
    period.get('periodIDs/'+username+'/'+ start)
      .then(function(doc) {
        doc.LastDay = end;
        callback(null);
        return period.put(doc) ;  // put updated doc, will create new revision
      }).catch(function(err){
      	console.log(err);
        callback(err);
      	return 0;
      });
  }

//Xóa kỳ kinh
exports.deletePeriod = function(username, start, callback){
  period.get('periodIDs/'+username+'/'+start)
    .then(function (doc) {
      doc._deleted = true
      callback(null);
      return period.put(doc)
    }).catch(function(err){
      callback(err);
      return 0;
    });
}

//period.destroy();
