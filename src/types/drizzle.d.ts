declare module "@next/env" {
  /**
   * Loads environment variables from `.env` files in the specified directory.
   * By default, it loads `.env`, `.env.local`, `.env.production`, `.env.development` 
   * depending on the active environment.
   */
  export function loadEnvConfig(
    dir: string,
    dev?: boolean,
    logger?: {
      info: (...args: any[]) => void;
      error: (...args: any[]) => void;
    }
  ): {
    combinedEnv: Record<string, string>;
    loadedEnvFiles: Array<{ path: string; contents: string }>;
  };
}

