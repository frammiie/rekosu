export function Throbber() {
  return (
    <div class='w-full h-full flex items-center justify-center self-center my-auto'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        class='size-32 motion-safe:animate-tap text-[#fff6]'
      >
        <path
          fill='currentColor'
          d='M12 15.75a3.75 3.75 0 1 1 0-7.5a3.75 3.75 0 0 1 0 7.5'
        />
        <path
          fill='currentColor'
          d='M12 4.25a7.75 7.75 0 1 0 0 15.5a7.75 7.75 0 0 0 0-15.5M5.75 12a6.25 6.25 0 1 1 12.5 0a6.25 6.25 0 0 1-12.5 0'
        />
      </svg>
    </div>
  );
}
