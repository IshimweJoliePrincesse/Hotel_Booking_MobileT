// ESM loader hook to convert Windows paths to file:// URLs
import { pathToFileURL } from 'url';

export async function resolve(specifier, context, nextResolve) {
  // If it's an absolute Windows path (C:\...), convert to file:// URL
  if (typeof specifier === 'string' && /^[a-zA-Z]:[\\\/]/.test(specifier)) {
    specifier = pathToFileURL(specifier).href;
  }
  
  return nextResolve(specifier, context);
}
