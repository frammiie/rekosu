import { usePageVisibility } from '@solid-primitives/page-visibility';
import { useSearchParams } from '@solidjs/router';
import { createEffect, createSignal, untrack } from 'solid-js';
import z from 'zod';
import { SectionHeader } from '~/features/ui/section-header';
import type { RekosuUser } from '~/server/data';
import { Filter } from './filter';
import { Items } from './items';

const filterSchema = z.object({
  type: z
    .union([z.literal('recent'), z.literal('best'), z.literal('firsts')])
    .optional(),
  mode: z
    .union([
      z.literal('osu'),
      z.literal('taiko'),
      z.literal('fruits'),
      z.literal('mania'),
    ])
    .optional(),
});

export type Filter = Required<z.infer<typeof filterSchema>> & {
  userId: number;
  lastRefresh: number;
};

function getFilterDefaults(user: RekosuUser, searchParams: unknown): Filter {
  const initialSearchFilter = filterSchema.safeParse(searchParams);

  return {
    userId: user.id,
    type: initialSearchFilter.data?.type ?? 'recent',
    mode: initialSearchFilter.data?.mode ?? user.playmode,
    lastRefresh: Date.now(),
  };
}

export type ListProps = {
  user: RekosuUser;
};

export function List(props: ListProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = createSignal<Filter>(
    // eslint-disable-next-line solid/reactivity
    getFilterDefaults(props.user, searchParams)
  );

  createEffect((prev?: RekosuUser) => {
    if (prev?.id == props.user.id) return;

    setFilter(getFilterDefaults(props.user, searchParams));

    return props.user;
  });

  createEffect(() => {
    setSearchParams({
      type: filter().type,
      mode: filter().mode,
    });
  });

  createEffect(() => {
    if (!Object.keys(searchParams).length) return;

    const queryFilter = filterSchema.safeParse(searchParams);
    if (!queryFilter.data) return;

    setFilter(filter => ({
      ...filter,
      type: queryFilter.data.type ?? filter.type,
      mode: queryFilter.data.mode ?? filter.mode,
    }));
  });

  function handleTypeChange(type: Filter['type']) {
    setFilter(filter => ({ ...filter, type }));
  }

  function handleModeChange(mode: Filter['mode']) {
    setFilter(filter => ({ ...filter, mode }));
  }

  function handleRefresh() {
    setFilter(filter => ({
      ...filter,
      lastRefresh: Date.now(),
    }));
  }

  const visible = usePageVisibility();

  createEffect(() => {
    if (!visible()) return;

    const _filter = untrack(filter);
    if (_filter.type !== 'recent') return;
    if (Date.now() - _filter.lastRefresh < 10_000) return;

    handleRefresh();
  });

  return (
    <>
      <SectionHeader variant='secondary'>Score Recommendations</SectionHeader>
      <Filter
        filter={filter}
        onTypeChange={handleTypeChange}
        onModeChange={handleModeChange}
        onRefresh={handleRefresh}
      />
      <Items user={props.user} filter={filter} />
    </>
  );
}
