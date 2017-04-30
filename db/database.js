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

//yy-mm-dd to dd/mm/yy
function yymmddToddmmyy(date){
  var x = date.split("-");
  return (x[2] + '/' + x[1]  + '/' + x[0]);
}
//dd/mm/yy to yy-mm-dd
function ddmmyyToyymmdd(date){
  var x = date.split("/");
  return (x[2] + '-' + x[1]  + '-' + x[0]);
}

//tất cả các kỳ kinh
  exports.all_period = function(username) {
      var periodIDs = docURI.route('periodIDs/:Username/:FirstDay');
      // Get all period from the database
      period.allDocs({include_docs: true}).then(function (docs) {
          var all_start = '<option value="None" >-- Chọn kỳ kinh --</option>';
          var i = 0;
          var id;
          var start;
          // Generate the table body
          for ( i = 0; i < docs.total_rows; i++) {
            start = periodIDs(docs.rows[i].doc._id);
            id = {Username: username, FirstDay: start.FirstDay};
            if(periodIDs(id) == docs.rows[i].doc._id)
              all_start += '<option id ="option" value="' + yymmddToddmmyy(start.FirstDay) + '">' + yymmddToddmmyy(start.FirstDay) +'</option>';
          }
          // Fill the table content
          document.getElementById('all_start').innerHTML = all_start;
        });
};

//tìm ngày kết thúc và kỳ kinh kéo dài
  exports.find_endday = function(username, start){
    period.get('periodIDs/'+username+'/'+ ddmmyyToyymmdd(start)).then(function(doc){
      //tìm ra ngày kết thúc
      document.getElementById('end').value = yymmddToddmmyy(doc.LastDay);

      //in ra kỳ kinh kèo dài
      var end = document.getElementById("end").value;
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      var x = start.split("/");
      var y = end.split("/");
      var s = new Date(x[2], x[1] - 1, x[0]);
      var e = new Date(y[2], y[1] - 1, y[0]);
      var kykinh = Math.round((e.getTime() - s.getTime())/oneDay) + 1;
      document.getElementById("kykinh").innerHTML = kykinh;
    });
  };

//chỉnh sửa kỳ kinh
  exports.updatePeriod = function(username, start, end){
    period.get('periodIDs/'+username+'/'+ ddmmyyToyymmdd(start))
      .then(function(doc) {
        doc.LastDay = ddmmyyToyymmdd(end)
        return period.put(doc)   // put updated doc, will create new revision
      }).then(function (res) {
        alert("Cập nhật thành công!")
        console.log(res)
      })
  }

//Xóa kỳ kinh
exports.deletePeriod = function(username, start){
  period.get('periodIDs/'+username+'/'+ddmmyyToyymmdd(start))
    .then(function (doc) {
      doc._deleted = true
      return period.put(doc)
      alert("Xóa thành công!")
    })
}

//period.destroy();
