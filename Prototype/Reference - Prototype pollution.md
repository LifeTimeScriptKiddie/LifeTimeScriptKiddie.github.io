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

Almost every thing in JS is an object


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

The __proto__ property in JavaScript is a reference to the prototype of an object. 

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





![](Pasted%20image%2020240618150007.png)



A constructor function is a regular function that is used with the `new` keyword to create objects. `When called with new, the function sets up a new object and binds this to the new object, allowing it to initialize the object's properties and methods.`

![](Pasted%20image%2020240618112430.png)


**Built-in Prototypes**: Built-in objects like Array, String, etc., have their own prototype objects that define methods available to their instances.

```javascript
let arr = [];
console.log(arr.__proto__ === Array.prototype); // true
console.log(Array.prototype.constructor === Array); // true


```

### 4.3 How to access an object's prototype?
The property `__proto__` can be accessed many ways.
```javascript
username.__proto__
username['__proto__']  //Important for Prototype.
username.__proto__       // String.prototype
username.__proto__.__proto__  // Object.prototype
username.__proto__.__proto__.__proto__   // null

```


### 4.4 Prototype inheritance  - new operator

When an object is generated using `new` operator, (object s below), and a constructor function, (function X below), `__proto__` value of function x will be copied over to the object s. 

![](Pasted%20image%2020240620105943.png)
Let's use the below script.

I created a function name tester. This function sets two properties, name and age. 


```javascript
function tester() {
    this.name = 'tester';
    this.age = 2;
}

```

A method `isOld` is added to `tester.prototype`. Meaning, every instance of `tester` will have access to `isOld` method via the prototype chain.

```javascript
// Add method to prototype
tester.prototype.isOld = function() {
    console.log("old");
    return this.age;
};
```

A new instance `x` is created using a function `tester()` As we can see, `x.__proto__` has same value as `tester.prototype`
```javascript
// Create an instance
var x = new tester();

console.log(x.name); // Outputs: tester
console.log(x.isOld()); // Outputs: old, returns: 2
console.log(x.__proto__ === tester.prototype); // Outputs: true
console.log(tester.prototype.isOld); // Outputs: [Function: isOld]

```

Here other functions are observed under `__proto__`
![](Pasted%20image%2020240620113738.png)

---
This is a screenshot from the vscode. 

![](Pasted%20image%2020240620111746.png)


here

The `new` operator lets developers create an instance of a user-defined object type or of one of the built-in object types that has a constructor function.

When a function is called with the `new` keyword, the function will be used as a constructor. new will do the following things:
	Creates a blank, plain JavaScript object. For convenience, let's call it newInstance.
	
	Points newInstance's [[Prototype]] to the constructor function's prototype property, if the prototype is an Object. 





https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new#description



---
## 5. What is Prototype Pollution?
It is a way for an attacker to manipulate global `__proto__` property. 

By setting `key` value as `__proto__`, attackers can implant payload. 


```
const obj1 = { a: 1 };
const obj2 = { b: 2 };

const maliciousObj = { ["__proto__"]: { isAdmin: true } };
Object.assign(obj1, maliciousObj);


console.log(obj1.isAdmin); // true
console.log(obj2.isAdmin); // true
console.log(({}).isAdmin); // true


```
Example from PortSwigger
```
{
    existingProperty1: 'foo',
    existingProperty2: 'bar',
    __proto__: {
        evilProperty: 'payload'
    }
}

targetObject.__proto__.evilProperty = 'payload';

```
An example explaining recursion.
Recursion is a common programming technique where a function calls itself in order to solve a problem. 
```
function merge(a, b) {
    for (var key in b) {
        if (isObject(a[key]) && isObject(b[key])) {
            merge(a[key], b[key]);
        } else {
            a[key] = b[key];
        }
    }
    return a;
}

function isObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
}



const a = {
    level1: {
        level2: {
            value: 1
        }
    }
};

const b = {
    level1: {
        level2: {
            value: 2,
            newValue: 3
        },
        anotherLevel2: {
            value: 4
        }
    }
};

const result = merge(a, b);
console.log(result);

merge(a, b)

{
    level1: {
        level2: {
            value: 2,
            newValue: 3
        },
        anotherLevel2: {
            value: 4
        }
    }
}


```


Prototype pollution is a JavaScript vulnerability that enables an attacker to add arbitrary properties to global object prototypes, which may then be inherited by user-defined objects.


![](Pasted%20image%2020240618093109.png)


Two types exist. 
1. Server Side
2. Client Side

---

## 6. How to select a target?
1. A web application with a vulnerable merge/extend function. AND
2. Provide a path to code execution or authentication bypass using the injected properties. 

### 6.1 Whitebox testing.
```

### 1. Object and Array Manipulation
Examine code where objects and arrays are created or modified. Pay close attention to:
- `Object.prototype`
- `Object.create()`
- `Object.setPrototypeOf()`
- `Object.defineProperty()`
- `Object.defineProperties()`
- `Object.assign()`
- `Array.prototype`

### 2. Dynamic Property Assignment
Look for dynamic property assignments, especially those involving user input:


obj[key] = value;

Ensure key is validated and sanitized to prevent keys like __proto__ from being used.


### 3. Merging and Cloning Functions
Check functions that merge or clone objects, as they can introduce prototype pollution if not handled correctly:

Shallow copy
Object.assign({}, sourceObject);

Deep copy
JSON.parse(JSON.stringify(sourceObject));

### 4. User-Defined Properties
Inspect any instances where user-defined properties are added to objects. This includes parsing JSON input, form data, or query parameters:

let userData = JSON.parse(userInput);



### 5. External libraries
view packages.
docker-compose -f ~/chips/docker-compose.yml run <docker name> npm list -prod -depth 1

Locate which library is using the package. 
docker-compose -f ~/chips/docker-compose.yml run <docker name> npm audit







```


### 6.2 Blackbox testing
```
# Black Box Testing for Prototype Pollution

## Key Strategies

### 1. Identify Potential Entry Points
Focus on areas where user input is accepted and processed:
- Form inputs
- URL query parameters
- JSON payloads in API requests
- Headers and cookies

### 2. Construct Malicious Payloads
Create payloads designed to modify the prototype of objects. Common payloads include:


{
  "__proto__": {
    "polluted": "true"
  }
}


{
  "constructor": {
    "prototype": {
      "polluted": "true"
    }
  }
}



```

__


## 7. Protections/mitigations
Using `[]` to access an array will protects it from prototype pollution. --> When using square bracket notation, keys can be dynamically evaluated.

```javascript
const key = userInput; // userInput could be "__proto__"
if (key !== "__proto__" && key !== "constructor" && key !== "prototype") {
    obj[key] = value;
} else {
    throw new Error("Invalid key");
}

// Then obj will be sanitized. 
const safeKey = sanitize(userInput);
obj[safeKey] = value;



```


Resources:
https://portswigger.net/web-security/prototype-pollution/javascript-prototypes-and-inheritance
https://portswigger.net/web-security/prototype-pollution

https://www.youtube.com/watch?v=LUsiFV3dsK8
