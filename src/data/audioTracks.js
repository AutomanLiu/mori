export const AUDIO_TRACKS = [
    {
        id: 'none',
        name: 'None',
        type: 'basic',
        free: true,
        src: null
    },
    {
        id: 'rain',
        name: 'Rainy Window',
        type: 'nature',
        free: true,
        src: '/audio/rain.wav'
    },
    {
        id: 'white_noise',
        name: 'White Noise',
        type: 'focus',
        free: true,
        src: '/audio/white_noise.wav'
    },
    {
        id: 'clock',
        name: 'Ticking Clock',
        type: 'focus',
        free: false, // Pro
        src: '/audio/clock.wav'
    },
    {
        id: 'piano',
        name: 'Melancholic Piano',
        type: 'emotional',
        free: false, // Pro
        src: '/audio/piano.wav'
    },
    {
        id: 'space',
        name: 'Deep Space',
        type: 'theme',
        free: false, // Pro
        src: '/audio/space.wav'
    }
];
