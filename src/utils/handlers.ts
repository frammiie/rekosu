export async function circuit<TResult>(promises: (() => Promise<TResult>)[]) {
  for (const promise of promises) {
    try {
      const result = await promise();

      if (result != null) return result;
    } catch (error) {
      console.error(error);
    }
  }

  return null;
}
