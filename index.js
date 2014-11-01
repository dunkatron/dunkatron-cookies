"use strict";
//This is a wget cookies.txt parser for nodejs

var fs = require('fs');
var url = require('url');
var assert = require('assert');
var ip = require('ip');

var cookieDefine = ['domain', 'httponly', 'path', 'secure', 'expires', 'name', 'value'];

/**
 * Parse cookies file and return the result to cb;
 */
var parse = function (file, callback) {
  assert(fs.existsSync(file));
  assert(typeof callback === 'function');

  fs.readFile(file, function read(err, buffer) {
    if (err) {
      callback(err, null);
      return;
    }

    //change dos/mac files to unix format
    var toUnix = function (str) {
      assert(typeof  str === 'string');
      return str.replace(/\\r\\n/g, '\r').replace(/\\r/g, '\n');
    };

    var str = toUnix(buffer.toString('utf8'));

    var parsedCookies = [];
    var cookies = str.split('\n');

    cookies.forEach(function (line) {
      line = line.trim();

      if (line.length > 0 && !/^#/.test(line)) {
        var cookie = {};
        line.split(/\s/).forEach(function (c, index) {
          if (cookieDefine[index] === 'expires') {
            c = (new Date(parseInt(c, 10) * 1000));
          }
          cookie[cookieDefine[index]] = c;
        });

        parsedCookies.push(cookie);
      }

    });

    callback(null, parsedCookies);
  });
};

// See RFC2109 'domain-match' definition
var domainMatch = function (a, b) {
  // Both are IP's and are equal

  try {
    return ip.isEqual(a, b);
  } catch (ex) {
    if (a.indexOf('.') != 0 && b.indexOf('.') != 0) {
      return a === b;
    } else if (b.indexOf('.') == 0) {
      var aSplit = a.split('.');
      var bSplit = b.split('.');

      var aTail = aSplit.pop(), bTail = bSplit.pop();

      while (aTail === bTail && bSplit.length > 0) {
        aTail = aSplit.pop();
        bTail = bSplit.pop();
      }

      return bTail === '';
    } else {
      return false;
    }
  }
};

exports.parse = parse;

exports.getCookieString = function (cookies, urlStr) {
  var urlObj = url.parse(urlStr, false);

  var result = cookies.reduce(function (pre, cookie) {
    if (domainMatch(urlObj.hostname, cookie.domain) && urlObj.pathname.indexOf(cookie.path) === 0) {
      pre.push(cookie.name + '=' + cookie.value);
    }
    return pre;
  }, []).join(';');

  return result;
};
