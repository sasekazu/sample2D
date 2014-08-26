function Vector3(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}

Vector3.prototype.norm = function(){
    return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
}


Vector3.prototype.normalize = function () {
    var l = this.norm();
    this.x /= l;
    this.y /= l;
    this.z /= l;
}