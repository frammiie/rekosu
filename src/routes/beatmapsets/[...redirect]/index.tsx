import { useNavigate } from '@solidjs/router';
import { onMount } from 'solid-js';

export default function Redirect() {
  const navigate = useNavigate();

  onMount(() => {
    const beatmap = window.document.location.href.match(/(\d+)$/)?.[0];

    if (beatmap) {
      navigate(`/beatmaps/${beatmap}`, { replace: true });
    }
  });

  return 'Redirecting...';
}
