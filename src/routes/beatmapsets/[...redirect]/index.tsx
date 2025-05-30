import { useNavigate } from '@solidjs/router';
import { onMount } from 'solid-js';
import { SectionHeader } from '~/features/ui/section-header';

export default function Redirect() {
  const navigate = useNavigate();

  onMount(() => {
    const beatmap = window.document.location.href.match(/(\d+)$/)?.[0];

    if (beatmap) {
      navigate(`/beatmaps/${beatmap}`, { replace: true });
    }
  });

  return (
    <main class='bg-[#fff1] min-h-[500px] flex flex-col'>
      <SectionHeader>Redirect...</SectionHeader>
      <SectionHeader variant='secondary'>Beatmap</SectionHeader>
      <div class=' px-[40px] py-[20px] text-[#fff6]'>
        Redirecting... If you aren't redirected, please ensure the URL contains
        a beatmap id.
      </div>
    </main>
  );
}
