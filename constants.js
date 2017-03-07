var serverUri = "https://ecf-test.cm3b.aocms.uscourts.gov/n/beam/servlet/TransportRoom?";

exports.adalConfiguration = {
  authority: 'https://login.microsoftonline.com/common',
  //redirectUri: 'http://localhost:12000/callback',
  redirectUri: serverUri +  'servlet=hello',
  clientID: 'f19d3c30-0660-4f7f-96df-6dc78a686633',
  clientSecret: '2xizpbwJKnXEv4HGzaZFF9r2hT/lz/P/dbqBF3nhPSA='
};

exports.subscriptionConfiguration = {
  changeType: 'Created',
  //notificationUrl: 'https://c7a758f1.ngrok.io/listen',
  notificationUrl: serverUri +  'servlet=listen',
  //resource: 'me/events',
  resource: 'me/calendars/AQMkAGIzYTViZjgzLWYzN2QtNDUwMi1hMTM2LTNhNjk0MzJlNGQ3MwBGAAADolT90U35WEqIgZEtrX96eQcAbDi5PtVI3UuU5SGDPugV1QAAAgEGAAAAbDi5PtVI3UuU5SGDPugV1QAAAaJmFgAAAA==/events',
  clientState: 'cLIENTsTATEfORvALIDATION'
};
