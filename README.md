# babel-plugin-globals-shield

```js
{
  "plugins": [
    ["globals-shield", {
      "includes":["src/unsafe"], // If this is not set, it will work on all files
      "globals": ["window", "document", "xhr", "fetch"] // This is necessary to specify the global variables that need to be masked
    }]
  ]
}
```
