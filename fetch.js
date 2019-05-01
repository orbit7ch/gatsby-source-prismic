'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var pagedGet = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(client) {
    var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var lang = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '*';
    var page = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var pageSize = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 100;
    var aggregatedResponse = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var mergedOptions, response;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mergedOptions = (0, _extends3.default)({ lang: lang }, options);
            _context2.next = 3;
            return client.query(query, (0, _extends3.default)({}, mergedOptions, {
              page: page,
              pageSize: pageSize
            }));

          case 3:
            response = _context2.sent;


            if (!aggregatedResponse) {
              aggregatedResponse = response.results;
            } else {
              aggregatedResponse = aggregatedResponse.concat(response.results);
            }

            if (!(page * pageSize < response.total_results_size)) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', pagedGet(client, query, options, lang, page + 1, pageSize, aggregatedResponse));

          case 7:
            return _context2.abrupt('return', aggregatedResponse);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function pagedGet(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var _prismicJavascript = require('prismic-javascript');

var _prismicJavascript2 = _interopRequireDefault(_prismicJavascript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');

function replacer(key, value) {
  if (typeof value === 'string') {
    return value.replace(/\t/g, '').replace(/\n/g, '');
  }
  return value;
}

var writeJsonFile = function writeJsonFile(fileName, content) {
  return new _promise2.default(function (resolve, reject) {
    try {
      var text = (0, _stringify2.default)(content, replacer, 4);
      fs.writeFile(fileName, text, function (err) {
        if (err) reject(err);else resolve();
      });
    } catch (error) {
      console.error(fileName, error);
    }
  });
};

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
    var repositoryName = _ref2.repositoryName,
        accessToken = _ref2.accessToken,
        fetchLinks = _ref2.fetchLinks,
        lang = _ref2.lang;

    var _documents, apiEndpoint, client, documents;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(repositoryName.indexOf('.local.json') > -1)) {
              _context.next = 4;
              break;
            }

            console.log('use local repository dump ' + repositoryName);
            _documents = require('' + repositoryName);
            return _context.abrupt('return', { documents: _documents });

          case 4:

            console.time('Fetch Prismic data');
            console.log('Starting to fetch data from Prismic');

            apiEndpoint = 'https://' + repositoryName + '.prismic.io/api/v2';
            _context.next = 9;
            return _prismicJavascript2.default.api(apiEndpoint, { accessToken: accessToken });

          case 9:
            client = _context.sent;
            _context.next = 12;
            return pagedGet(client, [], { fetchLinks: fetchLinks }, lang);

          case 12:
            documents = _context.sent;


            console.timeEnd('Fetch Prismic data');

            writeJsonFile(repositoryName + '.local.json', documents);
            console.log('local repository ' + repositoryName + '.local.json saved');

            return _context.abrupt('return', {
              documents: documents
            });

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();