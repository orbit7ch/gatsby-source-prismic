'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceNodes = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _gatsbyNodeHelpers = require('gatsby-node-helpers');

var _gatsbyNodeHelpers2 = _interopRequireDefault(_gatsbyNodeHelpers);

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _normalize = require('./normalize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodeHelpers = (0, _gatsbyNodeHelpers2.default)({ typePrefix: 'Prismic' });
var createNodeFactory = nodeHelpers.createNodeFactory;
var sourceNodes = exports.sourceNodes = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(gatsby, pluginOptions) {
    var actions, createNodeId, store, cache, createNode, touchNode, repositoryName, accessToken, _pluginOptions$linkRe, linkResolver, _pluginOptions$htmlSe, htmlSerializer, _pluginOptions$fetchL, fetchLinks, _pluginOptions$lang, lang, _pluginOptions$should, shouldNormalizeImage, _ref2, documents, documentTypeMappings;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            actions = gatsby.actions, createNodeId = gatsby.createNodeId, store = gatsby.store, cache = gatsby.cache;
            createNode = actions.createNode, touchNode = actions.touchNode;
            repositoryName = pluginOptions.repositoryName, accessToken = pluginOptions.accessToken, _pluginOptions$linkRe = pluginOptions.linkResolver, linkResolver = _pluginOptions$linkRe === undefined ? function () {} : _pluginOptions$linkRe, _pluginOptions$htmlSe = pluginOptions.htmlSerializer, htmlSerializer = _pluginOptions$htmlSe === undefined ? function () {} : _pluginOptions$htmlSe, _pluginOptions$fetchL = pluginOptions.fetchLinks, fetchLinks = _pluginOptions$fetchL === undefined ? [] : _pluginOptions$fetchL, _pluginOptions$lang = pluginOptions.lang, lang = _pluginOptions$lang === undefined ? '*' : _pluginOptions$lang, _pluginOptions$should = pluginOptions.shouldNormalizeImage, shouldNormalizeImage = _pluginOptions$should === undefined ? function () {
              return true;
            } : _pluginOptions$should;
            _context3.next = 5;
            return (0, _fetch2.default)({
              repositoryName: repositoryName,
              accessToken: accessToken,
              fetchLinks: fetchLinks,
              lang: lang
            });

          case 5:
            _ref2 = _context3.sent;
            documents = _ref2.documents;


            // create a mapper so we can get types of a specific id
            // FIXME this is a fix for https://github.com/prismicio/prismic-javascript/issues/86
            documentTypeMappings = documents.reduce(function (acc, cur) {
              acc[cur.id] = cur.type;
              return acc;
            }, {});
            _context3.next = 10;
            return _promise2.default.all(documents.map(function () {
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(doc) {
                var Node, node;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        Node = createNodeFactory(doc.type, function () {
                          var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(node) {
                            return _regenerator2.default.wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    node.dataString = (0, _stringify2.default)(node.data);
                                    _context.next = 3;
                                    return (0, _normalize.normalizeFields)({
                                      value: node.data,
                                      node: node,
                                      linkResolver: linkResolver,
                                      htmlSerializer: htmlSerializer,
                                      nodeHelpers: nodeHelpers,
                                      createNode: createNode,
                                      createNodeId: createNodeId,
                                      touchNode: touchNode,
                                      store: store,
                                      cache: cache,
                                      shouldNormalizeImage: shouldNormalizeImage,
                                      documentTypeMappings: documentTypeMappings
                                    });

                                  case 3:
                                    node.data = _context.sent;
                                    return _context.abrupt('return', node);

                                  case 5:
                                  case 'end':
                                    return _context.stop();
                                }
                              }
                            }, _callee, undefined);
                          }));

                          return function (_x4) {
                            return _ref4.apply(this, arguments);
                          };
                        }());
                        _context2.next = 3;
                        return Node(doc);

                      case 3:
                        node = _context2.sent;

                        createNode(node);

                      case 5:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function (_x3) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 10:
            return _context3.abrupt('return');

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function sourceNodes(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();