/** Generate a random string, e.g. for use in a containerId. */
export function createId(): string {
  // see https://stackoverflow.com/questions/56574593/access-firestore-id-generator-on-the-front-end?noredirect=1&lq=1
  // see https://github.com/firebase/firebase-js-sdk/blob/73a586c92afe3f39a844b2be86086fddb6877bb7/packages/firestore/src/util/misc.ts#L36
  // Alphanumeric characters
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId;
}
