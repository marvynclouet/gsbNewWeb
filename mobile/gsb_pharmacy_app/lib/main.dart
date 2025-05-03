import 'package:flutter/material.dart';
import 'package:gsb_pharmacy_app/screens/login_screen.dart';
import 'package:gsb_pharmacy_app/screens/main_screen.dart';
import 'package:gsb_pharmacy_app/screens/order_details_screen.dart';
import 'package:gsb_pharmacy_app/screens/orders_screen.dart';
import 'package:gsb_pharmacy_app/screens/stock_screen.dart';
import 'package:gsb_pharmacy_app/screens/invoice_screen.dart';
import 'package:gsb_pharmacy_app/screens/transaction_screen.dart';
import 'package:gsb_pharmacy_app/theme/app_theme.dart';
import 'package:gsb_pharmacy_app/services/api_service.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Forcer l'orientation portrait
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GSB Pharmacy',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/main': (context) => const MainScreen(),
        '/order-details': (context) => const OrderDetailsScreen(),
        '/orders': (context) => const OrdersScreen(),
        '/stocks': (context) => const StockScreen(),
        '/invoices': (context) => const InvoiceScreen(),
        '/transactions': (context) => const TransactionScreen(),
      },
    );
  }
}
