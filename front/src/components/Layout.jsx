import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  className="h-12 w-auto"
                  src={logo}
                  alt="GSB Pharmacy"
                />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  GSB Pharmacy
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="text-gray-900 hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary"
              >
                Accueil
              </Link>
              <Link
                to="/medicaments"
                className="text-gray-900 hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary"
              >
                Médicaments
              </Link>
              <Link
                to="/cart"
                className="text-gray-900 hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary"
              >
                Panier
              </Link>
              <Link
                to="/contact"
                className="text-gray-900 hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                À propos
              </h3>
              <p className="text-gray-600">
                GSB Pharmacy est votre pharmacie en ligne de confiance, offrant des produits pharmaceutiques de qualité.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact
              </h3>
              <p className="text-gray-600">
                Email: contact@gsb-pharmacy.fr<br />
                Téléphone: 01 23 45 67 89
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Liens utiles
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-primary">
                    Nous contacter
                  </Link>
                </li>
                <li>
                  <Link to="/mentions-legales" className="text-gray-600 hover:text-primary">
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 