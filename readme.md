かな入力欄を自動でセットするjQueryプラグイン

別途jQueryが必要です。


使い方

1. KanaCopyクラスを指定

```html:sample.html
名前
<input type="text" id="src">
<br>
かな
<input type="text" id="kana" data-src-id="src" class="KanaCopy">
```

2. セットアップ関数を呼び出す

```js:sample.js
  $('#kana').kanacopy($('#src'));
```

or

```js:sample2.js
  $.kanacopy.bindKanacopy($('#kana'), $('#src'));
```



