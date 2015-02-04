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

/*
  Save a doc
 */

/*
  List docs
 */

/*
  Read doc
 */

/*
  Create DB on Cloudant
  -- For WebApps *don't* forget to allow CORS
 */

/*
  Sync to from DB
 */
