import { Search } from '~/features/beatmaps/search';
import { SectionHeader } from '~/features/ui/section-header';

export default function Home() {
  return (
    <main class='bg-[#fff1] min-h-[500px] flex flex-col'>
      <SectionHeader>Home</SectionHeader>
      <SectionHeader variant='secondary'>Search beatmap</SectionHeader>
      <Search />
    </main>
  );
}
