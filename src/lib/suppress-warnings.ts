// Suppress hydration warnings from browser extensions
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    
    // Suppress warnings from browser extensions
    if (
      typeof message === 'string' && (
        message.includes('Extra attributes from the server: crxlauncher') ||
        message.includes('Warning: Extra attributes from the server') ||
        message.includes('crxlauncher') ||
        message.includes('chrome-extension') ||
        message.includes('moz-extension')
      )
    ) {
      return;
    }
    
    // Allow all other warnings
    originalWarn.apply(console, args);
  };
}