import type { Metadata } from 'next';

type Title = NonNullable<Metadata['title']>;

/**
 * Use for pages that should inherit the locale layout template (`%s | GateFlow`).
 */
export function templatedMarketingTitle(title: string): Title {
  return title;
}

/**
 * Use for pages that must bypass the locale layout template.
 */
export function absoluteMarketingTitle(title: string): Title {
  return { absolute: title };
}
