# Home Inventory App

A web application for managing home inventory across multiple houses. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 User authentication (sign up/sign in)
- 🏠 Multiple house management
- 🚪 Room organization within houses
- 📦 Detailed item cataloging
- 🔍 Global search functionality
- 💻 Responsive design
- 🎨 Clean, modern UI with proper contrast

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Prerequisites

Before you begin, ensure you have:
- Node.js 16.8 or later
- npm or yarn
- A Supabase account and project

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/home-inventory-app.git
   cd home-inventory-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**:
   
   Run the SQL scripts in your Supabase SQL Editor (see Database Setup section below)

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open the app**:
   
   Visit [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties Table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Continue with all other tables...
-- (See the original database schema file for complete SQL)
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── search/            # Search page
├── components/            # React components
│   ├── Auth.tsx           # Authentication form
│   ├── Dashboard.tsx      # Main dashboard
│   ├── HouseList.tsx      # House management
│   ├── RoomList.tsx       # Room management
│   ├── ItemList.tsx       # Item management
│   └── Navigation.tsx     # Navigation bar
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility functions
│   └── supabase.ts        # Supabase client
└── types/                 # TypeScript types
    └── database.ts        # Database types
```

## Features in Detail

### House Management
- Create, read, update, and delete houses
- Each user can manage multiple houses
- Houses can have multiple rooms and items

### Room Management
- Add rooms/sublocations to houses
- Specify floor information
- Associate items with specific rooms

### Item Management
- Comprehensive item details:
  - Name, description, category
  - Brand, model number, serial number
  - Purchase date and price
  - Current value and condition
  - Notes and additional information
- Search items within a house
- Global search across all houses

### Search Functionality
- Search across all items in all houses
- Search by multiple fields
- Real-time results

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Configure environment variables
5. Deploy!

## Future Enhancements

- [ ] Photo upload for items (up to 4 photos per item)
- [ ] S3 integration for photo storage
- [ ] Export/import functionality
- [ ] Advanced reporting and analytics
- [ ] Mobile app version
- [ ] Barcode scanning
- [ ] Item categories management
- [ ] User preferences and settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Supabase](https://supabase.com/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

## Support

For support, please open an issue in the GitHub repository.

---

Made with ❤️ for better home organization