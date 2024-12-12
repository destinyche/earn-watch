export const theme = {
  colors: {
    // Main brand colors
    primary: '#7C3AED', // Vibrant purple
    secondary: '#EC4899', // Hot pink
    accent: '#3B82F6', // Bright blue
    
    // UI colors
    background: '#F8FAFC', // Light gray background
    foreground: '#1E293B', // Dark slate text
    muted: '#64748B', // Muted text
    
    // Status colors
    success: '#10B981', // Emerald green
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red
    
    // Additional colors
    tertiary: '#06B6D4', // Cyan
    highlight: '#8B5CF6', // Purple
  },
  gradients: {
    // Modern gradients
    primary: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', // Purple to Pink
    secondary: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)', // Blue to Cyan
    accent: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)', // Purple to Blue
    
    // Additional gradients
    success: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)', // Green to Cyan
    warning: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)', // Amber to Pink
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }
}

// Add CSS variables to be used in tailwind.config.js
export const cssVariables = {
  '--primary': theme.colors.primary,
  '--secondary': theme.colors.secondary,
  '--accent': theme.colors.accent,
  '--background': theme.colors.background,
  '--foreground': theme.colors.foreground,
  '--muted': theme.colors.muted,
  '--success': theme.colors.success,
  '--warning': theme.colors.warning,
  '--error': theme.colors.error,
} 