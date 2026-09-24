const header = document.querySelector<HTMLElement>('[data-site-header]');
if (header) {
  const menu = header.querySelector<HTMLElement>('#site-navigation')!;
  const toggle = header.querySelector<HTMLButtonElement>('.site-menu-toggle')!;
  const dropdowns = [...header.querySelectorAll<HTMLDetailsElement>('.site-dropdown')];
  const mobile = matchMedia('(max-width: 1000px)');
  const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)');
  let open = false;

  function closeDropdowns(except?: HTMLDetailsElement) {
    dropdowns.forEach(dropdown => { if (dropdown !== except) dropdown.open = false; });
  }

  function setOpen(value: boolean, restoreFocus = false) {
    open = mobile.matches && value;
    if (!open) closeDropdowns();
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
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('pointerenter', () => {
      if (!mobile.matches && hoverPointer.matches) {
        closeDropdowns(dropdown);
        dropdown.open = true;
      }
    });
    dropdown.addEventListener('pointerleave', () => {
      if (!mobile.matches && hoverPointer.matches && !dropdown.contains(document.activeElement)) dropdown.open = false;
    });
    dropdown.addEventListener('toggle', () => {
      if (dropdown.open) closeDropdowns(dropdown);
    });
  });
  toggle.addEventListener('click', () => {
    setOpen(!open);
    if (open) menu.querySelector<HTMLAnchorElement>('a')?.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const expanded = dropdowns.find(dropdown => dropdown.open);
    if (expanded) {
      expanded.open = false;
      expanded.querySelector<HTMLElement>('summary')?.focus();
      event.preventDefault();
    } else if (open) {
      setOpen(false, true);
      event.preventDefault();
    }
  });
  document.addEventListener('click', event => {
    dropdowns.forEach(dropdown => { if (!dropdown.contains(event.target as Node)) dropdown.open = false; });
    if (open && !header.contains(event.target as Node)) setOpen(false);
  });
  header.addEventListener('focusout', event => {
    if (!event.relatedTarget) return;
    dropdowns.forEach(dropdown => { if (!dropdown.contains(event.relatedTarget as Node)) dropdown.open = false; });
    if (open && !header.contains(event.relatedTarget as Node)) setOpen(false);
  });
  menu.addEventListener('click', event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a');
    if (!link) return;
    closeDropdowns();
    if (!open) return;
    setOpen(false);
    const target = new URL(link.href);
    if (target.pathname === location.pathname && target.hash) {
      const section = document.getElementById(target.hash.slice(1));
      if (section) { section.setAttribute('tabindex', '-1'); section.focus({ preventScroll: true }); }
    }
  });
  mobile.addEventListener('change', () => setOpen(false));
}
