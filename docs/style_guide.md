# ThinkAlike Style Guide

This document outlines the visual style and branding guidelines for the ThinkAlike platform. We aim for a "Zenith of Excellence" aesthetic: clean, modern, professional, high-tech, and futuristic, while conveying trust, transparency, and ethical excellence.

## Color Palette

| Color                       | HEX Code    | Usage                                                                                                                               |
|------------------------------|-------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Primary Colors:**           |             |                                                                                                                                    |
| Amber/Honey Yellow (Neutral) | `#FFC300`     | AI indicator (idle state), base color for some UI elements, subtle highlights.                                                    |
| Deep Orange (Active)         | `#FF5733`     | AI indicator (active/processing state), data visualization, progress indicators.                                                |
| Neon Orange (Highlight)     | `#FF8C00`     | Calls to action, important notifications, errors, interactive elements. Use sparingly.                                          |
| Deep Ruby (Connection)       | `#800000`     | Indicates a successful, real-world connection established between users.                                                          |
| Ruby Highlight (Optional)   | `#e60000`    | *Use very sparingly*. For visual highlights *only* (not for text).                                                                 |
| Ruby Shadow                 |  `#3f0000`     | Optional, for subtle gradients and outlines.                                                                              |
| **Secondary Colors:**        |             |                                                                                                                                    |
| Dark Blue (Waveform/Accents)| `#001F3F`     | Sinusoidal waveform on the AI indicator, subtle UI accents.                                                                       |
| Electric Blue (Accent)      | `#00FFFF`     |  **Use sparingly.** Highlights, AI communication/information, specific data types, hover/active states, loading indicators. *Never for body text.* |
| **Neutral Colors:**          |             |                                                                                                                                    |
| Black (Background)          | `#000000`     | Main background color.                                                                                                           |
| Dark Gray (Text)            | `#333333`     | Body text.                                                                                                                      |
| Medium Gray (UI Elements)   | `#666666`     | UI elements, separators, less prominent text.                                                                                    |
| Light Gray (Subtle)         | `#CCCCCC`     | Subtle backgrounds, hover states, inactive elements.                                                                              |
| White (Text/Highlights)     | `#FFFFFF`     | High-contrast text, highlights against dark backgrounds.                                                                           |

## Typography

*   **Primary Font:** [Montserrat](https://fonts.google.com/specimen/Montserrat) (Google Fonts) - Used for headings and prominent text. Weights: 400 (Regular), 700 (Bold).
*   **Secondary Font:** [Questrial](https://fonts.google.com/specimen/Questrial) (Google Fonts) - Used for body text and less prominent UI elements. Weight: 400 (Regular).

**Implementation (HTML - in `frontend/public/index.html`):**

```html
<link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
<link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
<link href="[https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Questrial&display=swap](https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Questrial&display=swap)" rel="stylesheet">
