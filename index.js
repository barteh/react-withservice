"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useService: true,
  useAction: true
};
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _withService.default;
  }
});
Object.defineProperty(exports, "useService", {
  enumerable: true,
  get: function get() {
    return _useService.default;
  }
});
Object.defineProperty(exports, "useAction", {
  enumerable: true,
  get: function get() {
    return _useAction.default;
  }
});

var _asService = require("@barteh/as-service");

var _withService = _interopRequireWildcard(require("./lib/with-service"));

Object.keys(_withService).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _withService[key];
    }
  });
});

var _useService = _interopRequireDefault(require("./lib/useService"));

var _useAction = _interopRequireDefault(require("./lib/useAction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
