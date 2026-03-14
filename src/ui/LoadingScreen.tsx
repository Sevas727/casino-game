interface Props { visible: boolean; }

export function LoadingScreen({ visible }: Props) {
  if (!visible) return null;
  return (
    <div className="loading-screen">
      <div className="loading-title">Adventure Fortune</div>
      <div className="loading-bar-container">
        <div className="loading-bar" />
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
}
