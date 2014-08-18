
// basic conditions
const NUM_SPHERE = 10000;

// physical constants
const G   = 9.8;    // gravitational acceleration
const RHO = 1.0;    // density 

// constants for domain size
const LX                =  220.0;
const LY                =  150.0;
const LZ                =    5.0;
const PARTICLE_RANGE_X  =  150.0; 
const PARTICLE_RANGE_Y  =  150.0; 
const PARTICLE_RANGE_Z  =    0.0; 
const PARTICLE_OFFSET_X =  -70.0;
const PARTICLE_OFFSET_Y =    0.0;
const PARTICLE_OFFSET_Z =    0.0;

// constants for mapping
const BOXSIZE = 2.0;

// constants for particle interactions
const K_N   = 1000.0;
const ETA_N = 10.00;

// constants for wall
const EPSILON = 0.10;   // reflection coefficient     

// constants for simulations
const DT = 0.04;
