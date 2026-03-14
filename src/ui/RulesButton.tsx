import { useState } from 'react';
import { RulesModal } from './RulesModal';

export function RulesButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="rules-btn" onClick={() => setOpen(true)}>?</button>
      {open && <RulesModal onClose={() => setOpen(false)} />}
    </>
  );
}
