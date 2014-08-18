function Box(lx, ly, lz) // class of box
{
    this.length = BOXSIZE;

    this.numBox = new Vector3(2.0*lx/this.length, 2.0*ly/this.length, 2.0*lz/this.length);
    this.numTotalBox = this.numBox.x*this.numBox.y*this.numBox.z;
}

    /*
    var boxThree = [];
    box = new Box(LX, LY, LZ);

    var boxGeometry = new THREE.CubeGeometry(box.length, box.length, box.length);
    var boxMaterial = new THREE.MeshLambertMaterial({color: 'rgb(255, 255, 255)'});
    boxThree[0] = new THREE.Mesh(boxGeometry, boxMaterial);
    boxThree[0].position.set(0.0, 0.0, +LZ);
    scene.add(boxThree[0]);
   
    for(var idBox_Z = 0; idBox_Z < box.numBox.z; idBox_Z++){
        for(var idBox_Y = 0; idBox_Y < box.numBox.y; idBox_Y++){
            for(var idBox_X = 0; idBox_X < box.numBox.x; idBox_X++){
                var idBox = idBox_Z*box.numBox.x*box.numBox.y + idBox_Y*box.numBox.x + idBox_X;
                var boxGeometry = new THREE.CubeGeometry(box.length, box.length, box.length);
                var boxMaterial = new THREE.MeshLambertMaterial({color: 'rgb(255, 255, 255)'});
                boxThree[idBox] = new THREE.Mesh(boxGeometry, boxMaterial);

                boxThree[idBox].position.x = (idBox_X + 0.5)*box.length - LX;
                boxThree[idBox].position.y = (idBox_Y + 0.5)*box.length - LY;
                boxThree[idBox].position.z = (idBox_Z + 0.5)*box.length;
                scene.add(boxThree[idBox]);
            }
        }
    }
    */
