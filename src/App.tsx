import { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { initPixiApp, destroyPixiApp } from './pixi/PixiApp';
import { GameScene } from './pixi/scenes/GameScene';
import { useResize } from './hooks/useResize';

function Game() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<GameScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let gameScene: GameScene;

    initPixiApp(containerRef.current).then(app => {
      gameScene = new GameScene(app);
      gameScene.resize(app.screen.width, app.screen.height);
      setScene(gameScene);
    });

    return () => {
      gameScene?.destroy();
      destroyPixiApp();
    };
  }, []);

  useResize(scene);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />
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
