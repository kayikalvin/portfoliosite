import { Code, Database, Brain, BarChart3, Cpu } from "lucide-react";


// projects
export const projects = [
  {
    title: "Dantra Limited - FMCG Distributor Website",
    description:
      "🌍 Professional web platform for Dantra Limited, a leading FMCG distributor in Kenya. Showcases services, product categories, and brand partnerships with a sleek, mobile-first React interface.",
    tech: [
    "React",
    "Tailwind CSS",
    "Framer Motion",
    "Lucide Icons",
    "shadcn/ui",
    "JavaScript",
    "Vite",
    "Vercel"
  ],
  gradient: "bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg",
  code: "https://github.com/kayikalvin/dantra-limited",
  url: "https://dantra-limited.vercel.app/",
  markdown: `
# 🌍 Dantra Limited - FMCG Distributor Website

## Project Description

A professional, mobile-responsive website for **Dantra Limited**, an FMCG distribution company based in Kenya. The platform highlights their services, showcases product categories, and provides seamless contact methods for manufacturers, wholesalers, and retailers.

## Key Features

###  Core Functionality
- ** Hero Section** with animated headline, tagline, and call-to-action buttons
- ** Product Category Display** for FMCG sectors (Beverages, Snacks, Personal Care, etc.)
- ** Services Showcase** highlighting FMCG-specific distribution capabilities
- ** Partnership Inquiry** with WhatsApp integration for direct messaging
- ** Click-to-Call** for quick communication
- ** Brand Partners Section** for visual representation of collaboration potential

###  User Experience
- ** Sleek, professional UI** with red-based gradient palette
- ** Framer Motion animations** for smooth transitions
- ** Fully mobile-responsive design** optimized for Kenya's mobile-first market
- ** Interactive buttons** for WhatsApp, email, and phone calls

###  Technical Capabilities
- ** React components** with reusable, scalable architecture
- ** Tailwind CSS utility-first styling** with modern gradients and shadows
- ** Lucide Icons & shadcn/ui** for clean UI elements
- ** Deployed via Vercel** for high performance and reliability

## Technologies Used

- ** React 18+**
- ** Tailwind CSS**
- ** Framer Motion**
- ** Lucide React Icons**
- ** shadcn/ui**
- ** Vite**
- ** Vercel Deployment**

## Use Cases

- ** Company Showcase**: Highlights Dantra Limited’s distribution expertise.
- ** Business Partnerships**: Easy contact options for manufacturers, wholesalers, and retailers.
- ** Online Presence**: Modern platform that builds credibility and brand authority.

## Project Impact

The site enhances Dantra Limited's professional image, streamlines partnership inquiries, and provides a visually engaging platform for business connections in Kenya's fast-growing FMCG market.

## Future Enhancements

- ** Product Catalog Integration** with dynamic inventory
- ** Interactive Distribution Map**
- ** Market Insights Dashboard**
- ** Multi-Language Support** for broader reach
`,
}


  ,
  {
    title: "Sonar-Rock-vs-Mine-UI",
    description:
      " Advanced machine learning-powered web application that analyzes sonar signatures to classify underwater objects as mines or rocks. Features real-time classification, confidence scoring, and comprehensive data validation with a modern React interface.",
    tech: ["React", "Machine Learning", "Tailwind CSS", "Lucide Icons", "JavaScript"],
    gradient: "bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg",
    code: "https://github.com/kayikalvin/sonar-rock-vs-mine-ui",
    url: "https://sonar-rock-vs-mine-ui.vercel.app/",
    markdown: `
#  Sonar Mine vs Rock Classification System

## Project Description

A machine learning-powered web application that analyzes sonar signatures to classify underwater objects as mines or rocks. The system processes 60-dimensional sonar feature data to provide real-time classification with confidence scoring, making it valuable for maritime safety and naval operations.

## Key Features

###  Core Functionality
- ** Real-time classification** of sonar signatures into Mine/Rock categories
- ** Confidence scoring** with probability estimates (70-100%)
- ** Comprehensive input validation** with user-friendly error messages
- ** Pre-loaded sample data** for demonstration and testing

###  User Experience
- ** Modern, responsive React interface** with gradient styling
- ** One-click clipboard integration** for sample data
- ** Real-time feature count validation**
- ** Visual feedback** with loading states and color-coded results

###  Technical Capabilities
- ** Processes exactly 60 normalized numerical features** (0-1 range)
- ** Handles CSV-formatted sonar data** input
- ** Robust error handling** for invalid inputs
- ** Mobile-responsive design** with accessibility support

## Technologies Used

### Frontend Stack
- ** React 18+** with modern hooks architecture
- ** Tailwind CSS** for utility-first styling
- ** Lucide React** for customizable icons
- ** Responsive Design** with mobile-first approach

### Integration Ready
- ** Mock prediction logic** (ready for ML API integration)
- ** RESTful API endpoint** structure
- ** JSON data processing**
- ** Production deployment** configuration

## Use Cases

- ** Maritime Safety**: Detect potentially dangerous underwater mines
- ** Naval Operations**: Assist in underwater object identification
- ** Research & Development**: Test and validate sonar classification algorithms
- ** Educational Tool**: Demonstrate machine learning classification concepts

## Project Impact

The application combines advanced signal processing concepts with an intuitive user interface, making complex sonar data analysis accessible to both technical and non-technical users. It demonstrates practical machine learning implementation in a real-world maritime safety context.

## Demo & Testing

The system includes three pre-loaded test cases:
- ** Rock samples**: Low-density objects with smooth surface characteristics
- ** Mine samples**: High-density metallic objects with irregular surfaces
- ** Validation testing**: Edge cases for input validation

## Future Enhancements

- ** Batch processing** for multiple sonar signatures
- ** Data visualization** with feature pattern charts
- ** Export functionality** for results
- ** Advanced analytics** and insights
- ** Real-time processing** capabilities
`,
  },
  {
    title: "Kenyan Real Estate Website",
    description:
      " Full-stack real estate platform connecting clients, landlords, and administrators through property listings, real-time messaging, and payment processing. Features role-based dashboards, Google Maps integration, M-Pesa payments, and comprehensive property management with secure JWT authentication.",
    tech: ["React", "Machine Learning", "Tailwind CSS", "Lucide Icons", "JavaScript"],
    gradient: "bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg",
    code: "https://github.com/kayikalvin/real-estate",
    url: "https://real-estate-psi-weld.vercel.app/",
    markdown: `
    #  Real Estate Web Application

## Project Description

A full-stack real estate platform designed to connect **🏘️ clients**, **🏠 landlords**, and **🛠️ administrators** through a comprehensive property management system. The platform streamlines the real estate process by providing property browsing, listing management, real-time communication, and integrated payment processing.

## Key Features

###  Core Functionality
- ** Property Management**: Complete CRUD operations for property listings
- ** Real-time Communication**: Socket.IO-powered chat between clients and landlords
- ** Location Integration**: Google Maps API for property location visualization
- ** Payment Processing**: M-Pesa API integration for landlord subscription payments
- ** Role-based Access**: Three distinct user roles with specific permissions

###  User Experience
- ** Public Website**: Browse properties with advanced search and filtering
- ** Responsive Design**: Mobile-friendly interface across all devices
- ** Role-based Dashboards**: Secure dashboards for landlords and administrators
- ** Media Management**: Image and video uploads for property listings
- ** Review System**: Client reviews and ratings for properties

###  Technical Capabilities
- ** JWT Authentication**: Secure token-based authentication system
- ** RESTful API**: Well-structured API endpoints for all operations
- ** Real-time Features**: Live messaging and notifications
- ** Cloud Integration**: Media hosting and database management
- ** Analytics Ready**: Foundation for dashboard analytics and reporting

## Technologies Used

### Frontend Stack
- ** React** with React Router DOM for navigation
- ** Tailwind CSS** for modern, responsive styling
- ** Material-UI (MUI)** for data grids and UI components
- ** Google Maps API** for location services
- ** Socket.IO Client** for real-time messaging

### Backend Stack
- ** Node.js & Express.js** server framework
- ** MongoDB** with Mongoose ODM for data management
- ** JWT & bcrypt** for authentication and password security
- ** Socket.IO** for real-time chat server
- ** M-Pesa API** for payment processing (Kenya)
- ** Cloudinary** for media file hosting

### Deployment & Infrastructure
- ** Vercel** for frontend hosting
- ** Render** for backend deployment
- ** MongoDB Atlas** for cloud database
- ** Secure Architecture** with protected routes and middleware

## User Roles & Permissions

###  Clients
- ** Public Access**: Browse and search property listings
- ** Property Details**: View detailed property information with media
- ** Direct Communication**: Message landlords in real-time
- ** Reviews**: Leave ratings and reviews for properties
- ** Authentication Required**: Login needed for detailed property access

###  Landlords
- ** Dashboard Access**: Secure landlord management portal
- ** Property Management**: Create, update, and delete listings
- ** Media Uploads**: Add images and videos to properties
- ** Client Communication**: Respond to inquiries in real-time
- ** Payment Integration**: Monthly payments via M-Pesa
- ** Listing Analytics**: Track property status and performance

###  Administrators
- ** Full Control**: Complete system administration capabilities
- ** User Management**: Manage all clients and landlords
- ** Property Oversight**: Full CRUD operations on all listings
- ** Payment Monitoring**: Track all transactions and payments
- ** Analytics Dashboard**: System-wide analytics and reporting
- ** Content Moderation**: Review and moderate user content

## Use Cases

- ** Property Discovery**: Help clients find suitable rental properties
- ** Property Management**: Assist landlords in managing their listings
- ** Business Operations**: Streamline real estate business processes
- ** Market Expansion**: Scale real estate operations across regions
- ** Data Analytics**: Gather insights on property market trends

## Project Impact

The application addresses key challenges in the real estate industry by providing a centralized platform that eliminates communication barriers, streamlines property management, and facilitates secure transactions. It demonstrates modern web development practices with real-world business applications.

## Real-time Features

###  Messaging System
- ** Socket.IO Integration**: Instant messaging between users
- ** Live Notifications**: Real-time message alerts
- ** Message Persistence**: Chat history stored in database
- ** Connection Management**: Automatic reconnection and status tracking

###  Payment Workflow
- ** M-Pesa Integration**: Mobile money payments for Kenya
- ** STK Push**: Direct payment prompts to user phones
- ** Payment Verification**: Automatic status updates
- ** Transaction Tracking**: Complete payment history

## Future Enhancements

- ** AI-powered Property Matching**: Intelligent recommendation system
- ** Advanced Analytics**: Dashboard insights for all user roles
- ** Progressive Web App**: Offline functionality and app-like experience
- ** Notification System**: Email and SMS alerts
- ** Document Generation**: Automated invoice and contract creation
- ** Multi-region Support**: Expand beyond Kenya market
    `
  },
  {
  title: "DigiMagicTech FAQ Bot",
  description:
    "🤖 AI-powered FAQ chatbot that delivers instant answers to user queries with a sleek React-based interface, designed for seamless interaction and fast performance.",
  tech: [
    "React",
    "Tailwind CSS",
    "OpenAI API",
    "Framer Motion",
    "Lucide Icons",
    "Vite",
    "Vercel"
  ],
  gradient: "bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg",
  code: "https://github.com/<your-github-username>/digimagictech-faq-bot",
  url: "https://digimagictech-faq-bot.vercel.app/",
  markdown: `
#  DigiMagicTech FAQ Bot

## Project Description

An intelligent FAQ chatbot designed for **DigiMagicTech** to provide real-time answers to frequently asked questions. Built with a modern React interface, it ensures fast response times, clean UI, and a smooth user experience.

## Key Features

###  Core Functionality
- ** AI-Powered Responses** using OpenAI API (or custom NLP logic)
- ** Predefined and Dynamic Answers** for user queries
- ** Real-Time Feedback** with typing indicators and smooth animations
- ** Fully mobile-responsive design** for seamless interaction across devices

###  User Experience
- ** Minimalist UI** with gradient styling and clean typography
- ** Framer Motion animations** for engaging interactions
- ** Quick response interface** with conversational design

###  Technical Capabilities
- ** React components** for modular structure
- ** Tailwind CSS** for rapid styling and responsive layout
- ** OpenAI API** integration for AI-driven responses
- ** Deployed via Vercel** for global scalability and performance

## Technologies Used

- ** React 18+**
- ** Tailwind CSS**
- ** OpenAI API**
- ** Framer Motion**
- ** Lucide React Icons**
- ** Vite**
- ** Vercel Deployment**

## Use Cases

- ** Customer Support**: Answer user queries instantly
- ** Knowledge Base Access**: Provide structured information quickly
- ** Demo AI Capabilities**: Showcase chatbot interaction for business

## Project Impact

This chatbot streamlines customer support by providing quick and accurate responses while showcasing DigiMagicTech's technical capabilities in AI-powered web applications.

## Future Enhancements

- ** Voice-Based Interaction**
- ** Query Analytics Dashboard**
- ** Multi-Language Support**
- ** Advanced Context Awareness** for follow-up questions
`,
},
{
  "title": "Gym Sable One - Fitness Landing Page",
  "description":
    " A sleek and modern fitness website showcasing gym programs, membership plans, and services with a responsive React-based interface and smooth animations.",
  "tech": [
    "React",
    "Tailwind CSS",
    "Framer Motion",
    "Lucide Icons",
    "Vite",
    "Vercel"
  ],
  "gradient": "bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg",
  "code": "https://github.com/kayikalvin/gym",
  "url": "https://gym-sable-one.vercel.app/",
  "markdown": `
#  Gym Sable One - Fitness Landing Page

## Project Description

A modern and responsive web application designed to showcase gym facilities, fitness programs, and membership plans. The platform emphasizes a sleek design and smooth user experience to attract fitness enthusiasts and potential members.

## Key Features

###  Core Functionality
- ** Hero Section** with strong visual appeal and call-to-action buttons
- ** Program Highlights** showcasing various training options
- ** Membership Plans** with pricing and package details
- ** Fully mobile-responsive design** for seamless browsing across devices

###  User Experience
- ** Clean, modern UI** with gradient styling
- ** Framer Motion animations** for smooth transitions and interactivity
- ** Intuitive navigation** for quick access to information

###  Technical Capabilities
- ** React components** for modular and scalable design
- ** Tailwind CSS** for responsive, utility-first styling
- ** Lucide Icons** for modern iconography
- ** Deployed via Vercel** for high performance and reliability

## Technologies Used

- ** React 18+**
- ** Tailwind CSS**
- ** Framer Motion**
- ** Lucide React Icons**
- ** Vite**
- ** Vercel Deployment**

## Use Cases

- ** Gym & Fitness Centers**: Showcase services and membership plans
- ** Online Presence**: Attract potential clients with a modern, fast-loading website
- ** Marketing Tool**: Engage fitness enthusiasts through visually appealing design

## Project Impact

This web application enhances the digital presence of fitness businesses, improves user engagement, and provides a clear overview of gym services and programs.

## Future Enhancements

- ** Class Scheduling Integration**
- **🧑 Trainer Profile Pages**
- ** Online Membership Sign-Up & Payments**
- ** Fitness Progress Tracking Dashboard**
`,
}


];
 

// skills
export const skills = [
  {
    name: "Python",
    level: 95,
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    iconColor: "text-blue-400",
  },
  {
    name: "JavaScript/React",
    level: 90,
    icon: Code,
    color: "from-yellow-500 to-orange-500",
    iconColor: "text-yellow-400",
  },
  {
    name: "Machine Learning",
    level: 88,
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    iconColor: "text-purple-400",
  },
  {
    name: "Data Analysis",
    level: 92,
    icon: BarChart3,
    color: "from-green-500 to-emerald-500",
    iconColor: "text-green-400",
  },
  {
    name: "SQL/NoSQL",
    level: 85,
    icon: Database,
    color: "from-red-500 to-rose-500",
    iconColor: "text-red-400",
  },
  {
    name: "Cloud/DevOps",
    level: 80,
    icon: Cpu,
    color: "from-indigo-500 to-blue-500",
    iconColor: "text-indigo-400",
  },
];

// posts
export const posts = [
  {
    title: "Building Scalable ML Platforms with Kubernetes",
    link: "#",
  },
  {
    title: "Designing Data-Driven Dashboards Users Actually Love",
    link: "#",
  },
];

 