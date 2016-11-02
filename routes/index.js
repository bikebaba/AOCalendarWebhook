/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/authHelper.js');
var dbHelper = new (require('../helpers/dbHelper'))();
var requestHelper = require('../helpers/requestHelper.js');
var subscriptionConfiguration = require('../constants').subscriptionConfiguration;

/* Redirect to start page */
router.get('/', function (req, res) {
  res.redirect('/index.html');
  //console.log("authHelper.getAuthUrl()");
  //console.log(authHelper.getAuthUrl());
  //res.redirect(authHelper.getAuthUrl());
});

/* Start authentication flow */
router.get('/signin', function (req, res) {
  console.log(authHelper.getAuthUrl());
  res.redirect(authHelper.getAuthUrl());
});

router.get('/hello', function(req, res) {
  console.log(req.body);
  console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUU");
  res.send("Hello World");
});

router.post('/createEventwithoutToken', function(req, res) {

  req.query.refresh_token = 'AQABAAAAAADRNYRQ3dhRSrm-4K-adpCJOcgKWcwfAwnjzaBCsjeVjaRiaP8C_PR3sfbLi1D8curiaARNRFu69Zlgb0C_XRPtSysQeOZUlEA-8ojvdXBVHLY7hm1T9O8e2TN8IYZpMXata8-8CeYK77XzCH7Xe9VFbKsTbxWDLbonHd9j0eHkF1_e41vGQOqXYbMiPyNYUlbaIGGne2M5_swRiyeCotIEhDfFOcRNupkoObY37S7C444-AT4oUOfL6oEXAq--FyS4cTUjKHw6GVRWjInB0_uE8tODdK96NbAV09NIzS9xwp1-AZngBoBKG-mfmhR8gWdsDscbRs6BHqj_xrf9JoQ52p801U_omxUqHAXDyjv_VRvECT5a_NU5a2XdENOj42CtOc7csNmDsVoBzvA0FgRV9n9k4zjG8J3Cw349vgR3JTFrkVv9XefPAkNUTBZ7Ut5wGje0EoApC43w1MVuWtuiBvRCC3qA7qZIoeH8snrAs3WDMQjwOIwF5AuvJUYlMAAFQ7K_47DPtUaPtJ7B4WncNxFkPn9sRSQ6kKp2yaJpNRZROBjqisdnh0BQPHxgghCAIIhjiyvV9MvUyMuokPf5oySc0nvyzaWWmcP6zJqN3vz9n9fSl6fRWvAlAr_AgPPVFUoqw1T_rqOkZFaJUinL14yFi2oaSZ3Rv4-xd-ltTnm90lwHP-GERJZEB8ssQ7sEMDwf4Tu1uxACPgv1DFUs1NPPodwv94DeYLw_dK0ewZNLu-jYpn2GOny2pC7hhFiRHwYdHvzQMABKxY8ztngl5EmBRrZlovGzIZ-mdiL3uiAA';
  req.query.grant_type='refresh_token';
  authHelper.createEventwithoutToken(req, res);

  //res.send("GetInfo");
});



// This route gets called at the end of the authentication flow.
// It requests the subscription from Office 365, stores the subscription in a database,
// and redirects the browser to the dashboard.html page.
router.get('/callback', function (req, res, next) {
  var subscriptionId;
  var subscriptionExpirationDateTime;

  console.log("****************************req.query**************************");
  //console.log(req.query);

  authHelper.getTokenFromCode(req.query.code, function (authenticationError, token) {
    if (token) {
      // Request this subscription to expire one day from now.
      // Note: 1 day = 86400000 milliseconds
      // The name of the property coming from the service might change from
      // subscriptionExpirationDateTime to expirationDateTime in the near future.
      subscriptionExpirationDateTime = new Date(Date.now() + 86400000).toISOString();
      subscriptionConfiguration.expirationDateTime = subscriptionExpirationDateTime;
      // Make the request to subscription service.
      console.log("***********token.accessToken***********");
      console.log(token.accessToken);
      requestHelper.postData(
        '/v1.0/subscriptions',
        //'/beta/subscriptions',
        token.accessToken,
        JSON.stringify(subscriptionConfiguration),
        function (requestError, subscriptionData) {
          if (subscriptionData) {
            subscriptionData.userId = token.userId;
            subscriptionData.accessToken = token.accessToken;
            dbHelper.saveSubscription(subscriptionData, null);
            // The name of the property coming from the service might change from
            // subscriptionId to id in the near future.
            subscriptionId = subscriptionData.id;
            res.redirect(
              '/dashboard.html?subscriptionId=' + subscriptionId +
              '&userId=' + subscriptionData.userId
            );
          } else if (requestError) {
            res.status(500);
            next(requestError);
          }
        }
      );
    } else if (authenticationError) {
      res.status(500);
      next(authenticationError);
    }
  });
});

// This route signs out the users by performing these tasks
// Delete the subscription data from the database
// Redirect the browser to the logout endpoint.
router.get('/signout/:subscriptionId', function (req, res) {
  var redirectUri = req.protocol + '://' + req.hostname + ':' + req.app.settings.port;

  // Delete the subscription from Microsoft Graph
  dbHelper.getSubscription(req.params.subscriptionId, function (dbError, subscriptionData, next) {
    if (subscriptionData) {
      requestHelper.deleteData(
        '/beta/subscriptions/' + req.params.subscriptionId,
        subscriptionData.accessToken,
        function (error) {
          if (!error) {
            dbHelper.deleteSubscription(req.params.subscriptionId, null);
          }
        }
      );
    } else if (dbError) {
      res.status(500);
      next(dbError);
    }
  });

  res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=' + redirectUri);
});

module.exports = router;
