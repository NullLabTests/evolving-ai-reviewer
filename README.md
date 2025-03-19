
# AI Scientist - Self-Evolving Research System

![AI Scientist Banner](/public/og-image.png)

## Project Overview

AI Scientist is an autonomous AI system that generates research papers, evolves its capabilities, and leverages peer review to validate findings. This system allows you to create research content on any topic, with options to integrate with ArXiv data for deeper analysis.

## Features

- **Research Generation**: Generate comprehensive research papers on any topic
- **ArXiv Integration**: Leverage ArXiv data for in-depth analysis and citations
- **Depth Control**: Choose between quick analysis or deep, thorough research
- **Peer Review System**: Review AI-generated research with an integrated peer review system
- **Evolution Tracking**: Monitor how the AI system evolves and improves over time
- **Interactive Dashboard**: View metrics and insights about generated research

## Demo

[View the live demo](https://your-demo-link.com) (add your deployment link when available)

## Screenshots

![Dashboard](/public/placeholder.svg)
![Research Generation](/public/placeholder.svg)
*(Replace with actual screenshots of your application)*

## Getting Started

### Prerequisites

- Node.js (v14+) & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone https://github.com/your-username/ai-scientist.git

# Navigate to the project directory
cd ai-scientist

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:8080

## Usage

1. **Generate Research**: Navigate to the Research page and enter a topic
2. **Configure Settings**: Choose research depth and whether to use ArXiv data
3. **View Results**: Review the generated research paper
4. **Track Progress**: Use the Dashboard to monitor system metrics

## Deployment Options

You can deploy this project using various free hosting options:

1. **GitHub Pages**: Free hosting for static sites directly from your GitHub repository
   - Instructions: https://pages.github.com/

2. **Netlify**: Free tier with generous limits
   - Instructions: https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/

3. **Vercel**: Free for personal projects
   - Instructions: https://vercel.com/docs/concepts/deployments/overview

4. **Cloudflare Pages**: Free hosting with generous build minutes
   - Instructions: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-application/

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router
- **Data Visualization**: Recharts
- **Form Handling**: React Hook Form, Zod

## Project Structure

```
ai-scientist/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and services
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
└── ...                   # Configuration files
```

## Future Enhancements

- Integration with additional research databases
- Enhanced PDF export functionality
- Collaborative research features
- Mobile application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [ArXiv](https://arxiv.org/) for providing access to research papers
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- All contributors and supporters of this project
