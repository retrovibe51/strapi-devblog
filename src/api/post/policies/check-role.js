'use strict';

/**
 * `check-role` policy
 */

module.exports = (policyContext, config, { strapi }) => {
  console.log("strapi",strapi)
  const { userRole } = config;
  const isEligible = policyContext.state.user && policyContext.state.user.role.name == userRole;

  console.log('role',policyContext.state.user?.role?.name); // remove
  if (isEligible) {
    return true;
  }

  return false;
};
