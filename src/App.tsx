import { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { initPixiApp, destroyPixiApp } from './pixi/PixiApp';
import { GameScene } from './pixi/scenes/GameScene';
import { loadAssets } from './pixi/utils/assetLoader';
import { useResize } from './hooks/useResize';
import { useGameLoop } from './hooks/useGameLoop';
import { audioManager } from './audio/AudioManager';
import { generateReelResult } from './engine/symbolGenerator';
import { BottomBar } from './ui/BottomBar';
import { FreeSpinsOverlay } from './ui/FreeSpinsOverlay';
import { SoundToggle } from './ui/SoundToggle';
import { RulesButton } from './ui/RulesButton';
import { LoadingScreen } from './ui/LoadingScreen';
import './styles/ui.css';

function Game() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<GameScene | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let gameScene: GameScene | null = null;

    initPixiApp(containerRef.current).then(async (app) => {
      if (cancelled) return;
      await loadAssets();
      if (cancelled) return;
      // Clear any previous scene from a prior mount
      app.stage.removeChildren();
      gameScene = new GameScene(app);
      gameScene.resize(app.screen.width, app.screen.height);
      gameScene.reelsContainer.setReelResult(generateReelResult());
      setScene(gameScene);
      setLoading(false);
      audioManager.playMusic();
    });

    return () => {
      cancelled = true;
      audioManager.stopMusic();
      gameScene?.destroy();
      destroyPixiApp();
    };
  }, []);

  useResize(scene);
  useGameLoop(scene);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <LoadingScreen visible={loading} />
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />
      <div className="utility-buttons">
        <SoundToggle />
        <RulesButton />
      </div>
      <FreeSpinsOverlay />
      <BottomBar />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
}

export default App;
