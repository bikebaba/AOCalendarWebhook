/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
var express = require('express');
var router = express.Router();
var io = require('../helpers/socketHelper.js');
var requestHelper = require('../helpers/requestHelper.js');
var authHelper = require('../helpers/authHelper.js');
var dbHelper = new (require('../helpers/dbHelper'))();
var http = require('http');

var adalConfiguration = require('../constants.js').adalConfiguration;

var clientStateValueExpected = require('../constants').subscriptionConfiguration.clientState;
var moment = require('moment');
moment().format();

/* Default listen route */
router.post('/', function (req, res, next) {
  var status;
  var clientStatesValid;
  var i;
  var resource;
  var subscriptionId;

  console.log("In the listen.js router");
  // If there's a validationToken parameter in the query string,
  // then this is the request that Office 365 sends to check
  // that this is a valid endpoint.
  // Just send the validationToken back.
  console.log("***********req.headers***********");
  console.log(req.headers);
  console.log("***********req.body***********");
  console.log(req.body);
  if (req.query && req.query.validationToken) {
    console.log("1");
    res.send(req.query.validationToken);
    // Send a status of 'Ok'
    status = 200;
  } else {
    console.log("2");
    clientStatesValid = false;

    // First, validate all the clientState values in array
    for (i = 0; i < req.body.value.length; i++) {
      if (req.body.value[i].clientState !== clientStateValueExpected) {
        // If just one clientState is invalid, we discard the whole batch
        clientStatesValid = false;
        break;
      } else {
        clientStatesValid = true;
      }
    }

    // If all the clientStates are valid, then
    // process the notification
    if (clientStatesValid) {

      var requestForToken = require("request");
      refresh_token_data = "AQABAAAAAADRNYRQ3dhRSrm-4K-adpCJSBTzkr1lIJUiRN-48OYJYymH5rvbSb-dgcjhn9hAAx95e8zhiVI1JPPZYfP8jgeB3z6dMXs1Pk5QQs8jht8vReTU1VTYzgyLhscLNZYJbbQdPDuzGbB28GkbwQ0gs0KFRYXirWCmuKke-IhAxSiEnAAI_CCpWPbQlVyva_Gfe1dsbqDNwASv5F3nvI3IXgdx7nrgWdTlifOW9QS76zjNVueLzJ1J5B-n2Ve1rcvDw036SUNwVgztXjTv8Q2x8mRLgtmcRnd5rKt3LFJ-DekRHz3jF1TqIfF0nR7cOiFImsCOwYrU4uiZLjcbAjKhcOwl018VArISfAPcxRvcW1p03sUcScWxG7MchsOYPmNjUVuk793uLNO7MdOg4LUeNqtpWK6DPoAnDCA-w79vWK9C3fIZz82_50DZJ8LlGtnxXoz4n_1bjOph096LtXFl3gx70d9To4IRs2WfPcmoGf_qlOPDANU_0RqOIxPkl4ofNnu6DGFP6yiuzqt_mZTDtdJfycFxyuGBM4UtXKEMIybeJp08RVoSWDOGrPIwUa_6O3WArVZdhP1X6c8UixHInaOIsutdE8LL801ThSO1K9vXn7dGm0mMXeB2BarVgapM5qja5EIlR6i_TpmwFYXyUG3fRafZmeAlf9XUD-e_1EKbfXP-cCkOVYCGpb7nUdZRq2rSU8Rwgoivw3TI8Dw5U3EZIAA";
      var options = {
        method: 'POST',
        url: 'https://login.microsoftonline.com/7e7701a8-2613-4c2f-980c-5dd3076b7a6f/oauth2/token',
        form: {
          grant_type: 'refresh_token',
          //refresh_token: 'AAABAAAAiL9Kn2Z27UubvWFPbm0gLYrVyYqIHJkS-Aq8MnoCdMJQkLyFJRDXOuz-M98HfUATtVAwBO2AG40xZXBrb7jcS1Bq2ZmQoVc-IHtWcJ7TQlrcWqojPwHuKMKrYlE7S3xqZT9x8-LZQ2QxNrcg5ZW5c9Vly1H_4sIYvkVjd8nNBkE7lC8vI89LnhOi44_P-4y-ZBPuAsr8zgccD6bABQQvRAauEE6L_kkuiWw-U-JfwsSTC_CltdyNINbPO7L-uIzJMaj-0Tblt_3kcmMELaaOXjlOf-1xZ8y9NnQRD2ugxZOsrRpo0BopftaxJNl6Aeac9ZQPFvyZK3jNcs5I6rQsZzokjsahRX_uyXqntfqm8ftGaufp2GOa9QD2XdHK8WmJsniUOlFIpWLdAhZv5tHJMAJSZ61fkNRrcf_ayiSp_Ud5rSdW5QBGlmgeYgs8DS-mN-ZpkHi8gqKx_ZRsGNUQnaade3d3u5_T-t71pxZ093uSCwwTeRsAixA0vIxPgj4QMs1aqIghij8ZrYuzo0LkW9nKBYsedIm5FXN1ugr1cDz1OhoJfk220y55-Jhdb55jc4iwDZPzImlfOhivIaKi5MRTUzRuD9lZUMzo69aXvecgAA',
          refresh_token: refresh_token_data,
          client_id: adalConfiguration.clientID,
          clientID: adalConfiguration.clientID,
          client_secret: adalConfiguration.clientSecret,
          clientSecret: adalConfiguration.clientSecret
        }
      };

      requestForToken(options, function (error, responseToken, tokenBody) {
        if (error) {
          throw new Error(error);
        }
        else {
          console.log("tokenBody");
          console.log(tokenBody);
          console.log("tokenBody.access_token");
          console.log(JSON.parse(tokenBody).access_token);


          for (i = 0; i < req.body.value.length; i++) {
            resource = req.body.value[i].resource;
            subscriptionId = req.body.value[i].subscriptionId;


            var http1 = require("https");

            console.log("***********req.body value[i].resourceData***********");
            console.log(req.body.value[i].resourceData);
            var options = {
              "method": "GET",
              "hostname": "graph.microsoft.com",
              "port": null,
              "path": "/v1.0/me/events/" + req.body.value[i].resourceData.id,
              "headers": {
                "content-type": "application/json",
                "authorization": "Bearer " + JSON.parse(tokenBody).access_token,
                "cache-control": "no-cache",
                "postman-token": "6c29ed6d-ef6f-8869-e0f1-c2e0c4c12f7a"
              }
            };

            var request = http1.request(options, function (response) {
              var chunks = [];

              console.log("6");
              response.on("data", function (chunk) {
                chunks.push(chunk);
              });

              response.on("end", function () {
                var body1 = Buffer.concat(chunks);
                console.log("***********************This is where the code should go ***********************");
                console.log(body1);
                var time = moment.duration("04:00:00");
                var http2 = require("http");
                var options2 = {
                  "method": "POST",
                  "hostname": "localhost",
                  "port": "9090",
                  "path": "/cmecfservices/rest/schedulecomposite/calendarevent?Authentication__UserToken=1706638-1593851312872125088-1610556436283164691.1900643103058461034&Authentication__UserIPAddressText=156.132.32.168",
                  "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "authorization": 'Basic ' + new Buffer('Sysadmin Rieman:Test2013!').toString('base64')
                  }
                };
                var req2 = http2.request(options2, function (res2) {
                  var chunks = [];

                  res2.on("data", function (chunk) {
                    chunks.push(chunk);
                  });

                  res2.on("end", function () {
                    var body = Buffer.concat(chunks);
                    //console.log(body.toString());
                  });
                });


                jsonString = JSON.stringify({
                  CalendarData: {
                    calendarEvents: {
                      endDate: moment(JSON.parse(body1.toString()).end.dateTime).subtract(time).format('YYYY-MM-DDTHH:mm:ss.SSSSSSS').toString(),
                      eventAccessGroupList: [{accessGroupID: '68578', accessType: '118'},
                        {accessGroupID: '68578', accessType: '97'},
                        {accessGroupID: '68578', accessType: '101'}],
                      eventDefinitionDTO: {
                        CalendarDefinitionID: '16154',
                        OwnerPersonReferenceRepresentation: null,
                        CalendarDefinitionCode: 'q',
                        SelectCategoryDescriptionText: 'Appointment',
                        PrimaryLabel: 'Private',
                        SecondaryLabel: 'Appointment',
                        FillColor: 'FFFFFF',
                        CalendarDocketingReferenceReferenceRepresentation: null,
                        DisplayMode: '1',
                        RecordModificationTracking: {
                          RecordCreatedDate: {DateTime: '2016-09-22T10:12:44-04:00'},
                          RecordCreatorRepresentation: {
                            ReferenceID: '3',
                            ReferenceLink: '/cmecfservices/rest/person/3'
                          }
                        }
                      },
                      eventReportable: 'false',
                      eventResourceDtoList: {
                        categoryId: '0',
                        resourceId: '1706638',
                        timeblockslotResourceType: 'Person'
                      },
                      eventSubjectText: JSON.parse(body1.toString()).subject,
                      eventType: 'Personal',
                      override: 'false',
                      partialRecord: 'false',
                      personID: '1706638',
                      privateFlag: 'true',
                      repeatCriteria: {timeBlockConstructID: ''},
                      scheduleNewRepeatBehavior: 'false',
                      startDate: moment(JSON.parse(body1.toString()).start.dateTime).subtract(time).format('YYYY-MM-DDTHH:mm:ss.SSSSSSS').toString()
                    }
                  }
                });
                req2.write(jsonString);
                req2.end();


              });
            });

            request.end();


            processNotification(subscriptionId, resource, res, next);
          }


        }
      });


      // Send a status of 'Accepted'
      status = 202;
    } else {
      // Since the clientState field doesn't have the expected value,
      // this request might NOT come from Microsoft Graph.
      // However, you should still return the same status that you'd
      // return to Microsoft Graph to not alert possible impostors
      // that you have discovered them.
      console.log("Its gone to thhis else statement");
      status = 202;
    }
  }
  res.status(status).end(http.STATUS_CODES[status]);
});

// Get subscription data from the database
// Retrieve the actual mail message data from Office 365.
// Send the message data to the socket.
function processNotification(subscriptionId, resource, res, next) {
  dbHelper.getSubscription(subscriptionId, function (dbError, subscriptionData) {
    if (subscriptionData) {
      requestHelper.getData(
        '/beta/' + resource, subscriptionData.accessToken,
        function (requestError, endpointData) {
          if (endpointData) {
            io.to(subscriptionId).emit('notification_received', endpointData);
          } else if (requestError) {
            res.status(500);
            next(requestError);
          }
        }
      );
    } else if (dbError) {
      res.status(500);
      next(dbError);
    }
  });
}

module.exports = router;
