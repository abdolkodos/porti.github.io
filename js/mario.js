// Map modal codes to their element IDs
const MODAL_IDS = {
  "TM": "tm",
  "OMMP": "omm",
  "AFR": "afr",
  "magic": "mag"
};

function mo(modalCode) {
  const elementId = MODAL_IDS[modalCode];
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = "grid";
    } else {
      console.error(`Element with ID "${elementId}" not found`);
    }
  } else {
    console.error(`Unknown modal code: "${modalCode}"`);
  }
}

function om(modalCode) {
  const elementId = MODAL_IDS[modalCode];
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = "none";
    } else {
      console.error(`Element with ID "${elementId}" not found`);
    }
  } else {
    console.error(`Unknown modal code: "${modalCode}"`);
  }
}
/*
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all sections that should be full-width
    const fullWidthSections = document.querySelectorAll('.hero, .content, .stats-section');
    
    // Apply full-width styling to each section
    fullWidthSections.forEach(section => {
        // Set section to full viewport width
        section.style.width = '100vw';
        
        // Center the section while maintaining full width
        section.style.marginLeft = 'calc(-50vw + 50%)';
        
        // Position relative for proper alignment
        section.style.position = 'relative';
        
        // Reset left position
        section.style.left = '0';
        
        // Find all containers within these sections
        const containers = section.querySelectorAll('.container, .container1, .container2');
        
        // Adjust containers to allow full-width content
        containers.forEach(container => {
            container.style.maxWidth = '100%';
            container.style.paddingLeft = '20px';
            container.style.paddingRight = '20px';
        });
    });
    
    // Special handling for content section with two containers
    const contentSection = document.querySelector('.content');
    if (contentSection) {
        contentSection.style.display = 'flex';
        contentStyle.style.flexDirection = 'column';
        contentStyle.style.alignItems = 'center';
    }
});*/