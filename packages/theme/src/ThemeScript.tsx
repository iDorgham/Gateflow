import { THEME_BOOTSTRAP_SCRIPT } from './cookie';

/**
 * Render-blocking script that copies the shared GateFlow theme cookie into
 * localStorage before `next-themes` hydrates. Place in the document `<head>`
 * of every web app root layout.
 */
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
    />
  );
}
