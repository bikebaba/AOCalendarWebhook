/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

var AuthenticationContext = require('adal-node').AuthenticationContext;
var adalConfiguration = require('../constants.js').adalConfiguration;
var resource = 'https://graph.microsoft.com/';

/**
 * Generate a fully formed uri to use for authentication based on the supplied resource argument
 * @return {string} a fully formed uri with which authentication can be completed.
 */
function getAuthUrl() {
  return adalConfiguration.authority + '/oauth2/authorize' +
    '?client_id=' + adalConfiguration.clientID +
    '&response_type=code' +
    '&redirect_uri=' + adalConfiguration.redirectUri;
}

/**
 * Gets a token for a given resource.
 * @param {string} code An authorization code returned from a client.
 * @param {string} res A URI that identifies the resource for which the token is valid.
 * @param {AcquireTokenCallback} callback The callback function.
 */
function getTokenFromCode(code, callback) {
  var authContext = new AuthenticationContext(adalConfiguration.authority);

  console.log("In getTokenFromCode...");
  authContext.acquireTokenWithAuthorizationCode(
    code,
    adalConfiguration.redirectUri,
    resource,
    adalConfiguration.clientID,
    adalConfiguration.clientSecret,
    function (error, token) {
      if (error) {
        callback(error, null);
      } else {
        callback(null, token);
      }
    }
  );
}

function getNewToken(req, res){
  var requestForToken = require("request");
  refresh_token = "AQABAAAAAADRNYRQ3dhRSrm-4K-adpCJSBTzkr1lIJUiRN-48OYJYymH5rvbSb-dgcjhn9hAAx95e8zhiVI1JPPZYfP8jgeB3z6dMXs1Pk5QQs8jht8vReTU1VTYzgyLhscLNZYJbbQdPDuzGbB28GkbwQ0gs0KFRYXirWCmuKke-IhAxSiEnAAI_CCpWPbQlVyva_Gfe1dsbqDNwASv5F3nvI3IXgdx7nrgWdTlifOW9QS76zjNVueLzJ1J5B-n2Ve1rcvDw036SUNwVgztXjTv8Q2x8mRLgtmcRnd5rKt3LFJ-DekRHz3jF1TqIfF0nR7cOiFImsCOwYrU4uiZLjcbAjKhcOwl018VArISfAPcxRvcW1p03sUcScWxG7MchsOYPmNjUVuk793uLNO7MdOg4LUeNqtpWK6DPoAnDCA-w79vWK9C3fIZz82_50DZJ8LlGtnxXoz4n_1bjOph096LtXFl3gx70d9To4IRs2WfPcmoGf_qlOPDANU_0RqOIxPkl4ofNnu6DGFP6yiuzqt_mZTDtdJfycFxyuGBM4UtXKEMIybeJp08RVoSWDOGrPIwUa_6O3WArVZdhP1X6c8UixHInaOIsutdE8LL801ThSO1K9vXn7dGm0mMXeB2BarVgapM5qja5EIlR6i_TpmwFYXyUG3fRafZmeAlf9XUD-e_1EKbfXP-cCkOVYCGpb7nUdZRq2rSU8Rwgoivw3TI8Dw5U3EZIAA";
  var options = {method: 'POST',
                url: 'https://login.microsoftonline.com/7e7701a8-2613-4c2f-980c-5dd3076b7a6f/oauth2/token',
                form:
                {grant_type: 'refresh_token',
                  //refresh_token: 'AAABAAAAiL9Kn2Z27UubvWFPbm0gLYrVyYqIHJkS-Aq8MnoCdMJQkLyFJRDXOuz-M98HfUATtVAwBO2AG40xZXBrb7jcS1Bq2ZmQoVc-IHtWcJ7TQlrcWqojPwHuKMKrYlE7S3xqZT9x8-LZQ2QxNrcg5ZW5c9Vly1H_4sIYvkVjd8nNBkE7lC8vI89LnhOi44_P-4y-ZBPuAsr8zgccD6bABQQvRAauEE6L_kkuiWw-U-JfwsSTC_CltdyNINbPO7L-uIzJMaj-0Tblt_3kcmMELaaOXjlOf-1xZ8y9NnQRD2ugxZOsrRpo0BopftaxJNl6Aeac9ZQPFvyZK3jNcs5I6rQsZzokjsahRX_uyXqntfqm8ftGaufp2GOa9QD2XdHK8WmJsniUOlFIpWLdAhZv5tHJMAJSZ61fkNRrcf_ayiSp_Ud5rSdW5QBGlmgeYgs8DS-mN-ZpkHi8gqKx_ZRsGNUQnaade3d3u5_T-t71pxZ093uSCwwTeRsAixA0vIxPgj4QMs1aqIghij8ZrYuzo0LkW9nKBYsedIm5FXN1ugr1cDz1OhoJfk220y55-Jhdb55jc4iwDZPzImlfOhivIaKi5MRTUzRuD9lZUMzo69aXvecgAA',
                  refresh_token:refresh_token,
                  client_id: adalConfiguration.clientID,
                  clientID: adalConfiguration.clientID,
                  client_secret: adalConfiguration.clientSecret,
                  clientSecret: adalConfiguration.clientSecret
                }};

  requestForToken(options, function(error, responseToken, body) {
    if (error)
      throw new Error(error);
    console.log(body.access_token);
  });

}

function createEventwithoutToken(req, res){

  // First get New Token
  var request = require("request");
  console.log("req");
  console.log(req.body);
  console.log("IN getnewtoken");
  //console.log(req.query.refresh_token);
  req.query.refresh_token = "AQABAAAAAADRNYRQ3dhRSrm-4K-adpCJSBTzkr1lIJUiRN-48OYJYymH5rvbSb-dgcjhn9hAAx95e8zhiVI1JPPZYfP8jgeB3z6dMXs1Pk5QQs8jht8vReTU1VTYzgyLhscLNZYJbbQdPDuzGbB28GkbwQ0gs0KFRYXirWCmuKke-IhAxSiEnAAI_CCpWPbQlVyva_Gfe1dsbqDNwASv5F3nvI3IXgdx7nrgWdTlifOW9QS76zjNVueLzJ1J5B-n2Ve1rcvDw036SUNwVgztXjTv8Q2x8mRLgtmcRnd5rKt3LFJ-DekRHz3jF1TqIfF0nR7cOiFImsCOwYrU4uiZLjcbAjKhcOwl018VArISfAPcxRvcW1p03sUcScWxG7MchsOYPmNjUVuk793uLNO7MdOg4LUeNqtpWK6DPoAnDCA-w79vWK9C3fIZz82_50DZJ8LlGtnxXoz4n_1bjOph096LtXFl3gx70d9To4IRs2WfPcmoGf_qlOPDANU_0RqOIxPkl4ofNnu6DGFP6yiuzqt_mZTDtdJfycFxyuGBM4UtXKEMIybeJp08RVoSWDOGrPIwUa_6O3WArVZdhP1X6c8UixHInaOIsutdE8LL801ThSO1K9vXn7dGm0mMXeB2BarVgapM5qja5EIlR6i_TpmwFYXyUG3fRafZmeAlf9XUD-e_1EKbfXP-cCkOVYCGpb7nUdZRq2rSU8Rwgoivw3TI8Dw5U3EZIAA";
  var options = {method: 'POST',
    url: 'https://login.microsoftonline.com/7e7701a8-2613-4c2f-980c-5dd3076b7a6f/oauth2/token',
    form:
    {grant_type: 'refresh_token',
      refresh_token: req.query.refresh_token,
      client_id: adalConfiguration.clientID, //'0aca55fd-3cd9-40a6-aa78-ae6fcd1ab359',
      clientID: adalConfiguration.clientID,
      client_secret: adalConfiguration.clientSecret,
      clientSecret: adalConfiguration.clientSecret
    }};

  request(options, function(error, response, body) {
    if (error)
      throw new Error(error);

    //At this point, the token is ready to be sent to create the event


    /********************************************/
    var http = require("https");
    req.headers.authorization = JSON.parse(body)["access_token"];
    var options = {
      "method": "POST",
      "hostname": "graph.microsoft.com",
      "port": null,
      "path": "/v1.0/me/events",
      "headers": {
        "content-type": "application/json",
        "authorization": "Bearer " + req.headers.authorization,
        "cache-control": "no-cache"
      }
    };

    if (req.body.eventType == 'Personal') {
      options.path = "/v1.0/me/calendars/AQMkAGIzYTViZjgzLWYzN2QtNDUwMi1hMTM2LTNhNjk0MzJlNGQ3MwBGAAADolT90U35WEqIgZEtrX96eQcAbDi5PtVI3UuU5SGDPugV1QAAAgEGAAAAbDi5PtVI3UuU5SGDPugV1QAAAaJmFgAAAA==/events/"
    }

    var request1 = http.request(options, function (response1) {
      var chunks = [];

      console.log("XX");
      response1.on("data", function (chunk) {
        chunks.push(chunk);
        console.log("AA");
      });

      response1.on("end", function () {
        var body1 = Buffer.concat(chunks);
        console.log("ZZ");
        res.writeHead(200, {"Content-Type": "Application/json"});
        res.write(body1.toString());
        res.end();
      });
    });


    request1.write(JSON.stringify(req.body));
    request1.end();

  });

}


exports.getAuthUrl = getAuthUrl;
exports.getNewToken = getNewToken;
exports.getTokenFromCode = getTokenFromCode;
exports.createEventwithoutToken = createEventwithoutToken;
