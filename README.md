# ➕ Ansökshjälpen - A Work Aids Application Bot

A standalone web application that helps people with disabilities draft accurate, regulation-compliant applications for work aids (arbetshjälpmedel) to Försäkringskassan. The application uses AI-powered conversational guidance to simplify the complex application process and ensure users submit complete, well-formatted applications.

## 🎯 Purpose

This application addresses the challenge many people with disabilities face when applying for work aids from Försäkringskassan. By providing an intelligent, conversational interface powered by a customized GPT model, users receive step-by-step guidance to create accurate applications.

Additionally, the application features an interview practice mode where users can engage in simulated conversations with our AI interviewer to prepare for the real Försäkringskassan interview process, helping build confidence and familiarity with typical questions and procedures.

## ✨ Key Features

### User Experience

- **Conversational Interface**: Interactive chat-based experience that guides users through the application process
- **Anonymous Access**: No login required - users can complete applications without registration
- **Session Management**: Application progress stored securely for up to 100 days using encrypted tokens
- **Accessibility Compliant**: Interface meets WCAG standards

### Administrative Features

- **Centralized Question Management**: All application questions managed through admin interface
- **Dynamic GPT Configuration**: Update AI prompts and knowledge base without code changes
- **Content Management**: Easy updates to help text, instructions, and regulatory information

## 🛠️ Technical Stack

### Frontend

- **Next.js**: React-based framework for server-side rendering and optimal performance
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Accessible component library built on Radix UI primitives

### Backend

- **Express.js**: Web framework for REST API endpoints
- **OpenAI API**: GPT integration with customized system prompts for Försäkringskassan-specific guidance

### Data & Security

- **Supabase**: Secure third party database system with an easy to use web interface
- **Encrypted Session Storage**: Temporary data storage using secure, encrypted cookies
- **Token-based Sessions**: 100-day session persistence without user accounts

## 💡 Core Functionalities

### Chat Interface

- **Intelligent Questioning**: GPT model asks relevant questions based on user's disability type and work situation
- **Context Awareness**: Maintains conversation context throughout the application process
- **Validation**: Real-time validation of responses against Försäkringskassan requirements
- **Progress Tracking**: Visual indicators showing application completion status

### Session Management

- **Temporary Storage**: No permanent user data storage - sessions expire after 100 days
- **Resume Capability**: Users can return to incomplete applications using session tokens
- **Data Security**: All session data encrypted using industry-standard encryption

### Admin Configuration

- **Question Management**: Add, edit, and organize application questions without code changes
- **GPT Prompt Tuning**: Adjust AI responses and guidance for optimal user experience

## 👥 Made By

- [@Daniel](https://github.com/Dantilldev)
- [@Embla](https://github.com/emblaah)
- [@Jan](https://github.com/t-kupp)
- [@Joel](https://github.com/Joel050505)
- [@Zarha](https://github.com/zarhaselene)

#### This project was created as a challenge project for Chas Academy.
