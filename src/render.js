function renderLine(sphere, scene){
    var lineMaterial = new THREE.LineDashedMaterial({color: 0x009900, ambient: 0xffffff, lineWidth:500});

    var numLines = 2;
    var size = new Vector3(2.0*LX/parseFloat(numLines - 1), 2.0*LY/parseFloat(numLines - 1), 2.0*LZ/parseFloat(numLines - 1));
    
    // x-directional line
    for(var ny = 0; ny < numLines; ny++){
        for(var nz = 0; nz < numLines; nz++){
            var lineGeometry_YZ = new THREE.Geometry();

            var y = ny*size.y - LY;
            var z = nz*size.z;
            var point1 = new THREE.Vector3(-LX, y, z);
            var point2 = new THREE.Vector3(+LX, y, z);
            lineGeometry_YZ.vertices.push(point1);
            lineGeometry_YZ.vertices.push(point2);

            var line = new THREE.Line(lineGeometry_YZ, lineMaterial);
            scene.add(line);
        }
    }

    // y-directional line
    for(var nz = 0; nz < numLines; nz++){
        for(var nx = 0; nx < numLines; nx++){
            var lineGeometry_ZX = new THREE.Geometry();

            var x = nx*size.x - LX;
            var z = nz*size.z;
            var point1 = new THREE.Vector3(x, -LY, z);
            var point2 = new THREE.Vector3(x, +LY, z);
            lineGeometry_ZX.vertices.push(point1);
            lineGeometry_ZX.vertices.push(point2);

            var line = new THREE.Line(lineGeometry_ZX, lineMaterial);
            scene.add(line);
        }
    }

    // z-directional line
    for(var nx = 0; nx < numLines; nx++){
        for(var ny = 0; ny < numLines; ny++){
            var lineGeometry_XY = new THREE.Geometry();

            var x = nx*size.x - LX;
            var y = ny*size.y - LY;
            var point1 = new THREE.Vector3(x, y, 0.0);
            var point2 = new THREE.Vector3(x, y, 2.0*LZ);
            lineGeometry_XY.vertices.push(point1);
            lineGeometry_XY.vertices.push(point2);

            var line = new THREE.Line(lineGeometry_XY, lineMaterial);
            scene.add(line);
        }
    }
}
