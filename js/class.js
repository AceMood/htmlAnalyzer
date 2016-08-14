/**
 * @constructor
 */
var MyClass = function(name) {
  this.myName = name;
};
MyClass.prototype.myMethod = function() {
  alert(this.myName);
};
window['MyClass'] = MyClass; // <-- Constructor
MyClass.prototype['myMethod'] = MyClass.prototype.myMethod;