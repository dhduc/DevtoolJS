# stopBefore.js

[2min screencast](http://www.screenr.com/wt37)

These tools inject a breakpoint, `console.log` or `console.count`
in any function you want to spy on via
`stopBefore('Element.prototype.removeChild')`
or ditto `stopAfter`, `logBefore` / `logAfter` / `logAround` / `logCount`.

Works in Chrome DevTools and Safari Inspector; Firefox dev tools reportedly less so.

## Examples

```javascript
stopBefore('document.getElementById') // typical use
stopBefore(document, 'getElementById') // object ref and member name also works
stopBefore(Element.prototype, 'removeChild')

stopAfter(Element.prototype, 'querySelectorAll')

logBefore('alert')
logAfter('confirm')
logAround('prompt')

...will `console.log()` the method name before, after, or before and after a call,
latter two also logging the result returned afterwards:

> prompt("How's that?", "pretty cool");
-> prompt(2 args)
<- prompt(2 args): "really excellent!"

logCount('document.getElementById') just console.count()s the number of calls.

To revert back, call <methodname>.undo(), as many times as you have wrapped it.
```