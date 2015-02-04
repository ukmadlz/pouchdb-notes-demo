'use strict';
/***
  App.js - The actual workings of the demo
***/

/*
  Cloudant details
 */
var cloudant = {
  account: "ACCOUNTNAME",
  apikey: "APIKEY",
  apipass: "APIPASS"
}
/* Disable the form till account details set */
$('#notes-form .form-control').attr('disabled','disabled');

$('#cloudant-details').on('submit',function(){

  // Set the username && password
  cloudant.account = cloudant.apikey = $('#cloudant-username').val();
  cloudant.apipass = $('#cloudant-password').val();
  $('#notes-form .form-control').removeAttr('disabled');
  $('#cloudant-details').remove();

  /*
    Grab the DB name based on fragment
   */
  var dbname = window.location.hash.substring(1);
  // Validate DBNAME
  if(dbname=="") {
    alert('Please provide a URL hash as the dbname');
    window.location.href = "#exampledbname";
  }

  /*
    Initialise PouchDB
   */
  var db = new PouchDB(dbname);

  /*
    Save a doc
   */
  $('#notes-form').on('submit',function(){

    var doc = {
      title: $('#note-title').val(),
      details: $('#note-details').val()
    }

    // Handle response
    var handleUpdateCreate = function(error,response) {
      if(error) {
        console.warn(error);
      }
      $('#notes-form').attr('data-id',response.id);
      // Repopulate list
      listDocs();

      alert('Saved');
    }

    // Update or Create
    var docId = $('#notes-form').attr('data-id');
    console.log(docId);
    if(docId==''&& typeof docId != 'undefined') {
      // Create
      db.post(doc,handleUpdateCreate);
    } else {
      // Update
      db.get(docId, function(err, originalDoc) {
        db.put(doc, docId, originalDoc._rev, handleUpdateCreate);
      });
    }

  });

  /*
    List docs
   */
  var listDocs = function() {
    db.allDocs({include_docs: true}, function(err, response) {
      var docs = response.rows;
      $.each(docs,function(key,value){
        var listItem = ' ' + value.doc.title;
        if($('#note-list li#'+value.id).length){
          var assignedClasses = $('#note-list li#'+value.id+' span').att('class');
          listItem = "<span class=\""+assignedClasses+"\" aria-hidden=\"true\"></span>" + listItem;
          $('#note-list li#'+value.id).html(listItem);
        } else {
          listItem = "<li id=\"" + value.id + "\" ><span class=\"glyphicon glyphicon-hdd\" aria-hidden=\"true\"></span>" + listItem + "</li>";
          $('#note-list').append(listItem);
        }
      })
    });
  }
  listDocs();

  /*
    Read doc
   */
  $('#note-list').on('click','li',function(){
    var docId = $(this).attr('id');
    db.get(docId,function(error, response){
      if(error) {
        console.warn(error);
      }
      $('#notes-form').attr('data-id',response._id);
      $('#note-title').val(response.title);
      $('#note-details').val(response.details);
    })
  })

  /*
    New Note
   */
  $('#new-note').on('click',function(){
    $('#notes-form').attr('data-id','');
    $('#note-title').val('');
    $('#note-details').val('');
  });

  /*
    Note's changed
   */
  $('#notes-form .form-control').on('change',function(){
    var docId = $('#notes-form').attr('data-id');
    if(docId!=''&& typeof docId != 'undefined') {
      var editedSpan = '<span class="glyphicon glyphicon-save" aria-hidden="true"></span>';
      $('#note-list li#'+docId+' span').replaceWith(editedSpan);
    }
  });

  /*
    Create DB on Cloudant
    -- For WebApps *don't* forget to allow CORS
   */

  /*
    Sync to from DB
   */
   var remoteDb = "https://"+cloudant.apikey+":"+cloudant.apipass+"@"+cloudant.account+".cloudant.com/"+dbname;
   db.replicate.to(remoteDb);
   db.replicate.from(dbname);
   $('#sync-notes').on('click',function() {
     db.sync(remoteDb);
     //listDocs();
     var cloudSpan = '<span class="glyphicon glyphicon-cloud" aria-hidden="true"></span>';
     $('#note-list li span').replaceWith(cloudSpan);
   });


 });
