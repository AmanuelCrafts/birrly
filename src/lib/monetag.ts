/**
 * Monetag SDK wrapper for Birrly rewarded interstitial ads.
 *
 * SECURITY NOTE:
 * The client-side `show_11920150()` promise resolving does NOT prove
 * a billable or valid impression. This is only a client-side callback.
 * A verified Monetag server-side callback/postback should be added
 * if Monetag provides one for this format.
 */

declare global {
  interface Window {
    show_11920150?: () => Promise<void>;
  }
}

let sdkLoaded = false;
let sdkLoading: Promise<void> | null = null;

/**
 * Load the Monetag SDK script (client-side only).
 * Safe to call multiple times — only loads once.
 */
export function loadMonetagSDK(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Monetag SDK can only load in the browser"));
  }

  if (sdkLoaded) return Promise.resolve();
  if (sdkLoading) return sdkLoading;

  sdkLoading = new Promise((resolve, reject) => {
    if (window.show_11920150) {
      sdkLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://libtl.com/sdk.js";
    script.setAttribute("data-zone", "11920150");
    script.setAttribute("data-sdk", "show_11920150");
    script.async = true;

    script.onload = () => {
      // Wait for the SDK to initialize
      const checkInterval = setInterval(() => {
        if (window.show_11920150) {
          clearInterval(checkInterval);
          sdkLoaded = true;
          resolve();
        }
      }, 50);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("Monetag SDK failed to load within 10 seconds"));
      }, 10000);
    };

    script.onerror = () => {
      reject(new Error("Failed to load Monetag SDK script"));
    };

    document.head.appendChild(script);
  });

  return sdkLoading;
}

/**
 * Show the Monetag rewarded interstitial ad.
 * Returns a promise that resolves when the ad is completed.
 *
 * NOTE: This is a client-side callback only. It does NOT prove
 * a billable impression. Server-side verification should be added
 * if Monetag provides a postback/callback URL.
 */
export async function showRewardedAd(): Promise<void> {
  await loadMonetagSDK();

  if (!window.show_11920150) {
    throw new Error("Monetag SDK not available");
  }

  return window.show_11920150();
}

/**
 * Check if the Monetag SDK is loaded and ready.
 */
export function isMonetagReady(): boolean {
  return sdkLoaded && !!window.show_11920150;
}
