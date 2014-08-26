function randInt(min, max){
    return Math.floor(Math.random()*(max - min + 1)) + min; 
}

var scene;
function sceneConf(){
    scene = new THREE.Scene();
}

var camera;
function cameraConf(){
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

    camera.position.set(0, 0, 250);
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

var renderer;
function rendererConf(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    renderer.setClearColor(0x000011, 1); // add background color
    renderer.shadowMapEnabled = true;
}

var dirLight, ambLight;
function lightConf(){
    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 0, 500);
    dirLight.castShadow = true;

    ambLight = new THREE.AmbientLight(0x333333);
    
    scene.add(dirLight);
    scene.add(ambLight);
}

var plane;
function planeConf(){
    var planeGeometry = new THREE.PlaneGeometry(LX*2.0, LY*2.0);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0x555555, side:THREE.DoubleSide});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;

    scene.add(plane);

    var planeGeometry2 = new THREE.PlaneGeometry(LX*2.0, LY*2.0);
    plane2 = new THREE.Mesh(planeGeometry2, planeMaterial);
    plane2.position.set(0, 0, -1.0);
    plane2.receiveShadow = true;

    scene.add(plane2);
}

var controls;
function orbitControlsConf(){
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

var axis;
function helperConf(){
    axis = new THREE.AxisHelper(100); 
    axis.position.set(0, 0, 0);
    scene.add(axis);
}



$(document).ready(function () {
    // three.jsÇégÇ§Ç∆Ç´ÇÕindex.htmlÇÃcanvasÉ^ÉOÇè¡Ç∑
    //render();

    canvasRender();
});


function canvasRender() {
    canvas = $("#myCanvas");
    cvs = document.getElementById('myCanvas');
    context = canvas.get(0).getContext("2d");
    canvasWidth = canvas.width();
    canvasHeight = canvas.height();


    var sphereThree = [];
    sphere = new Sphere(LX, LY, LZ, NUM_SPHERE);

    mainloop();
}

function mainloop() {
	for(var i = 0; i < 5; ++i) {
		context.clearRect(0,0,canvas.width(),canvas.height());
		sphere.calcForceUsingMapping();
		sphere.calcVelocity();
		sphere.updateSphere(DT, NUM_SPHERE);
		sphere.mapping();
	}
    
	var r=1;
    for(var idSphere = 0; idSphere < NUM_SPHERE; idSphere++) {
		/*
        context.beginPath();
        context.arc(sphere.position[idSphere].x+LX, sphere.position[idSphere].y, 1, 0, 2*Math.PI, true);
        context.fill();
		*/
		context.fillRect(scale*(sphere.position[idSphere].x+LX-r), scale*(sphere.position[idSphere].y+LY-r), scale*2*r, scale*2*r);
    }
    setTimeout(mainloop, 20);
}


function render(){
    sceneConf();
    cameraConf();
    rendererConf();

    lightConf();
    planeConf();

    var program = function(context){
        context.beginPath();
        context.arc( 0, 0, 0.5, 0, PI2, true );
        context.fill();
    }

    var sphereThree = [];
    sphere = new Sphere(LX, LY, LZ, NUM_SPHERE);
    
    var pGeometry = new THREE.Geometry();
    var pMaterial = new THREE.ParticleBasicMaterial({color: 0x3333FF, size: 3});

//    var sphereGeometry = new THREE.SphereGeometry(1.0);
//    var sphereMaterial = new THREE.MeshPhongMaterial({color: 'rgb(50, 50, 255)'});
//    var sphereMaterial = new THREE.SpriteCanvasMaterial({color: 'rgb(50, 50, 255)', program:program});

    for(var idSphere = 0; idSphere < NUM_SPHERE; idSphere++){
//        sphereThree[idSphere] = new THREE.Mesh(sphereGeometry, sphereMaterial);
        var vertex = new THREE.Vector3(sphere.position[idSphere].x, sphere.position[idSphere].y, 0.0);

//        particles.vertices.push(vertex);
        pGeometry.vertices[idSphere] = new THREE.Vector3(sphere.position[idSphere].x, sphere.position[idSphere].y, 0.0);

//        sphereThree[idSphere].position.x = sphere.position[idSphere].x;
//        sphereThree[idSphere].position.y = sphere.position[idSphere].y;
//        sphereThree[idSphere].position.z = sphere.position[idSphere].z;
//        scene.add(sphereThree[idSphere]);
    }
    var particleSystem = new THREE.ParticleSystem(pGeometry, pMaterial); 
    scene.add(particleSystem);
//    renderLine(sphere, scene);

    var funcTimer = [];
    var ratio = [];
    funcTimer[0] = 0.0; // timer for calcForce
    funcTimer[1] = 0.0; // timer for calcVelocity
    funcTimer[2] = 0.0; // timer for updateSphere
    funcTimer[3] = 0.0; // timer for mapping
    funcTimer[4] = 0.0; // timer for rendering

    var iter = 0, totalTime = 0.0;
    var render = function(){
        var start = new Date();
        requestAnimationFrame(render);

        for(var count = 0; count < 5; count++){
            funcTimer[0] += sphere.calcForceUsingMapping();
            funcTimer[1] += sphere.calcVelocity();
            funcTimer[2] += sphere.updateSphere(DT, NUM_SPHERE);
            funcTimer[3] += sphere.mapping();
        }

        for(var idSphere = 0; idSphere < NUM_SPHERE; idSphere++){
            pGeometry.vertices[idSphere].set(sphere.position[idSphere].x, sphere.position[idSphere].y, sphere.position[idSphere].z);
            pGeometry.verticesNeedUpdate = true;
//            pGeometry.vertices[idSphere].x = sphere.position[idSphere].x; 
//            pGeometry.vertices[idSphere].y = sphere.position[idSphere].y; 
//            pGeometry.vertices[idSphere].z = sphere.position[idSphere].z; 
//            sphereThree[idSphere].position.x = sphere.position[idSphere].x;
//            sphereThree[idSphere].position.y = sphere.position[idSphere].y;
//            sphereThree[idSphere].position.z = sphere.position[idSphere].z;

//            sphereThree[idSphere].material.color.r = sphere.color[idSphere].x;
//            sphereThree[idSphere].material.color.g = sphere.color[idSphere].y;
//            sphereThree[idSphere].material.color.b = sphere.color[idSphere].z;
        }

        scene.add(particleSystem);
        renderer.render(scene, camera);
//        controls.update();

        iter++;
        var end = new Date();
        var iterTime = end.getTime() - start.getTime();
        totalTime += iterTime;

        var fps = iter/(totalTime/1000.0);

        funcTimer[4] = totalTime - funcTimer[0] - funcTimer[1] - funcTimer[2] - funcTimer[3];

        ratio[0] = funcTimer[0]/totalTime*100.0;
        ratio[1] = funcTimer[1]/totalTime*100.0;
        ratio[2] = funcTimer[2]/totalTime*100.0;
        ratio[3] = funcTimer[3]/totalTime*100.0;
        ratio[4] = funcTimer[4]/totalTime*100.0;

        if(iter%100 == 0){
            console.log('fps %f [1/s]', fps);
            console.log('total time %f [s] - iteration %d', totalTime/1000.0, iter);
            console.log('function: calcForce    %f (%f %)', funcTimer[0]/1000.0, ratio[0]);
            console.log('function: calcVelocity %f (%f %)', funcTimer[1]/1000.0, ratio[1]);
            console.log('function: updateSphere %f (%f %)', funcTimer[2]/1000.0, ratio[2]);
            console.log('function: mapping      %f (%f %)', funcTimer[3]/1000.0, ratio[3]);
            console.log('function: rendering    %f (%f %)', funcTimer[4]/1000.0, ratio[4]);
        }
    }

    render();
}
