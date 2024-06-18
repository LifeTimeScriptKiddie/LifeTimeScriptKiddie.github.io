To understand prototype pollution, the basic understanding of JavaScript is required. Thanks to PortSwigger. 


Key concepts:
1. What is Object?
2. What is a Method in an Object?
3. What is Object literal?
4. What is Prototype?
5. What is Prototype Pollution? 
6. How to select a target?

----

## 1. What is an Object?
A JavaScript object is essentially just a collection of key:value pairs known as "Properties"

As the below image indicates, `person` is an object. Under the `person` object, five properties exists. 


---

## 2. What is a Method in an Object?


`greet` is a method, which is a way to call a function within an object. 


![](Pasted%20image%2020240618103831.png)

---
## 3. What is Object literal

Object literal is a way to define an object. From the above picture, `{}`, `key:value`, and `,` are syntax of an object literal.

---
##  4. What is Prototype Property?

GPT says:
Every JavaScript function has a prototype property that is used to attach properties and methods that should be inherited by instances created by that function when it is used as a constructor.

When a function is defined, it automatically gets a `prototype` property.

###  4.1 A great example from PortSwigger.
![](Pasted%20image%2020240618113213.png)
![](Pasted%20image%2020240618110000.png)


### 4.2  Another example from GPT.
**Functions**: When a function is defined, it automatically gets a prototype property. This is an object that will be assigned as the prototype for all instances created by this function.

``` javascript
function MyConstructor() {}
console.log(typeof MyConstructor.prototype); // "object"

```

**Constructor** Functions: When you use a constructor function with the new keyword, the created object’s __proto__ is set to the constructor function’s prototype.




A constructor function is a regular function that is used with the `new` keyword to create objects. `When called with new, the function sets up a new object and binds this to the new object, allowing it to initialize the object's properties and methods.`

![](Pasted%20image%2020240618112430.png)


**Built-in Prototypes**: Built-in objects like Array, String, etc., have their own prototype objects that define methods available to their instances.

```javascript
let arr = [];
console.log(arr.__proto__ === Array.prototype); // true
console.log(Array.prototype.constructor === Array); // true


```

### 4a. How to access an object's prototype?
```javascript
username.__proto__
username['__proto__']
username.__proto__       // String.prototype
username.__proto__.__proto__  // Object.prototype
username.__proto__.__proto__.__proto__   // null

```




---
## 5. What is Prototype Pollution?

Prototype pollution is a JavaScript vulnerability that enables an attacker to add arbitrary properties to global object prototypes, which may then be inherited by user-defined objects.


![](../Pasted%20image%2020240618170402.png)
Two types exist. 
1. Server Side
2. Client Side

---

## 6. How to select a target?
1. A web application with a vulnerable merge/extend function. AND
2. Provide a path to code execution or authentication bypass using the injected properties. 



__

Resources:
https://portswigger.net/web-security/prototype-pollution/javascript-prototypes-and-inheritance
https://portswigger.net/web-security/prototype-pollution

https://www.youtube.com/watch?v=LUsiFV3dsK8
