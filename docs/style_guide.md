# ThinkAlike Style Guide

This document outlines the visual style and branding guidelines for the ThinkAlike platform. We aim for a "Zenith of Excellence" aesthetic: clean, modern, professional, high-tech, and futuristic, while conveying trust, transparency, and ethical excellence.

## Color Palette

| Color                       | HEX Code    | Usage                                                                                                                               |
|----------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------|
| **Primary Colors:**        |             |                                                                                                                                     |
| Amber/Honey Yellow (Neutral) | `#FFC300`  | AI indicator (idle state), base color for some UI elements, subtle highlights.                                                      |
| Deep Orange (Active)       | `#FF5733`   | AI indicator (active/processing state), data visualization, progress indicators.                                                    |
| Neon Orange (Highlight)    | `#FF8C00`   | Calls to action, important notifications, errors, interactive elements. Use sparingly.                                              |
| Deep Ruby (Connection)     | `#800000`   | Indicates a successful, real-world connection established between users.                                                            |
| Ruby Highlight (Optional)  | `#e60000`   | *Use very sparingly*. For visual highlights *only* (not for text).                                                                  |
| Ruby Shadow                | `#3f0000`   | Optional, for subtle gradients and outlines.                                                                                       |
| **Secondary Colors:**      |             |                                                                                                                                     |
| Dark Blue (Waveform)       | `#001F3F`   | Sinusoidal waveform on the AI indicator, subtle UI accents.                                                                        |
| **Neutral Colors:**        |             |                                                                                                                                     |
| Black (Background)         | `#000000`   | Main background color.                                                                                                             |
| Dark Gray (Text)           | `#333333`   | Body text.                                                                                                                         |
| Medium Gray (UI Elements)  | `#666666`   | UI elements, separators, less prominent text.                                                                                      |
| Light Gray (Subtle)        | `#CCCCCC`   | Subtle backgrounds, hover states, inactive elements.                                                                               |
| White (Text/Highlights)    | `#FFFFFF`   | High-contrast text, highlights against dark backgrounds.                                                                           |

## Typography

* **Primary Font:** [Montserrat](https://fonts.google.com/specimen/Montserrat) (Google Fonts) - Used for headings and prominent text. Weights: 400 (Regular), 700 (Bold).  
* **Secondary Font:** [Questrial](https://fonts.google.com/specimen/Questrial) (Google Fonts) - Used for body text and less prominent UI elements. Weight: 400 (Regular).

**Implementation (HTML - in `frontend/public/index.html`):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Questrial&display=swap" rel="stylesheet">
```

**Implementation (CSS - in `frontend/src/App.css`):**

```css
body {
  font-family: 'Questrial', sans-serif;
}

h1, h2, h3 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}
```

## Imagery

- Use authentic, diverse, and high-quality images that reflect real human connections.  
- Avoid generic stock photography.  
- Images should be optimistic, empowering, and aligned with the project's core values.  
- All images must include detailed alt descriptions.

## UI Components

- **Nodes Map:** UI elements should be visually represented as interconnected nodes, with lines indicating relationships and data flow. (See example images in `docs/assets/images/` — add proper paths after uploading the images.)
  - **Colors:** Nodes and data connections should use the core color palette defined above.

- **AI Agent Indicator:** A circular shape with a dynamic, multi-hued orange/red light at its center against a black background.
  - **Pulsating Light:** The central light pulsates with a period of 1.5 seconds (adjustable), smoothly transitioning between `#FFC300` (brighter yellow-orange) and `#FF5733` (deeper orange). The intensity change should follow an ease-in-out timing function.
  - **Sinusoidal Waveform:** A sinusoidal waveform with a wavelength of 20 pixels (adjustable) and an amplitude of 5 pixels (adjustable) travels across the circle from left to right over a duration of 1 second (adjustable). The waveform color is `#001F3F` (dark blue).
  - **Triangle Indicator:** A subtle, triangle shape using color `#800000`. The triangle should be within the circle, and should become clearly visible (increasing in opacity or brightness) when a direct, real-world connection is established between two users. The change must be smooth.

### Animation Parameters

- **Pulsating Light**  
  - period: 1.5s (adjustable)  
  - colorStart: `#FFC300`  
  - colorEnd: `#FF5733`  
  - easing: ease-in-out

- **Sinusoidal Waveform**  
  - wavelength: 20px (adjustable)  
  - amplitude: 5px (adjustable)  
  - duration: 1s (adjustable)  
  - color: `#001F3F`

- **Triangle Indicator**  
  - color: `#800000`  
  - animation: smooth transition

## Data Table

(See example image in `docs/assets/images/` — add the correct relative path after uploading the image.) Key features include:
- Clear column headers.
- Alternating row colors (light gray and a slightly darker shade).
- Sufficient spacing between rows and columns.
- Use Questrial font for body text and Montserrat for headers.

## Inspiration

(Provide links to websites, apps, or images that exemplify the desired visual style as needed.)
