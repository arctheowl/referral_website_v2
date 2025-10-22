// Environment configuration
export const config = {
  // Environment mode: 'development' | 'testing' | 'production'
  mode: (process.env.NODE_ENV || process.env.NEXT_PUBLIC_NODE_ENV) === 'production' ? 'production' : 
        (process.env.TESTING_MODE || process.env.NEXT_PUBLIC_TESTING_MODE) === 'true' ? 'testing' : 'development',
  
  // Testing mode settings
  testing: {
    // Allow direct access to all pages
    allowDirectPageAccess: true,
    // Show debug information
    showDebugInfo: true,
    // Allow bypassing user flow
    bypassUserFlow: true,
    // Show all navigation options
    showAllNavigation: true
  },
  
  // Production mode settings
  production: {
    // Enforce correct user flow
    enforceUserFlow: true,
    // Hide debug information
    showDebugInfo: false,
    // Require proper session validation
    requireSessionValidation: true,
    // Hide testing navigation
    showAllNavigation: false
  },
  
  // Development mode settings
  development: {
    // Allow some flexibility but with warnings
    allowDirectPageAccess: true,
    showDebugInfo: true,
    enforceUserFlow: false,
    showAllNavigation: true
  }
};

// Helper functions
export const isTestingMode = () => config.mode === 'testing';
export const isProductionMode = () => config.mode === 'production';
export const isDevelopmentMode = () => config.mode === 'development';

export const getCurrentConfig = () => {
  switch (config.mode) {
    case 'testing':
      return config.testing;
    case 'production':
      return config.production;
    case 'development':
    default:
      return config.development;
  }
};

export const canAccessPageDirectly = (page: string) => {
  const currentConfig = getCurrentConfig();
  return currentConfig.allowDirectPageAccess || !currentConfig.enforceUserFlow;
};

export const shouldShowDebugInfo = () => {
  const currentConfig = getCurrentConfig();
  return currentConfig.showDebugInfo;
};

export const shouldShowAllNavigation = () => {
  const currentConfig = getCurrentConfig();
  return currentConfig.showAllNavigation;
};
