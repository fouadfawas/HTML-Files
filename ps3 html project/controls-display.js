document.addEventListener('DOMContentLoaded', () => {
    // Update the controls help section with a compact horizontal layout
    const controlsHelp = document.querySelector('.controls-help');
    
    // Clear existing controls
    controlsHelp.innerHTML = '';
    
    // Create a single horizontal row for all controls
    const controlsRow = document.createElement('div');
    controlsRow.className = 'controls-row';
    
    // Add core navigation controls with both keyboard and controller symbols
    const navControls = document.createElement('div');
    navControls.className = 'control-group';
    navControls.innerHTML = `
        <span class="key">←↑↓→</span> Navigate
        <span class="control-separator">•</span>
        <span class="key">X</span><span class="key-alt">Enter</span> Select
        <span class="control-separator">•</span>
        <span class="key">O</span><span class="key-alt">Esc</span> Back
        <span class="control-separator">•</span>
        <span class="key">□</span><span class="key-alt">Shift</span> Options
    `;
    
    controlsRow.appendChild(navControls);
    controlsHelp.appendChild(controlsRow);
});