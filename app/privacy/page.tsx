export default function Privacy() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Privacy & Data Usage</h1>
      <p>JARVIS prioritizes your privacy. By default, your interactions and preferences are stored locally on your device and can be cleared at any time. If you configure cloud AI providers, requests are sent through JARVIS API routes only for processing and are not persisted server-side.</p>
      <h2>Encryption</h2>
      <p>Local data can be encrypted with your passphrase using modern Web Crypto (AES-GCM with PBKDF2). Keep your passphrase safe?without it, your encrypted data cannot be recovered.</p>
      <h2>Transparency</h2>
      <ul>
        <li>Local storage: interactions, preferences, installed skills</li>
        <li>Optional cloud calls: NLP queries if an API key is configured</li>
        <li>No third-party trackers or analytics</li>
      </ul>
      <h2>Accessibility</h2>
      <p>This app supports keyboard navigation, screen readers, and adjustable font sizes.</p>
    </div>
  )
}
