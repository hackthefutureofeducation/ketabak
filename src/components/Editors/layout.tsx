import { Editors } from "./editors";

export function EditorLayout() {
  return (
    <section className='w-full grid grid-cols-[250px_1fr]'>
      <div></div>
      <Editors/>
    </section>
  );
}
