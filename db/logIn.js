const database = require('../db/database');
const {ipcRenderer} = require('electron');
var error = false;



window.onload = function (){

  $('#contact_form').bootstrapValidator({
//        live: 'disabled',
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            userName: {
                validators: {
                    notEmpty: {
                        message: 'Username is required and cannot be empty'
                    }
                }
            },
            mCy: {
              validators: {
                    notEmpty: {
                        message: 'Your menstrual cycle must be provided'
                    }
                }
            },
            avgP: {
              validators: {
                    notEmpty: {
                        message: 'Your average period must be provided'
                    }
                }
            },
            pass: {
              validators: {
                    notEmpty: {
                        message: 'Password is required and cannot be empty'
                    }
                }
            },
            RePassword: {
              validators: {
                    notEmpty: {
                        message: 'The field\'s content doesn\'t match your password' 
                    },
                    identical: {
                        field: 'pass',
                        message: 'The password and its confirm are not the same'
                    }
                }
            }
        }}).on('error.form.bv', function(e) {
           document.getElementById('success').classList.remove('show');
            document.getElementById('success').classList.add('hide');
            document.getElementById('fail').classList.remove('hide');
            document.getElementById('fail').classList.add('show');
            document.getElementById('fail').innerHTML = "Are you sure your information meets our standards??";
            error = true; 

    }) .on('success.form.bv', function(e) {
            error = false;
            // If you want to prevent the default handler (bootstrapValidator._onSuccess(e))
            // e.preventDefault();
        });

        /* $('#lgin').click(function() {
        $('#contact_form').bootstrapValidator('validate');
    });*/
  

   //đăng ký
  document.getElementById('lgin').addEventListener('click', () => {
    $('#contact_form').bootstrapValidator('validate');

    // Retrieve the input fields
    var username = document.getElementById('name').value;
    var password = document.getElementById('pass').value;
    var password2 = document.getElementById('RePassword').value;
    var lastPeriod = document.getElementById('PD').value;
    var mentsCycle = document.getElementById('MC').value;
    var avgPeriod = document.getElementById('AP').value;

    console.log(lastPeriod);

    if (error === false)
    {
      // Save the person in the database
      database.addUser(username, password, lastPeriod, mentsCycle, avgPeriod, function(err){
        if (err !== null)
        {
              document.getElementById('success').classList.remove('show');
              document.getElementById('success').classList.add('hide');
              document.getElementById('fail').classList.remove('hide');
              document.getElementById('fail').classList.add('show');
              document.getElementById('fail').innerHTML = "Username Has Been Used";
              console.log(err);
        }
        else
        {
              /*document.getElementById('fail').classList.remove('show');
              document.getElementById('fail').classList.add('hide');
              document.getElementById('success').classList.remove('hide');
              document.getElementById('success').classList.add('show');*/
              swal({
                title: "Success!",
                text: "You now have a brand new account!",
                type: "success",
                confirmButtonText: "Cool"
                },
                  function(isConfirm){
                    if (isConfirm)
                    {
                      console.log('kay');
                      $('#myModal').modal('toggle');
                      location.reload();
                    }
                });

        }
    });
    }

    


  });

    //đăng nhập
    document.getElementById('sin').addEventListener('click', () => {

    var res = undefined;

    var username = document.getElementById('UserName').value;
    var password = document.getElementById('Password').value;

    database.getUser(username, password, function(doc, err){
      if (err !== null)
      {
            ipcRenderer.send('SignIn', 0);
            swal({
            title: "Oops!!",
            text: "You might mistype your username!",
            type: "error",
            confirmButtonText: "Try again",
            confirmButtonColor: "#DD6B55"
        });
      }
      else
      {

        if (doc.Password.localeCompare(password) !== 0)
          {
            ipcRenderer.send('SignIn', 0);
            swal({
            title: "Oops!!",
            text: "You might mistype your password!",
            type: "error",
            confirmButtonText: "Try again",
            confirmButtonColor: "#DD6B55"
        });
          }
        else
          {
            //database.addPeriod(username, '2017-04-24', '2017-04-28');
            ipcRenderer.send('SignIn', doc);
          }
      }
    });

  });


    ipcRenderer.once('CreateUserReply', (event, arg)=>{
      console.log(arg);
    });
}
