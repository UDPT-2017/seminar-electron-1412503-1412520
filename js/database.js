var user = new PouchDB('User');
var period = new PouchDB('Period');


exports.addUser = function(username, password, lastPeriod, mentsCycle, avgPeriod)
{
    var person = {
      "_id": username,
      "Password": password,
      "LastPeriod": lastPeriod,
      "MentsCycle": mentsCycle,
      "AvgPeriod": avgPeriod
    };
    user.put();
};

//thêm kỳ kinh
exports.addPeriod = function(username, start, end)
{
    var period1 = {
      "_id": username + start,
      "username": username,
      "start": start,
      "end": end
    };
    period.put(period1).then(function(response){
      console.log("success", response)
      alert("Đã thêm kỳ kinh!");
    }).then(function(err){
      console.log("Error", err)
    });
};

//tất cả các kỳ kinh
  exports.all_period = function() {
      // Get all period from the database
      period.allDocs({include_docs: true}).then(function (docs) {
          console.log(docs);
          console.log(docs.total_rows);
          var all_start = '<option value="None" >-- Chọn kỳ kinh --</option>';
          var i = 0;
          // Generate the table body
          for ( i = 0; i < docs.total_rows; i++) {
            // console.log("docs thứ mấy k biết nữa" + docs.rows[i].doc._id);
            all_start += '<option id ="option" value="' + docs.rows[i].doc.start + '">' + docs.rows[i].doc.start+'</option>'
          }

          // Fill the table content
          document.getElementById('all_start').innerHTML = all_start;
        });
};

//tìm ngày kết thúc và kỳ kinh kéo dài
  exports.find_endday = function(username, start){
    period.get(username+start).then(function(doc){
      //in ra ngày kết thúc
      document.getElementById('end').value = doc.end;

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
    period.get(username+start)
      .then(function(doc) {
        doc.end = end// new field
        // console.log(doc._rev) // doc has a '_rev' field
        return period.put(doc)   // put updated doc, will create new revision
      }).then(function (res) {
        alert("Cập nhật thành công!")
        console.log(res)
      })
  }

//Xóa kỳ kinh
exports.deletePeriod = function(username, start){
  period.get(username + start)
    .then(function (doc) {
      doc._deleted = true
      return period.put(doc)
      alert("Xóa thành công!")
    })
}


// <select id ="">
//   <option value="None" >-- Select --</option>
//
// </select>

// period.get('ThaoLua04/13/2017')
//   .then(function(doc) {
//     console.log(doc)
//   })
//   .catch(function (err) {
//     console.log(err)
//   })


// users_db
//  .info()
//  .then(function (info) {
//    console.log(info);
//  })

//Thêm
// user.put({
//   _id: 'ThaoLua',
//   password: '123456',
//   MentsCycle: '30',
//   AvgPeriod: '5'
// }).then(function(response){
//   console.log("success", response)
// }).then(function(err){
//   console.log("Error", err)
// })
//
// period.put({
//   _id: 'ThaoLua',
//   password: '123456',
//   MentsCycle: '30',
//   AvgPeriod: '5'
// }).then(function(response){
//   console.log("success", response)
// }).then(function(err){
//   console.log("Error", err)
// })

//
// users_db.put({
//   _id: 'Thi',
//   password: '654321',
//   kykinhkeodai: '5',
//   kyhanhkinh: '28'
// }).then(function(response){
//   console.log("success", response)
// }).then(function(err){
//   console.log("Error", err)
// })

//Đọc
// users_db
//   .get('ThaoLua')
//   .then(function(doc) {
//     console.log(doc)
//   })
//   .catch(function (err) {
//     console.log(err)
//   })
//
//   users_db
//     .get('Thi')
//     .then(function(doc) {
//       console.log(doc)
//     })
//     .catch(function (err) {
//       console.log(err)
//     })

    // Thêm nhiều cùng một lúc
    // users_db.bulkDocs([
    //   {
    //     _id: 'Thanh',
    //     password: '654321',
    //      kykinhkeodai: '5',
    //      kyhanhkinh: '31'
    //   },
    //   {
    //     _id: 'Nga',
    //     password: '654321',
    //      kykinhkeodai: '5',
    //      kyhanhkinh: '32'
    //   }
    // ])


//Đọc nhiều cùng một lúc
// nếu thiếu {include_docs: true}, bạn chỉ nhận kết quả ID của doc
// users_db
//   .allDocs({include_docs: true})
//   .then(function (docs) {
//     console.log(docs)
//   })


//Cập nhật
// users_db
//   .get('user')
//   .then(function(doc) {
//     doc.kyhanhkinh = "30"    // new field
//     console.log(doc._rev) // doc has a '_rev' field
//     return users_db.put(doc)   // put updated doc, will create new revision
//   }).then(function (res) {
//     console.log(res)
//   })
//


//Xóa db
// users_db
//   .get('user')
//   .then(function (doc) {
//     doc._deleted = true
//     return users_db.put(doc)
//   })

//users_db.destroy();
