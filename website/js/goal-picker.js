/** Shared practical goal chip picker for enquiry forms */
document.addEventListener('DOMContentLoaded', () => {
  initGoalPicker('goalChipGrid', 'travelGoal');
  initGoalPicker('ausGoalChipGrid', 'ausGoalInput');
});

function initGoalPicker(gridId, inputId) {
  const grid = document.getElementById(gridId);
  const input = document.getElementById(inputId);
  if (!grid || !input || typeof ENROL_GOALS === 'undefined') return;

  grid.innerHTML = ENROL_GOALS.map(g => `
    <button type="button" class="goal-chip-btn" data-value="${g.value}" role="radio" aria-checked="false">
      <span class="goal-chip-icon" aria-hidden="true">${g.icon}</span>
      <span class="goal-chip-text">
        <strong>${g.label}</strong>
        <small>${g.hint}</small>
      </span>
    </button>
  `).join('');

  grid.querySelectorAll('.goal-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.goal-chip-btn').forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
      input.value = btn.dataset.value;
    });
  });
}
