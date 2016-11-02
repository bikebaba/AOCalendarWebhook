exports.adalConfiguration = {
  authority: 'https://login.microsoftonline.com/common',
  redirectUri: 'http://localhost:12000/callback',
  //redirectUri: 'http://localhost:12000/callback',
  clientID: 'f19d3c30-0660-4f7f-96df-6dc78a686633',
  clientSecret: '2xizpbwJKnXEv4HGzaZFF9r2hT/lz/P/dbqBF3nhPSA='
};

exports.subscriptionConfiguration = {
  changeType: 'Created',
  notificationUrl: 'https://fb88bca7.ngrok.io/listen',
  //resource: 'me/events',
  resource: 'me/calendars/AQMkAGIzYTViZjgzLWYzN2QtNDUwMi1hMTM2LTNhNjk0MzJlNGQ3MwBGAAADolT90U35WEqIgZEtrX96eQcAbDi5PtVI3UuU5SGDPugV1QAAAgEGAAAAbDi5PtVI3UuU5SGDPugV1QAAAaJmFgAAAA==/events',
  clientState: 'cLIENTsTATEfORvALIDATION'
};
