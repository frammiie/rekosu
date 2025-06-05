export async function circuit<TResult>(promises: (() => Promise<TResult>)[]) {
  for (const promise of promises) {
    try {
      const result = await promise();

      if (result != null) return result;
    } catch (e) {
      console.error(e);

      return null;
    }
  }

  return null;
}
