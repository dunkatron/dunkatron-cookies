Dunkatron Cookies
=================

TestStatus:[![Test Status](https://travis-ci.org/dunkatron/node-cookies.txt.png)](https://travis-ci.org/dunkatron/node-cookies.txt)

#README
This is a wget cookies.txt format parser for Node.js.
It lets you parse cookies.txt format cookies into JavaScript objects, and generate cookie header strings suitable for making HTTP requests.


##Install
```npm install dunkatron-cookies```

##Usage
```
var cookie = require('cookies.txt');
cookie.parse('your cookies.txt file path here.', function(err, jsonCookieObj){
  // ...
});
```
### Working with request module
```
var request = require('request');
var cookie = require('dunkatron-cookies');

cookie.parse('your cookies.txt file path here.', function(jsonCookieObj){
  //your codes here 
  request.get({
      url:'the http url',
      jar:true, 
      encoding:null, 
      headers:{
        Cookie:cookie.getCookieString('the url')}})
    .pipe(AWritebleStreamInstance);
  //...
});
```

##License
MIT
