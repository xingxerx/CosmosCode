/**
 * Implements various cosmological models
 */

const COSMOLOGICAL_CONSTANT = 2.036e-35; // s^-2

/**
 * Calculates the Hubble parameter at a given redshift
 * @param {number} redshift - The redshift z
 * @param {Object} cosmology - Cosmological parameters
 * @returns {number} - Hubble parameter in km/s/Mpc
 */
function hubbleParameter(redshift, cosmology) {
  const { H0, omegaM, omegaLambda } = cosmology;
  const omegaK = 1 - omegaM - omegaLambda;
  
  return H0 * Math.sqrt(
    omegaM * Math.pow(1 + redshift, 3) + 
    omegaK * Math.pow(1 + redshift, 2) + 
    omegaLambda
  );
}

module.exports = {
  hubbleParameter,
  // Add more cosmological models
};