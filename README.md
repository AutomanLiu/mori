# Mori: Life Battery & Wishes

**Mori** is a minimalist "Life Battery" application grounded in the Stoic philosophy of *Memento Mori*. It helps users visualize their life span, track time passing, and manage their bucket list.

Now with **Multi-Profile Support**: Track the lives of your family, friends, and pets.

## Features

*   **Multi-Profile System**: 
    *   Create profiles for Humans and Pets.
    *   Separate wishlists and lifespan settings for each profile.
    *   Seamless switching with swipe gestures.
*   **Visualizations**:
    *   **Classic Battery**: The standard battery life indicator.
    *   **Weeks Grid**: A detailed view of every week lived.
    *   **Themes**: Pixel, Neon, Fluid, Trisolarans (Countdown), and more.
*   **Wishes**: A prioritized bucket list to track life goals.
*   **Stoicism**: Daily quotes and reminders of life's urgency.
*   **Localization**: Support for 11 languages (English, Chinese, Japanese, etc.).
*   **Privacy**: Local-first architecture. All data stays on the device.

## Tech Stack

*   **Framework**: React + Vite
*   **Mobile Engine**: Capacitor (iOS & Android)
*   **Styling**: TailwindCSS
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **State Management**: React Context + LocalStorage (Optimized)

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Mobile**:
    ```bash
    npm run build
    npx cap copy ios
    npx cap open ios
    ```

## License

Private Project. Copyright 2026.
