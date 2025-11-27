import { useEffect } from "react";

/**
 * ContentProtection Component
 * Protects images and videos from:
 * - Right-click / context menu
 * - Drag and drop
 * - Copy/save operations
 */
export default function ContentProtection() {
  useEffect(() => {
    // Prevent right-click on images and videos
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "IMG" ||
        target.tagName === "VIDEO" ||
        target.tagName === "IFRAME" ||
        target.closest("img") ||
        target.closest("video") ||
        target.closest("iframe")
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent drag start on images and videos
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "IMG" ||
        target.tagName === "VIDEO" ||
        target.tagName === "IFRAME"
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent selection on images and videos
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "IMG" ||
        target.tagName === "VIDEO" ||
        target.tagName === "IFRAME"
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent keyboard shortcuts for saving/copying (only when media is focused)
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement;
      const isMediaFocused = 
        activeElement?.tagName === "IMG" ||
        activeElement?.tagName === "VIDEO" ||
        activeElement?.tagName === "IFRAME";
      
      if (!isMediaFocused) return;
      
      // Ctrl/Cmd + S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("keydown", handleKeyDown);

    // Add CSS styles to prevent user selection and dragging
    const style = document.createElement("style");
    style.innerHTML = `
      img, video, iframe {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: auto !important;
      }
      
      /* Prevent long-press context menu on mobile */
      img, video, iframe {
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("keydown", handleKeyDown);
      document.head.removeChild(style);
    };
  }, []);

  return null; // This component doesn't render anything
}
