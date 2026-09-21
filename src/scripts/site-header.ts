const header = document.querySelector<HTMLElement>('[data-site-header]');
if (header) {
  const menu = header.querySelector<HTMLElement>('#site-navigation')!;
  const toggle = header.querySelector<HTMLButtonElement>('.site-menu-toggle')!;
  const mobile = matchMedia('(max-width: 1000px)');
  let open = false;

  function setOpen(value: boolean, restoreFocus = false) {
    open = mobile.matches && value;
    header!.toggleAttribute('data-open', open);
    menu.hidden = mobile.matches && !open;
    menu.inert = mobile.matches && !open;
    toggle.hidden = !mobile.matches;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (restoreFocus && mobile.matches) toggle.focus();
  }

  header.dataset.ready = 'true';
  setOpen(false);
  toggle.addEventListener('click', () => {
    setOpen(!open);
    if (open) menu.querySelector<HTMLAnchorElement>('a')?.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) { setOpen(false, true); event.preventDefault(); }
  });
  document.addEventListener('click', event => {
    if (open && !header.contains(event.target as Node)) setOpen(false);
  });
  header.addEventListener('focusout', event => {
    if (open && event.relatedTarget && !header.contains(event.relatedTarget as Node)) setOpen(false);
  });
  menu.addEventListener('click', event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a');
    if (!link || !open) return;
    setOpen(false);
    const target = new URL(link.href);
    if (target.pathname === location.pathname && target.hash) {
      const section = document.getElementById(target.hash.slice(1));
      if (section) { section.setAttribute('tabindex', '-1'); section.focus({ preventScroll: true }); }
    }
  });
  mobile.addEventListener('change', () => setOpen(false));
}
