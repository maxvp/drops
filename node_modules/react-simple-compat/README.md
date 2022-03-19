## ⚙️ Installation
### npm
```bash
$ npm install react-simple-compat
```

## No supported
* Context
* Hooks
* Fragments

## 🚀 How to use
Alias react, react-dom to react-simple-compat


* Rollup
```js
import reactCompat from "rollup-plugin-react-compat";

const reactPlugin = reactCompat({
    useReactCompat: true,
    resolveCompat: true,
});

```