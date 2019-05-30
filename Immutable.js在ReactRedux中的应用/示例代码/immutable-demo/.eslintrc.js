const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  parser: 'babel-eslint', // 此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier', 'react', 'jsx-a11y'], // 插件配置，eslint-plugin-前缀可以从插件名称被省略
  env: { // 指定脚本的运行环境,环境定义了预定义的全局变量
    jest: true,
    browser: true, // 浏览器全局变量
    node: true, // Node.js全局变量和Node.js范围
    es6: true, // 启用除模块外的所有ECMAScript 6功能（这会自动将ecmaVersion解析器选项设置为6）
  },
  parserOptions: { // 指定解析器选项
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true
    },
  },
  globals: { // 脚本在执行期间访问的额外的全局变量
    document: true,
    navigator: true,
    window:true,
    node:true
  },
  rules: { // 'off'或者0表示关闭规则，'warn'或者1将规则打开为警告（不影响退出代码),'error'或者2- 将规则打开为错误（触发时退出代码为1）
    'prettier/prettier': ['error', prettierOptions],
    'arrow-body-style': [2, 'as-needed'], // 强制或禁止在箭头函数体的周围使用大括号,'as-needed'表示在没有大括号的地方可以省略
    'comma-dangle': [2, 'always-multiline'], // 在对象和数组文字中使用尾随逗号规则
    'quotes': [2, 'single', { // 字符串必须使用单引号
      'avoidEscape': true, // 允许包含单引号的字符串使用双引号
      'allowTemplateLiterals': true, // 允许使用模板字符串
      }
    ],
    'camelcase': 2, // 使用驼峰式命名对象、函数和实例
    'space-infix-ops': 2, // 操作符前后要加空格
    'import/imports-first': 0,
    'import/newline-after-import': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 2,
    'import/no-webpack-loader-syntax': 0,
    'import/prefer-default-export': 0,
    'indent': [
      2,
      2,
      {
        'SwitchCase': 1,
      },
    ],
    'jsx-a11y/aria-props': 2,
    'jsx-a11y/heading-has-content': 0,
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        'controlComponents': ['Input'],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/mouse-events-have-key-events': 2,
    'jsx-a11y/role-has-required-aria-props': 2,
    'jsx-a11y/role-supports-aria-props': 2,
    'jsx-quotes': 1, // 是否强制在JSX属性中一致地使用双引号或单引号
    'no-new-wrappers': 2, // 禁止 new Boolean、Number或String
    'prefer-rest-params': 2, // 必须使用解构 ...args 来代替 arguments
    'max-len': 0, // 此规则规定执行最大行长度以增加代码的可读性和可维护性
    'eqeqeq': [2, 'always', { 'null': 'ignore' }], // 必须使用===和!==，和null对比时除外
    'newline-per-chained-call': 0,
    'no-confusing-arrow': 0,
    'no-console': 1, // 此规则规定是否能调用console对象的方法
    'no-unused-vars': 2,
    'no-use-before-define': 0,
    'prefer-template': 2,
    'react/destructuring-assignment': 0,
    'react/jsx-closing-tag-location': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/jsx-filename-extension': 0,
    'react/jsx-no-target-blank': 0,
    'react/jsx-uses-vars': 2,
    'react/require-default-props': 0,
    'react/require-extension': 0,
    'react/self-closing-comp': 0,
    'react/sort-comp': 0,
    'require-yield': 0,
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js','.jsx']
      },
      'webpack': {
        'config': path.resolve(process.cwd(), 'config/webpack.common.config.js'),
      },
    }
  },
};
