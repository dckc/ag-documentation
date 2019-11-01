/* --- NAVBAR (top) --- */
// NOTES:
// Internal links: Must have a corresponding folder with a README.md file
// Links must be absolute with trailing slash '/guide/'
// Trailing slash implies it is looking for a .md file

module.exports = [
  {
    text: 'Getting Started',
    ariaLabel: 'Getting Started Menu',
    link: '/getting-started/',
    items: [
      {
        text: 'Agoric\'s Cosmic SwingSet',
        ariaLabel: 'Agoric\'s Cosmic SwingSet Menu',
        link: '/getting-started/',
      },
      {
        text: 'Timer Service',
        ariaLabel: 'Timer Service Link',
        link: '/getting-started/timer-service'
      },
      {
        text: 'Pixel Demo',
        ariaLabel: 'Pixel Demo Link',
        link: '/getting-started/pixel-demo'
      },
      {
        text: 'Tutorials',
        ariaLabel: 'Tutorials Menu',
        link: '/smart-contracts-tutorials/guess37-one',
        items: [
          {
            text: 'Guess 37 - One Participant',
            ariaLabel: 'Guess 37 - One Participant',
            link: '/smart-contracts-tutorials/guess37-one'
          },
          {
            text: 'Guess37 - Multiple Participants',
            ariaLabel: 'Guess37 Multiple Participants',
            link: '/smart-contracts-tutorials/guess37-multiple'
          }
        ]
      }
    ]
  },
  {
    text: 'ERTP', // spaces to add some distance to next link
    ariaLabel: 'ERTP Menu',
    link: '/ertp/guide/',
    items: [
      {
        text: 'Guide',
        ariaLabel: 'ERTP Guide Link',
        link: '/ertp/guide/'
      },
      {
        text: 'API',
        ariaLabel: 'ERTP API Link',
        link: '/ertp/api/mint'
      },
      {
        text: 'Github',
        ariaLabel: 'ERTP Github Link',
        link: 'https://github.com/Agoric/ERTP'
      }
    ]
  },
  {
    text: 'Zoe',
    ariaLabel: 'Zoe Menu',
    link: '/zoe/guide',
    items: [
      {
        text: 'Guide',
        ariaLabel: 'Zoe Guide Link',
        link: '/zoe/guide/'
      },
      {
        text: 'Contracts',
        ariaLabel: 'Zoe Contracts Link',
        link: '/zoe/guide/contracts/autoswap'
      },
      {
        text: 'API',
        ariaLabel: 'Zoe API',
        link: '/zoe/api/'
      },
      {
        text: 'Github',
        ariaLabel: 'Zoe Github Link',
        link: 'https://github.com/Agoric/Zoe'
      }
    ],
  },
  {
    text: 'Learn More',
    ariaLabel: 'Learn More Menu',
    items: [
      {
        text: 'Contributing',
        ariaLabel: 'Contributing',
        link: '/miscellaneous/contributing'
      },
      {
        text: 'Agoric',
        ariaLabel: 'Agoric Homepage Link',
        link: 'https://agoric.com/'
      }
    ]
  },
  {
    text: 'Github',
    ariaLabel: 'Agoric Github Link',
    link: 'https://github.com/Agoric/'
  }
]
