import 'package:flutter/material.dart';
import 'package:gsb_pharmacy_app/screens/home_screen.dart';
import 'package:gsb_pharmacy_app/screens/orders_screen.dart';
import 'package:gsb_pharmacy_app/screens/stock_screen.dart';
import 'package:gsb_pharmacy_app/screens/invoices_screen.dart';
import 'package:gsb_pharmacy_app/screens/profile_screen.dart';

/// Écran principal de l'application
/// Gère la navigation entre les différents écrans
class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0; // Index de l'onglet sélectionné

  // Liste des écrans disponibles
  final List<Widget> _screens = [
    const HomeScreen(),
    const OrdersScreen(),
    const StockScreen(),
    const InvoicesScreen(),
    const ProfileScreen(),
  ];

  /// Gère le changement d'onglet
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Affichage de l'écran sélectionné
      body: _screens[_selectedIndex],
      // Barre de navigation inférieure
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        selectedItemColor: Theme.of(context).colorScheme.primary,
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Accueil',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: 'Commandes',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.inventory),
            label: 'Stocks',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long),
            label: 'Factures',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
