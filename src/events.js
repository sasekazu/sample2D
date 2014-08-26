
var gravity = new Vector3(0,-1,0);

// 加速度センサ値取得イベント
window.addEventListener("devicemotion", function(event1){
	gravity.x = event1.accelerationIncludingGravity.x;
	gravity.y = event1.accelerationIncludingGravity.y;
	gravity.z = event1.accelerationIncludingGravity.z;
	gravity.normalize();
}, true);
