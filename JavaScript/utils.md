# utils

### **位数不够，补0**

```tsx
/**
 * 位数不够，补0
 * @returns string
 * @param num
 * @param n
 */
export function prefixZero(num: number, n: number): string | number {
    if (String(num)?.length < 2) {
        return (Array.from({ length: n }).join("0") + num).slice(-n);
    }
    return num;
}
```

### **将秒数转换成 ‘时分秒’ 的格式**

```tsx
/**
 * 将秒数转换成  '时分秒' 的格式
 * @returns string
 * @param value
 * @param format
 * @param precision
 */
export function formatSeconds(value: number, format = "zh", precision = "second"): string {
    if (Number.isNaN(Number(value))) {
        return "--";
    }
    const formatValue = Number.parseInt(String(value), 10); // 对传过来的秒数做10进制处理
    const hour = Number.parseInt(String(formatValue / 3600), 10); // 小时
    const minute = Number.parseInt(String((formatValue % 3600) / 60), 10); // 分钟数
    const second = Number.parseInt(String(formatValue - hour * 3600 - minute * 60), 10); // 秒数
    if (format === "zh") {
        if (formatValue === 0) {
            return "0";
        }
        let result = "";
        if (second > 0 && precision === "second") {
            result = `${second}秒`;
        }
        if (minute > 0 && ["second", "minute"].includes(precision)) {
            result = `${minute}分${result}`;
        }
        if (hour > 0 && ["second", "minute", "hour"].includes(precision)) {
            result = `${hour}小时${result}`;
        }
        return result;
    }

    return `${prefixZero(hour, 2)}:${prefixZero(minute, 2)}:${prefixZero(second, 2)}`;
}
```

### **对数字的整数部分每隔三位加逗号处理**

```tsx
/**
 * 对数字的整数部分每隔三位加逗号处理
 * @returns string
 * @param num
 * @param unit 单位
 */
export function formatCommaNum(num: number, unit?: string): string {
    if (Number.isNaN(num) || isNil(num)) {
        return "--";
    }
    const [integer, decimal] = `${num}`.split(".");
    const commasInteger = (integer || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
    if (isNil(decimal)) {
        return isNil(unit) ? commasInteger : `${commasInteger}${unit}`;
    }
    return isNil(unit) ? `${commasInteger}.${decimal}` : `${commasInteger}.${decimal}${unit}`;
}
```

### **对小数转百分比处理**

```tsx
/**
 * 对小数转百分比处理，默认保留2位小数
 * @returns string
 * @param rate
 * @param config
 * @param fixed
 */
interface FormatPercentConfig {
    multiply?: boolean;
    fixed?: number;
    percentMark?: boolean;
}
export function formatPercent(rate: number, config?: FormatPercentConfig): string {
    const { multiply = true, fixed = 2, percentMark = true } = config || {};
    if (Number.isNaN(rate) || isNil(rate)) {
        return "--";
    }
    if ([0, "0"].includes(rate)) {
        return "0";
    }
    const str = multiply ? `${Number.parseFloat(String((Math.abs(rate) * 100).toFixed(fixed)))}` : `${Math.abs(rate)}`;
    if (percentMark) {
        return `${str}%`;
    }
    return str;
}
```

### **设置Storage**

```tsx
/**
 * 设置Storage，默认localStorage
 * @returns void
 * @param key
 * @param value
 * @param storeType
 */
export function setStorage(key: string, value: any, storeType = "local"): void {
    let transSource: string;
    try {
        transSource = JSON.stringify(value);
    } catch {
        transSource = value;
    }
    if (storeType === "local") {
        localStorage.setItem(key, transSource);
        return;
    }
    sessionStorage.setItem(key, transSource);
}
```

### **获取Storage**

```tsx
/**
 * 获取Storage，默认localStorage
 * @returns void
 * @param key
 * @param storeType
 */
export function getStorage(key: string, storeType = "local"): any {
    const getVal = storeType === "local" ? localStorage.getItem(key) : sessionStorage.getItem(key);
    return (() => {
        let transTarget: string;
        try {
            transTarget = JSON.parse(getVal);
        } catch {
            transTarget = getVal;
        }
        return transTarget;
    })();
}
```

### **责任链钩子**

```tsx
export class SyncBailHook {
    #tasks: any[];

    constructor(array) {
        this.#tasks = array;
    }

    call(...args) {
        let ret;
        let index = 0;
        do {
            ret = this.#tasks[index](...args);
            index += 1;
        } while (ret === undefined && index < this.#tasks.length);

        return ret;
    }
}
```

### **发布订阅**

```tsx
type EventHandler = (...args: any[]) => any;
export class EventEmitter {
    #emiter = new Map<string, EventHandler[]>();

    public subscribe(topic: string, ...handlers: EventHandler[]) {
        let topics = this.#emiter.get(topic);
        if (!topics) {
            this.#emiter.set(topic, (topics = []));
        }
        topics.push(...handlers);
    }

    public unsubscribe(topic: string, handler?: EventHandler): boolean {
        if (!handler) {
            return this.#emiter.delete(topic);
        }
        const topics = this.#emiter.get(topic);
        if (!topics) {
            return false;
        }
        const index = topics.indexOf(handler);
        if (index < 0) {
            return false;
        }
        topics.splice(index, 1);
        if (topics.length === 0) {
            this.#emiter.delete(topic);
        }
        return true;
    }

    public publish(topic: string, ...args: any[]): any[] | null {
        const topics = this.#emiter.get(topic);
        if (!topics) {
            return null;
        }
        return topics.map((handler: EventHandler) => {
            try {
                return handler(...args);
            } catch {
                return null;
            }
        });
    }
}
```

### **深克隆**

```jsx
const judeType = (obj) => {
  return Object.prototype.toString.call(obj).slice(8, -1);
}
const deepClone = (obj) => {
  let result;
  const type = judeType(obj);
  switch (type) {
    case 'Object':
      result = {};
      break;
    case 'Array':
      result = [];
      break;
    default:
      return obj;
  }
  for (key in obj) {
    const copy = obj[key];
    if (['Object', 'Array'].includes(judeType(copy))) {
      result[key] = arguments.callee(copy);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}
```

### **Input 框只允许输入正数和小数**

```html
<input onkeyup="this.value=this.value.replace(/[^\d.]*/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')"/>
```

### **谷歌浏览器去除记住密码 Input 框黄色背景**

```css
input:-webkit-autofill{
  -webkit-animation-name: autofill;
  -webkit-animation-fill-mode: both;
}
@-webkit-keyframes autofill {
  to{
    color: #fff;
    background: transparent;
  }
}
```

### **火狐浏览器按钮点击后虚线去除**

```css
::-moz-focus-inner{border:none;}
```

### **页面顶部阴影**

```css
body:before {
  content: "";
  position: fixed;
  top: -10px;
  left: 0;
  width: 100%;
  height: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.8);
  z-index: 100;
}
```