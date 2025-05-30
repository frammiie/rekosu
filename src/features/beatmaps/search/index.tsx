import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

export type SearchProps = {};

export function Search() {
  const [id, setId] = createSignal('');
  const navigate = useNavigate();

  return (
    <div class='flex gap-[10px] m-[20px]'>
      <input
        type='search'
        placeholder='Enter a beatmap id'
        class='p-[5px] px-[10px] rounded-full bg-[#fff1] focus:outline-none focus:outline-[#fff6] focus:-outline-offset-2 placeholder:text-[#fff6]'
        value={id()}
        onChange={e => setId(e.currentTarget.value)}
      >
        asfd
      </input>
      <button
        class='p-[5px] px-[20px] rounded-full bg-[#fff1] focus:outline-none focus:outline-[#fff6] focus:-outline-offset-2'
        onClick={() => navigate(`/beatmaps/${id()}`)}
      >
        Go
      </button>
    </div>
  );
}
