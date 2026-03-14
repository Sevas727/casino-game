import { Application } from 'pixi.js';

let app: Application | null = null;
let initPromise: Promise<Application> | null = null;

export async function initPixiApp(container: HTMLElement): Promise<Application> {
  // If already initializing or initialized, wait for it and reattach
  if (initPromise) {
    const existing = await initPromise;
    if (existing.canvas.parentElement !== container) {
      container.appendChild(existing.canvas);
    }
    existing.resizeTo = container;
    return existing;
  }

  app = new Application();
  initPromise = app.init({
    background: '#1a0a2e',
    resizeTo: container,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  }).then(() => {
    container.appendChild(app!.canvas);
    return app!;
  });

  return initPromise;
}

export function getPixiApp(): Application | null { return app; }

export function destroyPixiApp(): void {
  if (app) {
    // Only detach canvas — don't destroy the app.
    // PixiJS destroy() wipes GPU textures and the Assets cache,
    // making re-init after React StrictMode remount impossible.
    app.canvas.remove();
  }
}
