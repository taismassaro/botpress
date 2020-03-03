"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var api_1 = require("./api");
// This is called when server is started, usually to set up the database
var onServerStarted = function (bp) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
// At this point, you would likely setup the API route of your module.
var onServerReady = function (bp) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api_1["default"](bp)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Every time a bot is created (or enabled), this method will be called with the bot id
var onBotMount = function (bp, botId) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
// This is called every time a bot is deleted (or disabled)
//const onBotUnmount = async (botId: string) => {}
// When anything is changed using the flow editor, this is called with the new flow, so you can rename nodes if you reference them
var onFlowChanged = function (bp, botId, flow) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
/**
 * This is where you would include your 'demo-bot' definitions.
 * You can copy the content of any existing bot and mark them as "templates", so you can create multiple bots from the same template.
 */
var botTemplates = [{ id: 'my_bot_demo', name: 'Bot Demo', desc: "Some description" }];
/**
 * Skills allows you to create custom logic and use them easily on the flow editor
 * Check this link for more information: https://botpress.com/docs/developers/create-module/#skill-creation
 */
var skills = [];
var entryPoint = {
    onServerStarted: onServerStarted,
    onServerReady: onServerReady,
    onBotMount: onBotMount,
    //  onBotUnmount,
    onFlowChanged: onFlowChanged,
    botTemplates: botTemplates,
    skills: skills,
    definition: {
        // This must match the name of your module's folder, and the name in package.json
        name: 'complete-module',
        /**
         * When menuIcon is set to `custom`, you need to provide an icon. It must be at that location: `/assets/icon.png`
         * Otherwise, use Material icons name: https://material.io/tools/icons/?style=baseline
         */
        menuIcon: 'flag',
        // This is the name of your module which will be displayed in the sidebar
        menuText: 'Complete Module',
        // When set to `true`, the name and icon of your module won't be displayed in the sidebar
        noInterface: false,
        // The full name is used in other places, for example when displaying bot templates
        fullName: 'Complete Module',
        // Not used anywhere, but should be a link to your website or module repository
        homepage: 'https://botpress.com'
    }
};
exports["default"] = entryPoint;
