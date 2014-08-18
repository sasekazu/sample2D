function randInt(min, max){
    return Math.floor(Math.random()*(max - min + 1)) + min; 
}

function rangeRand(min, max){
    var rand = Math.random();
    return (max*rand + (1.0 - rand)*min)
}

function Sphere(lx, ly, lz, numSphere) // class of sphere
{
    /* --- variables for sphere --- */
    this.numSphere = numSphere; // number of spheres
    this.position = [];         // [Vector3] position coordinate
    this.velocity = [];         // [Vector3] velocity
    this.radius = [];           // sphere radius
    this.color  = [];           // [Vector3] color (r, g, b)
    this.force  = [];           // [Vector3] force
    this.mass   = [];           // mass of sphere
    this.collisionFlag = [];    // flag to check the collision  

    /* --- variables for computational domain --- */
    this.lx = lx;   // x-directional domain size
    this.ly = ly;   // y-directional domain size
    this.lz = lz;   // z-directional domain size

    /* --- variables for mapping --- */
    this.mapsize = BOXSIZE;
    this.numBox =
        new Vector3(
            parseInt((2.0*lx)/this.mapsize),
            parseInt((2.0*ly)/this.mapsize),
            1
        );
    this.numTotalBox = this.numBox.x*this.numBox.y*this.numBox.z;
    this.hash    = new Array(this.numSphere);
    this.idOrder = new Array(this.numSphere);
    this.hashMax = new Array(this.numTotalBox);
    this.hashMin = new Array(this.numTotalBox);
    this.numHash = new Array(this.numTotalBox);

    for(var idSphere = 0; idSphere < this.numSphere; idSphere++){ // initialize
        this.collisionFlag.push(0);
        this.color[idSphere]    = new Vector3(0.0, 0.0, 0.0);
        this.force[idSphere]    = new Vector3(0.0, 0.0, 0.0);
        this.velocity[idSphere] = new Vector3(0.0, 0.0, 0.0);
        this.position[idSphere] = new Vector3(0.0, 0.0, 0.0);
    }
    this.initialRandom();
    this.mapping();

    this.calcForceUsingMapping();
}

Sphere.prototype.initialRandom = function(){
    var range_x  = PARTICLE_RANGE_X;
    var range_y  = PARTICLE_RANGE_Y;
    var offset_x = PARTICLE_OFFSET_X;
    var offset_y = PARTICLE_OFFSET_Y;

    for(var idSphere = 0; idSphere < this.numSphere; idSphere++){
//        this.radius.push(rangeRand(0.8, 1.2));
        this.radius.push(1.0);

        this.mass.push(4.0/3.0*Math.PI*Math.pow(this.radius[idSphere], 3)*RHO);
        do{
            var flag = 0;
            var tx = rangeRand(-range_x + offset_x, range_x + offset_x);
            var ty = rangeRand(-range_y + offset_y, range_y + offset_y);
            var tz = 0.0;

            for(var idSphere2 = 0; idSphere2 < idSphere; idSphere2++){
                var rx = this.position[idSphere2].x - tx; 
                var ry = this.position[idSphere2].y - ty; 
                var rz = 0.0; 
                if (Math.sqrt(rx*rx + ry*ry) < 2.0*1.05) flag = 1;
//                if (Math.sqrt(rx*rx + ry*ry) < (this.radius[idSphere] + this.radius[idSphere2])*1.05) flag = 1;
            }
        } while (flag != 0);

        this.position[idSphere].x = tx;
        this.position[idSphere].y = ty;
        this.position[idSphere].z = 0.0;
    }
}

Sphere.prototype.updateSphere = function(dt, numSphere){
    var start = new Date();
    var idSphere;

    for(idSphere = 0; idSphere < numSphere; idSphere++){
        this.position[idSphere].x += this.velocity[idSphere].x*dt;
        this.position[idSphere].y += this.velocity[idSphere].y*dt;
        this.position[idSphere].z += this.velocity[idSphere].z*dt;

        if(this.position[idSphere].x + this.radius[idSphere] > +this.lx){
            this.position[idSphere].x  = +(1.0 + EPSILON)*(this.lx - this.radius[idSphere]) - EPSILON*this.position[idSphere].x;
            this.velocity[idSphere].x *= -1.0*EPSILON;
        }

        if(this.position[idSphere].x - this.radius[idSphere] < -this.lx){
            this.position[idSphere].x  = -(1.0 + EPSILON)*(this.lx - this.radius[idSphere]) - EPSILON*this.position[idSphere].x;
            this.velocity[idSphere].x *= -1.0*EPSILON;
        }

        if(this.position[idSphere].y + this.radius[idSphere] > +this.ly){
            this.position[idSphere].y  = +(1.0 + EPSILON)*(this.ly - this.radius[idSphere]) - EPSILON*this.position[idSphere].y;
            this.velocity[idSphere].y *= -1.0*EPSILON;
        }

        if(this.position[idSphere].y - this.radius[idSphere] < -this.ly){
            this.position[idSphere].y  = -(1.0 + EPSILON)*(this.ly - this.radius[idSphere]) - EPSILON*this.position[idSphere].y;
            this.velocity[idSphere].y *= -1.0*EPSILON;
        }

        if(this.position[idSphere].z + this.radius[idSphere] > +2.0*this.lz){
            this.position[idSphere].z  = +(1.0 + EPSILON)*(2.0*this.lz - this.radius[idSphere]) - EPSILON*this.position[idSphere].z;
            this.velocity[idSphere].z *= -1.0*EPSILON;
        }

        if(this.position[idSphere].z - this.radius[idSphere] < 0.0){
            this.position[idSphere].z  = +(1.0 + EPSILON)*this.radius[idSphere] - EPSILON*this.position[idSphere].z;
            this.velocity[idSphere].z *= -1.0*EPSILON;
        }
    }

    var end = new Date();
    return (end.getTime() - start.getTime());
}

Sphere.prototype.calcForce = function()
{
    var start = new Date();
    for(var idSphere1 = 0; idSphere1 < this.numSphere; idSphere1++){
        this.collisionFlag[idSphere1] = false;
        this.force[idSphere1].x       = +0.0;
        this.force[idSphere1].y       = -G*this.mass[idSphere1];

        for(var idSphere2 = 0; idSphere2 < this.numSphere; idSphere2++){
            if(idSphere1 == idSphere2) continue;
            var rx = this.position[idSphere2].x - this.position[idSphere1].x; 
            var ry = this.position[idSphere2].y - this.position[idSphere1].y; 
            var r  = Math.sqrt(rx*rx + ry*ry);

//            if(r < this.radius[idSphere1] + this.radius[idSphere2]){
            if(r < 2.0){
                this.collisionFlag[idSphere1] = true;

                var nx = rx/r;
                var ny = ry/r;

//                var dr  = (this.radius[idSphere1] + this.radius[idSphere2]) - r;
                var dr  = 2.0 - r;
                var drx = dr*nx;
                var dry = dr*ny;

                var dvx = this.velocity[idSphere2].x - this.velocity[idSphere1].x;
                var dvy = this.velocity[idSphere2].y - this.velocity[idSphere1].y;
                
                var n_dot_dv = nx*dvx + ny*dvy;

                var dvnx = nx*n_dot_dv;
                var dvny = ny*n_dot_dv;
                
                this.force[idSphere1].x += - K_N*drx + ETA_N*dvnx;
                this.force[idSphere1].y += - K_N*dry + ETA_N*dvny;
            }
        }
    }
    var end = new Date();
    return (end.getTime() - start.getTime());
}

Sphere.prototype.calcForceUsingMapping = function()
{
    var start = new Date();
    for(var idScan1 = 0; idScan1 < this.numSphere; idScan1++){
        var hash      = this.hash[idScan1];
        var idSphere1 = this.idOrder[idScan1];

        var hash_y = Math.floor(hash/parseInt(this.numBox.x));
        var hash_x = hash - hash_y*this.numBox.x;

        this.collisionFlag[idSphere1] = false;
        this.force[idSphere1].x       = +0.0;
        this.force[idSphere1].y       = -G*this.mass[idSphere1];
        
        for(var j = -1; j <=1; j++){
            var idBox_y = hash_y + j;
            if(idBox_y < 0 || this.numBox.y <= idBox_y) continue;

            for(var i = -1; i <=1; i++){
                var idBox_x = hash_x + i;
                if(idBox_x < 0 || this.numBox.x <= idBox_x) continue;

                var idBox = idBox_y*this.numBox.x + idBox_x;
                var min   = this.hashMin[idBox];
                var max   = this.hashMax[idBox];
                
                if(min == -1) continue;
                for(var idScan2 = min; idScan2 <= max; idScan2++){
                    var hash2 = this.hash[idScan2];
                    var idSphere2 = this.idOrder[idScan2];

                    if(idSphere1 == idSphere2) continue;
                    var rx = this.position[idSphere2].x - this.position[idSphere1].x; 
                    var ry = this.position[idSphere2].y - this.position[idSphere1].y; 
                    var r  = Math.sqrt(rx*rx + ry*ry);

//                    if(r < this.radius[idSphere1] + this.radius[idSphere2]){
                    if(r < 2.0){
                        this.collisionFlag[idSphere1] = true;

                        var nx = rx/r;
                        var ny = ry/r;

//                        var dr  = (this.radius[idSphere1] + this.radius[idSphere2]) - r;
                        var dr  = 2.0 - r;
                        var drx = dr*nx;
                        var dry = dr*ny;

                        var dvx = this.velocity[idSphere2].x - this.velocity[idSphere1].x;
                        var dvy = this.velocity[idSphere2].y - this.velocity[idSphere1].y;
                        
                        var n_dot_dv = nx*dvx + ny*dvy;

                        var dvnx = nx*n_dot_dv;
                        var dvny = ny*n_dot_dv;
                        
                        this.force[idSphere1].x += - K_N*drx + ETA_N*dvnx;
                        this.force[idSphere1].y += - K_N*dry + ETA_N*dvny;
                    }
                }
            }
        }
    }
    var end = new Date();
    return (end.getTime() - start.getTime());
}

Sphere.prototype.calcVelocity = function()
{
    var start = new Date();
    for(var idSphere = 0; idSphere < this.numSphere; idSphere++){
        this.velocity[idSphere].x += this.force[idSphere].x/this.mass[idSphere]*DT;
        this.velocity[idSphere].y += this.force[idSphere].y/this.mass[idSphere]*DT;
        this.velocity[idSphere].z =  0.0;
    }
    var end = new Date();
    return (end.getTime() - start.getTime());
}

Sphere.prototype.bubblesortHash = function()
{
    for(var j = 0; j < this.numSphere - 1; j++){
        for(var i = (this.numSphere - 1); i > j; i--){
            if(this.hash[i - 1] > this.hash[i]){
                var temp1 = this.hash[i - 1];
                var temp2 = this.idOrder[i - 1];

                this.hash[i - 1]    = this.hash[i];
                this.idOrder[i - 1] = this.idOrder[i];

                this.hash[i]    = temp1;
                this.idOrder[i] = temp2;
            }
        }
    }
}

Sphere.prototype.quicksortHash = function(start, end)
{
    var pivot = this.hash[Math.floor((start + end)/2)];
    var i = start;
    var j = end;

    while(true){
        while(this.hash[i] < pivot) i++;
        while(pivot < this.hash[j]) j--;

        if(i >= j) break;

        var temp1 = this.hash[i];
        var temp2 = this.idOrder[i];

        this.hash[i]    = this.hash[j];
        this.idOrder[i] = this.idOrder[j];

        this.hash[j]    = temp1;
        this.idOrder[j] = temp2;

        i++;
        j--;
    }

    if(start < i - 1) this.quicksortHash(start, i - 1);
    if(j + 1 < end)   this.quicksortHash(j + 1, end);
}

Sphere.prototype.setHashRange = function()
{
    var idSphere = 0;
    var flag;

    for(var idBox = 0; idBox < this.numTotalBox; idBox++){
        flag = false;

        if(this.hash[idSphere] == idBox){
            flag = true;
            this.hashMin[idBox] = idSphere;
            this.hashMax[idBox] = idSphere;

            while(this.hash[++idSphere] == idBox) this.hashMax[idBox] = idSphere; 
        }

        if(flag) this.numHash[idBox] = this.hashMax[idBox] - this.hashMin[idBox] + 1;
        else{
            this.numHash[idBox] = 0;
            this.hashMin[idBox] = -1;
            this.hashMax[idBox] = -1;
        }
    }

    var sumSphere = 0;
    for(idBox = 0; idBox < this.numTotalBox; idBox++) sumSphere += this.numHash[idBox];
}

Sphere.prototype.mapping = function()
{
    var start = new Date();
    for(var idSphere = 0; idSphere < this.numSphere; idSphere++){
        var x = this.position[idSphere].x;
        var y = this.position[idSphere].y;

        var idBox_x = parseInt((x + LX)/this.mapsize);
        var idBox_y = parseInt((y + LY)/this.mapsize);

        var idBox = idBox_y*this.numBox.x + idBox_x;

        this.hash[idSphere] = idBox;
        this.idOrder[idSphere] = idSphere;
    }

//    this.bubblesortHash();
    this.quicksortHash(0, this.numSphere - 1);
    this.setHashRange();
//    this.updateColor();

    var end = new Date();
    return (end.getTime() - start.getTime());
}

// method for color setting
Sphere.prototype.updateColor = function()
{
    for(var idSphere = 0; idSphere < this.numSphere; idSphere++){
        var y = this.position[idSphere].y;

        if(y < 0.0){
            var ratio_r = -y/this.ly;
            this.color[idSphere].x = ratio_r;
            this.color[idSphere].y = 1.0 - ratio_r;
            this.color[idSphere].z = 0.0;
        }
        else{
            var ratio_b = y/this.ly;
            this.color[idSphere].x = 0.0;
            this.color[idSphere].y = 1.0 - ratio_b;
            this.color[idSphere].z = ratio_b;
        }
    }
}

Sphere.prototype.updateColorByMapping = function()
{
    for(var idSphere = 0; idSphere < this.numSphere; idSphere++){
        var ratio = this.hash[idSphere]/parseFloat(this.numTotalBox);
        var idSphere2 = this.idOrder[idSphere];

        if(ratio < 0.5){
            var ratio2 = ratio/0.5;
            this.color[idSphere2].x = 0.0;
            this.color[idSphere2].y = ratio2;
            this.color[idSphere2].z = 1.0 - ratio2;
        }
        else{
            var ratio2 = (ratio - 0.5)/0.5;
            this.color[idSphere2].x = ratio2;
            this.color[idSphere2].y = 1.0 - ratio2;
            this.color[idSphere2].z = 0.0;
        }
    }
}

Sphere.prototype.updateColorByOrder = function()
{
    for(var idSphere = 0; idSphere < this.numSphere; idSphere++){
        var ratio = idSphere/parseFloat(this.numSphere);
        var idSphere2 = this.idOrder[idSphere];

        if(ratio < 0.5){
            var ratio2 = ratio/0.5;
            this.color[idSphere2].x = 0.0;
            this.color[idSphere2].y = ratio2;
            this.color[idSphere2].z = 1.0 - ratio2;
        }
        else{
            var ratio2 = (ratio - 0.5)/0.5;
            this.color[idSphere2].x = ratio2;
            this.color[idSphere2].y = 1.0 - ratio2;
            this.color[idSphere2].z = 0.0;
        }
    }
}
