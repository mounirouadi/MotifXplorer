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
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger icon */}
                            {!isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 justify-center items-center">
                            <h1 className="text-[27px] mb-1 text-center font-semibold ml-2 lg:block" style={textGardient}>MotifXplorer</h1>
                        </div>
                    </div>

                    {/* Desktop menu */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div className="hidden sm:ml-2 sm:block">
                            <div className="flex space-x-1">
                                <Link to="/" className="text-dark hover:underline px-3 py-2 text-md font-medium" aria-current="page">Home</Link>
                                <Link to="/team" className="text-dark hover:underline px-3 py-2 text-md font-medium">Team</Link>
                                <Link to="/docs" className="text-dark hover:underline px-3 py-2 text-md font-medium">Docs</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {isMobileMenuOpen && (
                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Link
                            to="/"
                            className="text-gray-700 hover:bg-gray-300 hover:text-gray-900 block rounded-md px-3 py-2 text-base font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/team"
                            className="text-gray-700 hover:bg-gray-300 hover:text-gray-900 block rounded-md px-3 py-2 text-base font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Team
                        </Link>
                        <Link
                            to="/docs"
                            className="text-gray-700 hover:bg-gray-300 hover:text-gray-900 block rounded-md px-3 py-2 text-base font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Docs
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
