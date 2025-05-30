export async function circuit<TResult>(promises: (() => Promise<TResult>)[]) {
  for (const promise of promises) {
    const result = await promise();

    if (result != null) return result;
  }

  return null;
}
