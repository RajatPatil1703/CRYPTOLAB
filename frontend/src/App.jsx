import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import CaesarCipher from './pages/algorithms/CaesarCipher.jsx'
import MatrixCipher from './pages/algorithms/MatrixCipher.jsx'
import SequenceCipher from './pages/algorithms/SequenceCipher.jsx'
import MonoalphabeticCipher from './pages/algorithms/MonoalphabeticCipher.jsx' // <-- Add this import
import PlayfairCipher from './pages/algorithms/PlayfairCipher.jsx'
import HillCipher from './pages/algorithms/HillCipher.jsx'
import TranspositionCipher from './pages/algorithms/TranspositionCipher.jsx'
import RC4Cipher from './pages/algorithms/RC4Cipher.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        
        {/* Specific Algorithm Routes */}
        <Route path="algorithms/caesar" element={<CaesarCipher />} />
        <Route path="algorithms/playfair" element={<MatrixCipher key="playfair" cipher="playfair" />} />
        <Route path="algorithms/hill" element={<MatrixCipher key="hill" cipher="hill" />} />
        <Route path="algorithms/transposition" element={<SequenceCipher key="transposition" cipher="transposition" />} />
        <Route path="algorithms/rc4" element={<SequenceCipher key="rc4" cipher="rc4" />} />
        <Route path="algorithms/monoalphabetic" element={<MonoalphabeticCipher />} /> {/* <-- Add this route */}
        <Route path="algorithms/playfair" element={<PlayfairCipher />} />
        <Route path="algorithms/hill" element={<HillCipher />} />
        <Route path="algorithms/transposition" element={<TranspositionCipher />} />
        <Route path="algorithms/rc4" element={<RC4Cipher />} />
        
        {/* Generic fallback for algorithms not yet implemented */}
        <Route path="algorithms/:slug" element={<ComingSoon title="Algorithm page" note="The two-panel algorithm page arrives in Phase 3." />} />
        
        <Route path="theory-notes" element={<ComingSoon title="Theory notes" />} />
        <Route path="practice" element={<ComingSoon title="Practice sets" />} />
        <Route path="references" element={<ComingSoon title="References" />} />
        <Route path="about" element={<ComingSoon title="About CryptoLab" />} />
        <Route path="*" element={<ComingSoon title="Page not found" note="Check the address or go back to the dashboard." />} />
      </Route>
    </Routes>
  )
}
