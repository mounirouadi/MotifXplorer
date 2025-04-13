import { useState } from 'react';
import logo from '../static/neurox-1.png';
import { Link } from 'react-router-dom'; // Import Link from React Router

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const textGardient = {
        backgroundImage: 'linear-gradient(to bottom, var(--primary-1), var(--primary-2))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    return (
        <nav className="bg-gray-200">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* ... */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* ... */}
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 justify-center items-center">
                            <h1 className="text-[27px] mb-1 text-center font-semibold ml-2 lg:block" style={textGardient}>MotifXplorer</h1>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div className="hidden sm:ml-2 sm:block">
                            <div className="flex space-x-1">
                                <Link to="/" className="text-dark hover:underline px-3 py-2 text-md font-medium" aria-current="page">Home</Link>
                                <Link to="/team" className="text-dark hover:underline px-3 py-2 text-md font-medium">Team</Link>
                                <Link to="/docs" className="text-dark hover:underline px-3 py-2 text-md font-medium">Docs</Link> {/* Link to your docs page */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
