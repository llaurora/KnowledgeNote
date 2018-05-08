## Immutable在React中的运用

###### &sect; input框只允许输入正数和小数(输入小数点后不允许再输入小数点儿)
```js
<input onkeyup="this.value=this.value.replace(/[^\d.]*/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
```
@import "./img/1.jpg"












