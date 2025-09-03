# Afya Bora - Your Personal Health Companion

A comprehensive healthcare application designed specifically for the Tanzanian healthcare landscape, featuring AI-powered prescription analysis, personalized nutrition plans, and health tracking.

## 🚀 New Features

### Authentication System
- **Email Authentication**: Secure sign-in and sign-up with Firebase Authentication
- **Protected Routes**: All app features require authentication
- **User Profiles**: Persistent user data across sessions

### Premium Landing Page
- **Modern Design**: Sleek, premium UI with healthcare-focused design
- **Interactive Elements**: Smooth animations and transitions
- **Responsive Layout**: Optimized for all device sizes
- **Feature Showcase**: Comprehensive overview of app capabilities

### Health Data Tracking
- **Initial Measurements**: Record baseline health metrics during onboarding
- **Weekly Updates**: Easy weekly health data input
- **Real-time Charts**: Interactive charts showing health progress
- **Data Persistence**: All health data stored securely in Firebase

## 🏥 Core Features

### AI-Powered Prescription Analysis
- Upload prescription images (PDF, JPG, PNG)
- AI OCR text extraction
- Camera capture functionality
- Prescription data integration

### Personalized Nutrition Plans
- 7-day meal plans based on prescription
- Local Tanzanian ingredients
- Allergy and condition considerations
- Shopping list generation

### Health Monitoring
- Weight tracking with trend analysis
- Blood sugar monitoring (FBS/PPBS)
- Blood pressure tracking
- Progress visualization

### Local Marketplace Integration
- Connect with local vendors
- Fresh ingredient sourcing
- Meal delivery options

### Fitness & Workouts
- Gym recommendations
- Personalized workout plans
- Exercise tracking

## 🛠️ Technical Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **AI**: Custom AI flows for prescription analysis

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Afya-bora-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Set up Firestore database
   - Update Firebase config in `src/lib/firebase.ts`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - You'll be redirected to the landing page
   - Sign up or sign in to access the app

## 📱 App Structure

- `/` - Redirects to landing page
- `/landing` - Premium landing page with feature showcase
- `/auth` - Authentication page (sign in/sign up)
- `/dashboard` - Main application (protected route)

## 🔐 Authentication Flow

1. Users visit the landing page
2. Click "Get Started" or "Sign In"
3. Complete email authentication
4. Access the main app with full features
5. All data is tied to their authenticated account

## 📊 Health Tracking

### Initial Setup
- Users provide baseline health measurements during onboarding
- Data includes weight, blood sugar, and blood pressure
- All measurements are optional but recommended

### Weekly Updates
- Users can update measurements weekly
- Data is stored with timestamps
- Charts automatically update with new data
- Progress tracking over time

## 🎨 Design System

- **Primary Color**: Green (#4CAF50) - representing health and wellness
- **Secondary Colors**: Blue and accent colors for variety
- **Typography**: Clean, readable fonts
- **Icons**: Lucide React icons throughout
- **Components**: Consistent UI components from Shadcn/ui

## 🔒 Security & Privacy

- All user data is encrypted
- Firebase Authentication for secure access
- Prescription images processed securely
- Data stored in Firebase with proper access controls
- GDPR-compliant data handling

## 🌟 Key Benefits

- **Personalized Care**: AI-driven recommendations based on medical prescriptions
- **Local Focus**: Designed for Tanzanian healthcare needs
- **Comprehensive Tracking**: Complete health journey monitoring
- **User-Friendly**: Intuitive interface for all users
- **Secure**: Enterprise-grade security and privacy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Afya Bora** - Transforming healthcare in Tanzania through technology and AI.
