
// basic conditions
const NUM_SPHERE = 300;

// physical constants
const G   = 9.8;    // gravitational acceleration
const RHO = 1.0;    // density 

// constants for domain size
var LX                =  80.0;	// x = [-LX:LX]に分布する
var LY                =  60.0;
var LZ                =    5.0;
var PARTICLE_RANGE_X  =  50.0; 
var PARTICLE_RANGE_Y  =  50.0; 
var PARTICLE_RANGE_Z  =    0.0; 
const PARTICLE_OFFSET_X =    0.0;
const PARTICLE_OFFSET_Y =    0.0;
const PARTICLE_OFFSET_Z =    0.0;
const scale=20;		// 描画をscale倍スケールで行う canvas.width=scale*2*LXとなるようにする

// constants for mapping
const BOXSIZE = 2.0;

// constants for particle interactions
const K_N   = 1000.0;
const ETA_N = 10.00;

// constants for wall
const EPSILON = 0.10;   // reflection coefficient     

// constants for simulations
const DT = 0.04;

var colorArray = ['blue','darkslateblue','mediumslateblue','darkblue','darkcyan'];