function a(b){this.b=b}a.prototype.a=function(){alert(this.b)};window.MyClass=a;a.prototype.myMethod=a.prototype.a;
