/* -------------------------------------------------------------------------- */
/*                                    Toast                                   */
/* -------------------------------------------------------------------------- */

const sortableInit = () => {
  const sortableEl = document.querySelectorAll('[data-sortable]');
  const kanbanContainer = document.querySelector('[data-kanban-container]');
  if (kanbanContainer) {
    kanbanContainer.addEventListener('click', e => {
      if (e.target.hasAttribute('data-kanban-collapse')) {
        e.target.closest('.kanban-column').classList.toggle('collapsed');
      }
    });
  }

  sortableEl.forEach(el => {
    return window.Sortable.create(el, {
      animation: 150,
      group: {
        name: 'shared',
      },
      delay: 100,
      delayOnTouchOnly: true,
      forceFallback: true,
      onStart() {
        window.Sortable.ghost.style.opacity = 1;
        document.body.classList.add('sortable-dragging');
      },
      onEnd() {
        document.body.classList.remove('sortable-dragging');
      },
    });
  });
};

export default sortableInit;
