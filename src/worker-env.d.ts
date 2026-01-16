declare module "__STATIC_CONTENT_MANIFEST" {
  const manifest: string;
  export default manifest;
}

interface Env {
  __STATIC_CONTENT: KVNamespace;
  DB: D1Database;
}
