import en from '@gate-access/i18n/src/locales/en.json';

type Dictionary = typeof en;
type Namespace = keyof Dictionary;

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]:
  TObj[TKey] extends any[] ? `${TKey}` :
  TObj[TKey] extends object
  ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
  : `${TKey}`;
}[keyof TObj & (string | number)];

function t<N extends Namespace>(namespace: N, key: RecursiveKeyOf<Dictionary[N]>) {
  console.log(namespace, key);
}

// Test with valid keys
t('admin', 'sidebar.overview'); // Assuming 'admin.sidebar.overview' exists? No, wait.
// Let's check 'admin' keys.
