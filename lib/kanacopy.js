// 日本語をキーボードから入力したのに合わせて、
// カナ入力欄にカナを出力するライブラリ
// jQueryが必要です。

// [API]
//
// $('#kana').kanacopy([srcInput, option]);
//
// or
//
// jQuery.kanacopy.bindKanacopy(kanaInput [, srcInput, option]);
//
//   全角ひらがな -> カナ変換ハンドラを
//   セットする(引数はカナ入力欄input要素)
//   srcInputを指定しない(or null指定)場合、カナ入力欄は、
//   data-src-id属性で、元入力項目の
//   IDを指定する必要がある。
//
//   option.kanaType : 'hira' or 'kata' or 'hankata'

(function ($) {
  if (!$.kanacopy)
    $.kanacopy = {};

  var ns = $.kanacopy;

  // ========================================================
  // カナ変換処理
  // ========================================================
  var zenkaku = ['。', '、', '「', '」', '・',
    'ァ', 'ア', 'ィ', 'イ', 'ゥ', 'ウ', 'ェ', 'エ', 'ォ', 'オ',
    'カ', 'ガ', 'キ', 'ギ', 'ク', 'グ', 'ケ', 'ゲ', 'コ', 'ゴ',
    'サ', 'ザ', 'シ', 'ジ', 'ス', 'ズ', 'セ', 'ゼ', 'ソ', 'ゾ',
    'タ', 'ダ', 'チ', 'ヂ', 'ッ', 'ツ', 'ヅ', 'テ', 'デ', 'ト', 'ド',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
    'ハ', 'バ', 'パ', 'ヒ', 'ビ', 'ピ', 'フ', 'ブ', 'プ', 'ヘ', 'ベ', 'ペ', 'ホ', 'ボ', 'ポ',
    'マ', 'ミ', 'ム', 'メ', 'モ',
    'ャ', 'ヤ', 'ュ', 'ユ', 'ョ', 'ヨ',
    'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン', 'ヴ', '　', '０', '１', '２', '３', '４', '５', '６', '７', '８', '９',
    "．", "／", "、", "ー",  "－",  "‐",  "―", "！", "”", "＃", "＄", "％", "＆", "’", "（", "）", "＝", "～", "｜",
    "「", "」", "｛", "｝", "＠", "‘", "＾", "￥", "；", "：", "＋", "＊", "＜", "＞", "？", "＿", "、", "。", "・", "　",
    "ａ", "ｂ", "ｃ", "ｄ", "ｅ", "ｆ", "ｇ", "ｈ", "ｉ", "ｊ", "ｋ", "ｌ", "ｍ", "ｎ", "ｏ", "ｐ", "ｑ", "ｒ", "ｓ", "ｔ", "ｕ", "ｖ", "ｗ", "ｘ", "ｙ", "ｚ",
    "Ａ", "Ｂ", "Ｃ", "Ｄ", "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ", "Ｎ", "Ｏ", "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ", "Ｗ", "Ｘ", "Ｙ", "Ｚ"
  ];

  var hankaku = ['｡', '､', '｢', '｣', '･',
    'ｧ', 'ｱ', 'ｨ', 'ｲ', 'ｩ', 'ｳ', 'ｪ', 'ｴ', 'ｫ', 'ｵ',
    'ｶ', 'ｶﾞ', 'ｷ', 'ｷﾞ', 'ｸ', 'ｸﾞ', 'ｹ', 'ｹﾞ', 'ｺ', 'ｺﾞ',
    'ｻ', 'ｻﾞ', 'ｼ', 'ｼﾞ', 'ｽ', 'ｽﾞ', 'ｾ', 'ｾﾞ', 'ｿ', 'ｿﾞ',
    'ﾀ', 'ﾀﾞ', 'ﾁ', 'ﾁﾞ', 'ｯ', 'ﾂ', 'ﾂﾞ', 'ﾃ', 'ﾃﾞ', 'ﾄ', 'ﾄﾞ',
    'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ',
    'ﾊ', 'ﾊﾞ', 'ﾊﾟ', 'ﾋ', 'ﾋﾞ', 'ﾋﾟ', 'ﾌ', 'ﾌﾞ', 'ﾌﾟ', 'ﾍ', 'ﾍﾞ', 'ﾍﾟ', 'ﾎ', 'ﾎﾞ', 'ﾎﾟ',
    'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ',
    'ｬ', 'ﾔ', 'ｭ', 'ﾕ', 'ｮ', 'ﾖ',
    'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ', 'ﾜ', 'ｦ', 'ﾝ', 'ｳﾞ', ' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    ".", "/", ",", "ｰ", "-", "-", "-", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "=", "~", "|",
    "[", "]", "{", "}", "@", "`", "^", "\\", ";", ":", "+", "*", "<", ">", "?", "_", ",", ".", "", " ",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ];

  var re_zenkaku = new RegExp('[' + zenkaku.join('') +']', 'g');
  var z2h = {}; for (var i = 0, l = zenkaku.length; i < l; i++){
      z2h[zenkaku[i]] = hankaku[i];
  }
  ns.zen2han = function(str){
      return str.replace(re_zenkaku, function(m0){
          return z2h[m0];
      });
  };

  function isKana(str) {
    return ns.hira2kata(str).replace(re_zenkaku, '').length == 0;
  }
  ns.isKana = isKana;
  ns.re_not_hankaku = /[^ -.\/,!\\#$%&'()=~|\[\]{}@`^;:+*<>?_,"0-9a-zA-Z\uFF61-\uFF9F]/g;

  ns.hira2kata = function(str){
    return str.replace(/[\u3041-\u3096]/g, function(m0){
      return String.fromCharCode(m0.charCodeAt(0) + 0x60);
    });
  };

  ns.kata2hira = function(str){
    return str.replace(/[\u30A1-\u30F6]/g, function(m0){
      return String.fromCharCode(m0.charCodeAt(0) - 0x60);
    });
  };
  var re_not_zenkaku_pat = '[^' + zenkaku.join('') + 'a-zA-Z0-9' + ']';
  ns.re_not_zenkaku = new RegExp(re_not_zenkaku_pat, 'g');

  // フリガナ項目を、半角カタカナに変換する
  ns.convertRuby2Kana = function(kanaInput) {
    var val = $(kanaInput).val();
    var kana = null;
    var kanaType = kanaInput.data('kanaType');
    if (kanaType == 'hankata') {
      kana = ns.rejectNotHan(val);
    } else if (kanaType == 'kata') {
      kana = ns.rejectNotZen(val);
    } else {
      kana = ns.rejectNotZen(val);
      kana = ns.kata2hira(kana);
    }

    if (val != kana) {
      kanaInput.val(kana);
      $.dispatchEvent($(kanaInput)[0], 'change');
    }
  }

  // 半角カタカナに変換し、半角カタカナ以外の文字はすべて削除する
  ns.rejectNotHan = function rejectNotHan(src) {
    var han = ns.zen2han(ns.hira2kata(src));
    return han.replace(ns.re_not_hankaku, ""); // 半角カタカナ以外削除
  }

  // 全角カタカナ以外の文字はすべて削除する
  // * 半角アルファベット、数字はカナに入れる事ありそうなので、許可する
  ns.rejectNotZen = function rejectNotZen(src) {
    var zen = ns.hira2kata(src);
    return zen.replace(ns.re_not_zenkaku, ""); // 全角カタカナ以外削除
  };

  // ========================================================
  // カナコピー処理
  // ========================================================

  // フリガナ入力欄は、data-src-id 属性で、元入力項目の
  // IDを指定する必要がある
  //
  // option.kanaType : 'hira' or 'kata' or 'hankata'
  function bindKanacopy(kanaInput, srcInput, option) {
    option = option ? option : {kanaType: 'hira'};
    kanaInput = $(kanaInput);
    if (srcInput)
      srcInput = $(srcInput);
    else
      srcInput = $('input[id="' + kanaInput.data('src-id') + '"]');

    // 対応する元入力項目があることを確認
    if (srcInput.length == 0) {
      console.log("フリガナ入力欄に対応する入力項目がありません", kanaInput);
      return;
    }

    srcInput.data('kanaInput', kanaInput);
    kanaInput.data('kanaType', option.kanaType);

    srcInput.focus(clearValue).
             keydown(keydownProcess).
             keypress(keypressProcess).
             keyup(keyupProcess). // Enter押下でカナをコピー
             blur(applyAppendedKana);

    kanaInput.blur(function() {ns.convertRuby2Kana(kanaInput)});
    if (!kanaInput.attr('title') || kanaInput.attr('title').length == 0) {
      kanaInput.attr('title', 'かな自動入力')
    }
  }

  // jQueryプラグインメソッド
  function kanacopy(srcInput, option) {
    $.each(this, function() {
      bindKanacopy(this, srcInput, option);
    });
  }

  function keydownProcess(e) {
    saveAppendedKana.apply(this);
  }

  function keypressProcess(e) {
    notifyKeypress(this);
    saveAppendedKana.apply(this);
  }

  function keyupProcess(e) {
    var imeOff = !isImeOn(this);
    clearKeyEvent(this);

    if (imeOff || e.keyCode == 13) {
      saveAppendedKana.apply(this);
      applyAppendedKana.apply(this);
    } else {
      saveAppendedKana.apply(this);
    }
    // 入力が空なら、カナ入力欄も空にする
    if ($(this).val() == '') {
      $(this).data('kanaInput').val('');
    }
  }

  function notifyKeypress(e) {
    $(e).data('keypress', true);
  }

  function clearKeyEvent(e) {
    $(e).data('keypress', false);
  }

  // IMEがonの時は、keypressイベントが呼ばれない。
  // それを利用して、IMEがONかOFFか判別する。
  function isImeOn(e) {
    return !$(e).data('keypress');
  }

  // 追記された かな を保存。
  function saveAppendedKana() {
    var srcInput = $(this);
    var baseSrc = srcInput.data('baseSrc');
    var srcVal = srcInput.val();
    if (srcVal.indexOf(baseSrc) != 0) {
      clearValue.apply(srcInput);
    } else {
      var appendedValue = srcVal.slice(baseSrc.length, srcVal.length);
      if (ns.isKana(appendedValue)) {
        srcInput.data('appendedKana', appendedValue);
      }
    }
  }

  // 現在の値を初期値として保存
  function clearValue() {
    var srcInput = $(this);
    srcInput.data('baseSrc', srcInput.val());
    srcInput.data('appendedKana', '');
  }

  // 追記された かな を、かな入力欄に反映
  function applyAppendedKana() {
    var srcInput = $(this);
    var kanaInput = srcInput.data('kanaInput');
    var appendedKana = srcInput.data('appendedKana');
    if (appendedKana && appendedKana.length > 0) {
      kanaInput.val(kanaInput.val() + appendedKana);
      ns.convertRuby2Kana(kanaInput);
    }
    clearValue.apply(srcInput);
  }

  // ========================================================
  // イベント発行処理
  // ========================================================

  // DOM イベントを発生させる
  $.dispatchEvent = function (element, event){
    element = $(element)[0];
    if (document.createEventObject){
      // dispatch for IE
      var evt = document.createEventObject();
      return element.fireEvent('on' + event);
    }else{
      // dispatch for firefox + others
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent(event, true, true ); // event type,bubbling,cancelable
      var result = !element.dispatchEvent(evt);
      return result;
    }
  }

  // ========================================================
  // エクスポート
  // ========================================================
  ns.bindKanacopy = bindKanacopy;
  $.fn.kanacopy = kanacopy;
})(jQuery);

// bind by ClassName
jQuery(function($) {
  $(".Kanacopy, .KanaCopy").each(function() {
    var kanaInput = $(this);
    $.kanacopy.bindKanacopy(kanaInput, null, {kanaType: 'hira'});
  });
});

