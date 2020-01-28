'use strict';
// Description:
//   毎日ログインボーナスでもらった「めりたん」というポイントを使って遊ぶSlack用チャットボットゲーム
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
var sequelize_1 = require('sequelize');
var sequelizeLoader_1 = require('./models/sequelizeLoader');
var accounts_1 = require('./models/accounts');
var loginBonuses_1 = require('./models/loginBonuses');
/**
 * ログインボーナス受領日を取得する、午前7時に変わるため、7時間前の時刻を返す
 * @returns {Date} 7時間前の時刻
 */
function getReceiptToday() {
  return new Date(Date.now() - 1000 * 60 * 60 * 7);
}
// DB同期
(function() {
  return __awaiter(void 0, void 0, void 0, function() {
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, accounts_1.Account.sync()];
        case 1:
          _a.sent();
          return [4 /*yield*/, loginBonuses_1.LoginBonus.sync()];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
})();
module.exports = function(robot) {
  // ヘルプ表示
  robot.hear(/^mhelp>$/i, function(res) {
    res.send(
      'プロジェクトmeritumとは、めりたんを集めるプロジェクト。' +
        '毎日のログインボーナスを集めて、ガチャを回し、称号を集めよう！' +
        '他人に迷惑をかけたりしないように！めりたんが消滅します！' +
        'めりたんbotをランキング100以下にしたら勝利！\n' +
        '■コマンド説明\n' +
        '`mhelp>` : めりたんbotの使い方を表示。\n' +
        '`mlogin>` : ログインボーナスの100めりたんをゲット。毎朝7時にリセット。\n' +
        '`mjanken> (1-10) (グー|チョキ|パー)` : めりたんbotと数値で指定しためりたんを賭けてジャンケン。\n' +
        '`mgacha>` : 80めりたんでガチャを回して称号をゲット。\n' +
        '`mself>` : 自分のめりたん、称号数、全称号、順位を表示。\n' +
        '`mranking>` : 称号数、次にめりたんで決まるランキングを表示。\n' +
        '`mrank> (@ユーザー名)` : 指定したユーザーのめりたん、称号数、全称号、順位を表示。\n' +
        '`msend> (数値) (@ユーザー名)` : 指定したユーザーに数値で指定しためりたんを送る'
    );
  });
  // ヘルプ表示
  robot.hear(/^mlogin>$/i, function(res) {
    return __awaiter(void 0, void 0, void 0, function() {
      var user,
        slackId,
        name,
        realName,
        slack,
        displayName,
        t,
        receiptDate,
        countLoginBonus,
        oldAccount,
        e_1;
      var _a;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            user = res.message.user;
            slackId = user.id;
            name = user.name;
            realName = user.real_name;
            slack = user.slack;
            displayName = slack.profile.display_name;
            return [4 /*yield*/, sequelizeLoader_1.database.transaction()];
          case 1:
            t = _b.sent();
            _b.label = 2;
          case 2:
            _b.trys.push([2, 14, , 16]);
            receiptDate = getReceiptToday();
            return [
              4 /*yield*/,
              loginBonuses_1.LoginBonus.count({
                where: {
                  slackId: slackId,
                  receiptDate:
                    ((_a = {}), (_a[sequelize_1.Op.eq] = receiptDate), _a)
                }
              })
            ];
          case 3:
            countLoginBonus = _b.sent();
            if (!(countLoginBonus === 1)) return [3 /*break*/, 5];
            res.send(
              '{@' +
                slackId +
                '>}\u3055\u3093\u306F\u65E2\u306B\u672C\u65E5\u306E\u30ED\u30B0\u30A4\u30F3\u30DC\u30FC\u30CA\u30B9\u3092\u53D6\u5F97\u6E08\u307F\u3067\u3059\u3002'
            );
            return [4 /*yield*/, t.commit()];
          case 4:
            _b.sent();
            return [2 /*return*/];
          case 5:
            return [4 /*yield*/, accounts_1.Account.findByPk(slackId)];
          case 6:
            oldAccount = _b.sent();
            if (!!oldAccount) return [3 /*break*/, 8];
            return [
              4 /*yield*/,
              accounts_1.Account.create({
                slackId: slackId,
                name: name,
                realName: realName,
                displayName: displayName,
                meritum: 100,
                titles: '',
                numOfTitles: 0
              })
            ];
          case 7:
            _b.sent();
            return [3 /*break*/, 10];
          case 8:
            return [
              4 /*yield*/,
              accounts_1.Account.update(
                {
                  meritum: oldAccount.meritum + 100
                },
                {
                  where: {
                    slackId: slackId
                  }
                }
              )
            ];
          case 9:
            _b.sent();
            _b.label = 10;
          case 10:
            // ログインボーナス実績を作成
            return [
              4 /*yield*/,
              loginBonuses_1.LoginBonus.create({
                slackId: slackId,
                receiptDate: receiptDate
              })
            ];
          case 11:
            // ログインボーナス実績を作成
            _b.sent();
            _b.label = 12;
          case 12:
            return [4 /*yield*/, t.commit()];
          case 13:
            _b.sent();
            return [3 /*break*/, 16];
          case 14:
            e_1 = _b.sent();
            console.log('Error on mlogin> e:');
            console.log(e_1);
            return [4 /*yield*/, t.rollback()];
          case 15:
            _b.sent();
            return [3 /*break*/, 16];
          case 16:
            return [2 /*return*/];
        }
      });
    });
  });
};
