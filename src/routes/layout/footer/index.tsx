import { Link } from '~/features/ui/link';

export function Footer() {
  return (
    <footer class='mt-[20px] w-full max-w-[1000px]  bg-[#fff1] p-[20px] text-xs text-[#fff6] flex flex-col gap-[10px]'>
      <div class='text-center'>
        Made with ❤︎ by{' '}
        <Link href='https://huggingface.co/frammie'>@frammie</Link>
      </div>
      <div>With help from:</div>
      <ul class='flex flex-col gap-[5px]'>
        <li>
          <Link href='https://www.answer.ai/'>Answer.AI</Link> for{' '}
          <Link href='https://github.com/AnswerDotAI/ModernBERT'>
            ModernBERT
          </Link>
        </li>
        <li>
          <Link href='https://github.com/UKPLab'>UKPLab</Link> for{' '}
          <Link href='https://github.com/UKPLab/sentence-transformers'>
            Sentence Transformers
          </Link>
        </li>
        <li>
          <Link href='https://github.com/TTTaevas'>@TTTaevas</Link> for{' '}
          <Link href='https://github.com/TTTaevas/osu-api-v2-js'>
            osu-api-v2
          </Link>
        </li>
        <li>
          <Link href='https://ppy.sh/'>@ppy</Link> and contributors for{' '}
          <Link href='https://osu.ppy.sh/docs/index.html'>osu!api v2</Link>
        </li>
        <li>
          <Link href='https://x.com/RyanCarniato'>Ryan Carniato</Link> and
          contributors for <Link href='https://docs.solidjs.com/'>SolidJS</Link>{' '}
          & <Link href='https://docs.solidjs.com/solid-start'>SolidStart</Link>
        </li>
        <li>
          <Link href='https://authjs.dev/contributors'>
            AuthJS contributors
          </Link>{' '}
          for <Link href='https://authjs.dev/'>Auth.js</Link>
        </li>
        <li>
          <Link href='https://github.com/OrJDev'>ORJDev</Link> and contributors
          for{' '}
          <Link href='https://github.com/solidjs-community/mediakit'>
            mediakit
          </Link>
        </li>
        <li>
          <Link href='https://github.com/Osekai/osekai'>Osekai</Link> for
          gamemode icons
        </li>
      </ul>
      <div>And many more awesome folks!</div>
    </footer>
  );
}
