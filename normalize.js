'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeFields = exports.normalizeField = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _prismicDom = require('prismic-dom');

var _prismicDom2 = _interopRequireDefault(_prismicDom);

var _gatsbySourceFilesystem = require('gatsby-source-filesystem');

var _asyncro = require('asyncro');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Returns true if the field value appears to be a Rich Text field, false
// otherwise.
var isRichTextField = function isRichTextField(value) {
  return Array.isArray(value) && (0, _typeof3.default)(value[0]) === 'object' && (0, _keys2.default)(value[0]).includes('spans');
};

// Returns true if the field value appears to be a Link field, false otherwise.
var isLinkField = function isLinkField(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object' && value.hasOwnProperty('link_type');
};

// Returns true if the field value appears to be an Image field, false
// otherwise.
var isImageField = function isImageField(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object' && value.hasOwnProperty('url') && value.hasOwnProperty('dimensions') && value.hasOwnProperty('alt') && value.hasOwnProperty('copyright');
};

// Returns true if the key and value appear to be from a slice zone field,
// false otherwise.
var isSliceField = function isSliceField(key, value) {
  return Array.isArray(value) && (0, _typeof3.default)(value[0]) === 'object' && value[0].hasOwnProperty('slice_type') && (value[0].hasOwnProperty('primary') || value[0].hasOwnProperty('items'));
};

// Returns true if the field value appears to be a group field, false
// otherwise.
// NOTE: This check must be performed after isRichTextField and isSliceField.
var isGroupField = function isGroupField(value) {
  return Array.isArray(value) && (0, _typeof3.default)(value[0]) === 'object';
};

// Normalizes a rich text field by providing HTML and text versions of the
// value using `prismic-dom` on the `html` and `text` keys, respectively. The
// raw value is provided on the `raw` key.
var normalizeRichTextField = function normalizeRichTextField(value, linkResolver, htmlSerializer) {
  return {
    html: _prismicDom2.default.RichText.asHtml(value, linkResolver, htmlSerializer),
    text: _prismicDom2.default.RichText.asText(value),
    raw: value
  };
};

// Normalizes a link field by providing a resolved URL using `prismic-dom` on
// the `url` field. If the value is an external link, the value is provided
// as-is. If the value is a document link, the document's data is provided on
// the `document` key.
// FIXME this is a fix for https://github.com/prismicio/prismic-javascript/issues/86
var normalizeLinkField = function normalizeLinkField(value, linkResolver, generateNodeId, documentTypeMappings) {
  switch (value.link_type) {
    case 'Document':
      if (!value.type || !value.id || value.isBroken) return undefined;

      var mappedType = documentTypeMappings[value.id];

      if (mappedType != value.type) {
        console.warn('Wrong type for ' + value.id + ': "' + value.type + '" instead of "' + mappedType + '"');
        value.type = mappedType;
      }

      return (0, _extends3.default)({}, value, {
        document___NODE: [generateNodeId(value.type, value.id)],
        url: _prismicDom2.default.Link.url(value, linkResolver),
        target: value.target || '',
        raw: value
      });

    case 'Media':
    case 'Web':
      return (0, _extends3.default)({}, value, {
        target: value.target || '',
        raw: value
      });

    default:
      return undefined;
  }
};

// Normalizes an Image field by downloading the remote image and creating a
// File node using `gatsby-source-filesystem`. This allows for
// `gatsby-transformer-sharp` and `gatsby-image` integration. The linked node
// data is provided on the `localFile` key.
var normalizeImageField = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(args) {
    var value, createNode, createNodeId, store, cache, touchNode, alt, dimensions, copyright, extraFields, url, fileNodeID, mediaDataCacheKey, cacheMediaData, fileNode, key;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            value = args.value, createNode = args.createNode, createNodeId = args.createNodeId, store = args.store, cache = args.cache, touchNode = args.touchNode;
            alt = value.alt, dimensions = value.dimensions, copyright = value.copyright, extraFields = (0, _objectWithoutProperties3.default)(value, ['alt', 'dimensions', 'copyright']);
            url = decodeURIComponent(value.url);
            fileNodeID = void 0;
            mediaDataCacheKey = 'prismic-media-' + url;
            _context.next = 7;
            return cache.get(mediaDataCacheKey);

          case 7:
            cacheMediaData = _context.sent;


            // If we have cached media data and it wasn't modified, reuse previously
            // created file node to not try to redownload.
            if (cacheMediaData) {
              fileNodeID = cacheMediaData.fileNodeID;
              touchNode({ nodeId: cacheMediaData.fileNodeID });
            }

            // If we don't have cached data, download the file.

            if (fileNodeID) {
              _context.next = 23;
              break;
            }

            _context.prev = 10;
            _context.next = 13;
            return (0, _gatsbySourceFilesystem.createRemoteFileNode)({
              url: url,
              store: store,
              cache: cache,
              createNode: createNode,
              createNodeId: createNodeId
            });

          case 13:
            fileNode = _context.sent;

            if (!fileNode) {
              _context.next = 18;
              break;
            }

            fileNodeID = fileNode.id;
            _context.next = 18;
            return cache.set(mediaDataCacheKey, { fileNodeID: fileNodeID });

          case 18:
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context['catch'](10);

            console.log(_context.t0);

          case 23:
            _context.t1 = _regenerator2.default.keys(extraFields);

          case 24:
            if ((_context.t2 = _context.t1()).done) {
              _context.next = 32;
              break;
            }

            key = _context.t2.value;

            if (!isImageField(value[key])) {
              _context.next = 30;
              break;
            }

            _context.next = 29;
            return normalizeImageField((0, _extends3.default)({}, args, {
              key: key,
              value: value[key]
            }));

          case 29:
            value[key] = _context.sent;

          case 30:
            _context.next = 24;
            break;

          case 32:
            if (!fileNodeID) {
              _context.next = 34;
              break;
            }

            return _context.abrupt('return', (0, _extends3.default)({}, value, {
              alt: alt || '',
              copyright: copyright || '',
              localFile___NODE: fileNodeID
            }));

          case 34:
            return _context.abrupt('return', value);

          case 35:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[10, 20]]);
  }));

  return function normalizeImageField(_x) {
    return _ref.apply(this, arguments);
  };
}();

// Normalizes a slice zone field by recursively normalizing `item` and
// `primary` keys. It creates a node type for each slice type to ensure the
// slice key can handle multiple (i.e. union) types.
var normalizeSliceField = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(args) {
    var sliceKey, entries, node, nodeHelpers, createNode, createNodeFactory, childrenIds;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sliceKey = args.key, entries = args.value, node = args.node, nodeHelpers = args.nodeHelpers, createNode = args.createNode;
            createNodeFactory = nodeHelpers.createNodeFactory;
            _context4.next = 4;
            return (0, _asyncro.reduce)(entries, function () {
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(acc, entry, index) {
                var entryNodeType, EntryNode, entryNode;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        // Create unique ID for the child using the parent node ID, the slice key,
                        // and the index of the slice.
                        entry.id = node.id + '__' + sliceKey + '__' + index;

                        entryNodeType = node.type + '_' + sliceKey + '_' + entry.slice_type;
                        EntryNode = createNodeFactory(entryNodeType, function () {
                          var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(entryNode) {
                            return _regenerator2.default.wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _context2.next = 2;
                                    return normalizeGroupField((0, _extends3.default)({}, args, {
                                      value: entryNode.items
                                    }));

                                  case 2:
                                    entryNode.items = _context2.sent;
                                    _context2.next = 5;
                                    return normalizeFields((0, _extends3.default)({}, args, {
                                      value: entryNode.primary
                                    }));

                                  case 5:
                                    entryNode.primary = _context2.sent;
                                    return _context2.abrupt('return', entryNode);

                                  case 7:
                                  case 'end':
                                    return _context2.stop();
                                }
                              }
                            }, _callee2, undefined);
                          }));

                          return function (_x6) {
                            return _ref4.apply(this, arguments);
                          };
                        }());
                        _context3.next = 5;
                        return EntryNode(entry);

                      case 5:
                        entryNode = _context3.sent;

                        createNode(entryNode);

                        return _context3.abrupt('return', acc.concat([entryNode.id]));

                      case 8:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x3, _x4, _x5) {
                return _ref3.apply(this, arguments);
              };
            }(), []);

          case 4:
            childrenIds = _context4.sent;


            // TODO: Remove hard-coded setter
            node.data[sliceKey + '___NODE'] = childrenIds;
            return _context4.abrupt('return', undefined);

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function normalizeSliceField(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// Normalizes a group field by recursively normalizing each entry.
var normalizeGroupField = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(args) {
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _asyncro.map)(args.value, function () {
              var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(value) {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return normalizeFields((0, _extends3.default)({}, args, { value: value }));

                      case 2:
                        return _context5.abrupt('return', _context5.sent);

                      case 3:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, undefined);
              }));

              return function (_x8) {
                return _ref6.apply(this, arguments);
              };
            }());

          case 2:
            return _context6.abrupt('return', _context6.sent);

          case 3:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function normalizeGroupField(_x7) {
    return _ref5.apply(this, arguments);
  };
}();

// Normalizes a field by determining its type and returning an enhanced version
// of it. If the type is not supported or needs no normalizing, it is returned
// as-is.
var normalizeField = exports.normalizeField = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(args) {
    var key, value, node, nodeHelpers, shouldNormalizeImage, documentTypeMappings, linkResolver, htmlSerializer, generateNodeId;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            key = args.key, value = args.value, node = args.node, nodeHelpers = args.nodeHelpers, shouldNormalizeImage = args.shouldNormalizeImage, documentTypeMappings = args.documentTypeMappings;
            linkResolver = args.linkResolver, htmlSerializer = args.htmlSerializer;
            generateNodeId = nodeHelpers.generateNodeId;


            linkResolver = linkResolver({ node: node, key: key, value: value });
            htmlSerializer = htmlSerializer({ node: node, key: key, value: value });

            if (!isRichTextField(value)) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt('return', normalizeRichTextField(value, linkResolver, htmlSerializer));

          case 7:
            if (!isLinkField(value)) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt('return', normalizeLinkField(value, linkResolver, generateNodeId, documentTypeMappings));

          case 9:
            if (!(isImageField(value) && typeof shouldNormalizeImage === 'function' && shouldNormalizeImage({ node: node, key: key, value: value }))) {
              _context7.next = 13;
              break;
            }

            _context7.next = 12;
            return normalizeImageField(args);

          case 12:
            return _context7.abrupt('return', _context7.sent);

          case 13:
            if (!isSliceField(key, value)) {
              _context7.next = 17;
              break;
            }

            _context7.next = 16;
            return normalizeSliceField(args);

          case 16:
            return _context7.abrupt('return', _context7.sent);

          case 17:
            if (!isGroupField(value)) {
              _context7.next = 21;
              break;
            }

            _context7.next = 20;
            return normalizeGroupField(args);

          case 20:
            return _context7.abrupt('return', _context7.sent);

          case 21:
            return _context7.abrupt('return', value);

          case 22:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function normalizeField(_x9) {
    return _ref7.apply(this, arguments);
  };
}();

// Normalizes all fields in a key-value object.
var normalizeFields = exports.normalizeFields = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(args) {
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _asyncro.reduce)((0, _entries2.default)(args.value), function () {
              var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(acc, _ref10) {
                var _ref11 = (0, _slicedToArray3.default)(_ref10, 2),
                    key = _ref11[0],
                    value = _ref11[1];

                return _regenerator2.default.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return normalizeField((0, _extends3.default)({}, args, { key: key, value: value }));

                      case 2:
                        acc[key] = _context8.sent;
                        return _context8.abrupt('return', acc);

                      case 4:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee8, undefined);
              }));

              return function (_x11, _x12) {
                return _ref9.apply(this, arguments);
              };
            }(), args.value);

          case 2:
            return _context9.abrupt('return', _context9.sent);

          case 3:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function normalizeFields(_x10) {
    return _ref8.apply(this, arguments);
  };
}();