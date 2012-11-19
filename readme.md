かな入力欄を自動でセットするjQueryプラグイン

別途jQueryが必要です。


使い方

1) KanaCopyクラスを指定する使い方

```html:sample.html
名前
<input type="text" id="src">
<br>
かな
<input type="text" id="kana" data-src-id="src" class="KanaCopy">
```

2) セットアップ関数を呼び出す使い方

```js:sample.js
  $('#kana').kanacopy($('#src'));
```

or

```js:sample2.js
  $.kanacopy.bindKanacopy($('#kana'), $('#src'));
```



