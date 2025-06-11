import { Portal } from 'solid-js/web';

export type BackdropProps = {
  backgroundImage?: string;
};

export function Backdrop(props: BackdropProps) {
  return (
    <Portal mount={document.getElementById('backdrop')!}>
      <div
        class='fixed inset-0 bg-cover bg-center'
        style={{
          'background-image': `url(${props.backgroundImage})`,
        }}
      />
    </Portal>
  );
}
