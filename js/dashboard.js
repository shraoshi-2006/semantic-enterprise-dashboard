/**
 * Apex Enterprise Cloud Console - Interactive Accessibility Controller
 * Manages WAI-ARIA states, focus trapping, table sorting, and form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const announcer = document.getElementById('a11y-announcer');
  const sidebar = document.getElementById('primary-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const themeToggle = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  const contrastToggle = document.getElementById('contrast-toggle-btn');

  // Navigation Links
  const navLinks = document.querySelectorAll('.nav-item-btn[href^="#view-"]');
  const viewSections = document.querySelectorAll('main section[id^="view-"]');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current');

  // Modal Dialog Elements
  const modal = document.getElementById('modal-provision');
  const openModalBtn = document.getElementById('open-provision-modal-btn');
  const sidebarOpenModalBtn = document.getElementById('sidebar-open-modal-btn');
  const closeModalX = document.getElementById('modal-close-x');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const quickDeployForm = document.getElementById('quick-deploy-form');
  let lastActiveElement = null;

  // Table Elements
  const selectAllCheckbox = document.getElementById('select-all-nodes');
  const rowCheckboxes = document.querySelectorAll('.row-select-checkbox');
  const sortHostnameBtn = document.getElementById('sort-hostname-btn');
  const tableSearchInput = document.getElementById('table-search-input');
  const tableStatusFilter = document.getElementById('table-filter-status');
  const tableBody = document.querySelector('#nodes-data-table tbody');

  // Form Elements
  const provisionForm = document.getElementById('cluster-provision-form');
  const errorSummary = document.getElementById('form-error-summary');
  const errorSummaryList = document.getElementById('error-summary-list');
  const switches = document.querySelectorAll('.switch-btn');

  /**
   * Helper: Dispatch screen-reader announcements via aria-live
   */
  function announce(message) {
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }
  }

  /* ==========================================================================
     1. Navigation & View Routing
     ========================================================================== */
  function switchView(targetId) {
    viewSections.forEach(section => {
      if (section.id === targetId) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === targetId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        const viewName = link.querySelector('span:last-child')?.textContent || 'Overview';
        if (breadcrumbCurrent) breadcrumbCurrent.textContent = viewName;
        announce(`Navigated to ${viewName} section.`);
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Handle hash changes or link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');
      window.location.hash = targetId;
      switchView(targetId);
      const main = document.getElementById('main');
      if (main) main.focus();
    });
  });

  // Initial view setup
  const initialHash = window.location.hash.replace('#', '') || 'view-overview';
  switchView(initialHash);

  /* ==========================================================================
     2. Sidebar Drawer Toggle
     ========================================================================== */
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      const isExpanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
      sidebarToggle.setAttribute('aria-expanded', String(!isExpanded));
      sidebar.classList.toggle('drawer-open');
      announce(!isExpanded ? 'Navigation sidebar expanded' : 'Navigation sidebar collapsed');
    });
  }

  /* ==========================================================================
     3. Theme & High-Contrast Mode Toggles
     ========================================================================== */
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);

      if (next === 'light') {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
        announce('Switched to light theme.');
      } else {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
        announce('Switched to dark theme.');
      }
    });
  }

  if (contrastToggle) {
    contrastToggle.addEventListener('click', () => {
      const isChecked = contrastToggle.getAttribute('aria-checked') === 'true';
      const next = !isChecked;
      contrastToggle.setAttribute('aria-checked', String(next));

      if (next) {
        document.documentElement.setAttribute('data-contrast', 'high');
        announce('High contrast mode enabled. Conformance: WCAG AAA 7:1.');
      } else {
        document.documentElement.removeAttribute('data-contrast');
        announce('High contrast mode disabled.');
      }
    });
  }

  /* ==========================================================================
     4. Accessible Native <dialog> Modal Controller
     ========================================================================== */
  function openModal(triggerElement) {
    lastActiveElement = triggerElement || document.activeElement;
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
      announce('Quick deploy micro-node modal dialog opened.');
      const firstInput = modal.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  }

  function closeModal() {
    if (modal && typeof modal.close === 'function') {
      modal.close();
      announce('Modal dialog closed.');
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }
  }

  if (openModalBtn) openModalBtn.addEventListener('click', () => openModal(openModalBtn));
  if (sidebarOpenModalBtn) sidebarOpenModalBtn.addEventListener('click', () => openModal(sidebarOpenModalBtn));
  if (closeModalX) closeModalX.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('cancel', () => {
      announce('Modal closed via Escape key.');
      if (lastActiveElement) lastActiveElement.focus();
    });

    // Close when clicking backdrop
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) closeModal();
    });
  }

  if (quickDeployForm) {
    quickDeployForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nodeName = document.getElementById('quick-node-name')?.value || 'node';
      announce(`Micro-node '${nodeName}' queued for deployment!`);
      closeModal();
    });
  }

  /* ==========================================================================
     5. Table Features (Select All, Sorting, Search Filtering)
     ========================================================================== */
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', () => {
      const checked = selectAllCheckbox.checked;
      rowCheckboxes.forEach(cb => cb.checked = checked);
      announce(checked ? 'All 5 table rows selected' : 'All table rows deselected');
    });
  }

  let sortAscending = true;
  if (sortHostnameBtn && tableBody) {
    sortHostnameBtn.addEventListener('click', () => {
      sortAscending = !sortAscending;
      const th = sortHostnameBtn.closest('th');
      if (th) {
        th.setAttribute('aria-sort', sortAscending ? 'ascending' : 'descending');
        const arrow = sortHostnameBtn.querySelector('span[aria-hidden="true"]');
        if (arrow) arrow.textContent = sortAscending ? '▲' : '▼';
      }

      const rows = Array.from(tableBody.querySelectorAll('tr'));
      rows.sort((a, b) => {
        const textA = a.querySelector('th[scope="row"]')?.textContent || '';
        const textB = b.querySelector('th[scope="row"]')?.textContent || '';
        return sortAscending ? textA.localeCompare(textB) : textB.localeCompare(textA);
      });

      rows.forEach(r => tableBody.appendChild(r));
      announce(`Table sorted by node identifier ${sortAscending ? 'ascending' : 'descending'}.`);
    });
  }

  function filterTable() {
    const term = (tableSearchInput?.value || '').toLowerCase().trim();
    const statusFilter = tableStatusFilter?.value || 'all';
    const rows = tableBody?.querySelectorAll('tr') || [];
    let matchCount = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const statusText = row.querySelector('.status-pill')?.textContent.toLowerCase() || '';

      const matchesTerm = !term || text.includes(term);
      let matchesStatus = true;
      if (statusFilter === 'healthy') matchesStatus = statusText.includes('healthy');
      if (statusFilter === 'warning') matchesStatus = statusText.includes('high memory') || statusText.includes('warning');
      if (statusFilter === 'maintenance') matchesStatus = statusText.includes('maintenance');

      if (matchesTerm && matchesStatus) {
        row.style.display = '';
        matchCount++;
      } else {
        row.style.display = 'none';
      }
    });

    announce(`Table filtered: ${matchCount} nodes visible.`);
  }

  if (tableSearchInput) tableSearchInput.addEventListener('input', filterTable);
  if (tableStatusFilter) tableStatusFilter.addEventListener('change', filterTable);

  /* ==========================================================================
     6. Accessible Form Validation & Custom Switches
     ========================================================================== */
  switches.forEach(btn => {
    btn.addEventListener('click', () => {
      const isChecked = btn.getAttribute('aria-checked') === 'true';
      btn.setAttribute('aria-checked', String(!isChecked));
      const label = btn.getAttribute('aria-label') || 'Policy';
      announce(`${label} set to ${!isChecked ? 'enabled' : 'disabled'}.`);
    });
  });

  if (provisionForm) {
    provisionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const errors = [];

      const nameInput = document.getElementById('cluster-name-input');
      const regionSelect = document.getElementById('cluster-region-select');
      const countInput = document.getElementById('node-count-input');

      if (!nameInput.value.trim() || nameInput.value.trim().length < 5) {
        errors.push({ id: 'cluster-name-input', message: 'Cluster Resource Name must be at least 5 alphanumeric characters.' });
      }
      if (!regionSelect.value) {
        errors.push({ id: 'cluster-region-select', message: 'Target Cloud Region must be selected.' });
      }
      const count = parseInt(countInput.value, 10);
      if (isNaN(count) || count < 3 || count > 50) {
        errors.push({ id: 'node-count-input', message: 'Node count must be an integer between 3 and 50.' });
      }

      if (errors.length > 0) {
        errorSummaryList.innerHTML = '';
        errors.forEach(err => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${err.id}`;
          a.textContent = err.message;
          a.addEventListener('click', (ev) => {
            ev.preventDefault();
            const target = document.getElementById(err.id);
            if (target) target.focus();
          });
          li.appendChild(a);
          errorSummaryList.appendChild(li);
        });

        errorSummary.style.display = 'block';
        errorSummary.focus();
        announce(`Form submission failed with ${errors.length} validation errors. Review the error summary banner.`);
      } else {
        errorSummary.style.display = 'none';
        announce(`Cluster '${nameInput.value}' successfully provisioned! Dispatching infrastructure rollout.`, 'assertive');
        alert(`Cluster '${nameInput.value}' successfully provisioned! Provisioning dispatched.`);
        provisionForm.reset();
      }
    });
  }
});
